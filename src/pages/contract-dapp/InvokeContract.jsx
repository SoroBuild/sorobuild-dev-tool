import React, { useState } from "react";
import { ScInt, Soroban, StrKey, nativeToScVal } from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
// import arrayBufferToBuffer from "arraybuffer-to-buffer";

import {
  server,
  getTxBuilder,
  FUTURENET_DETAILS,
  mintTokens,
  xlmToStroop,
  submitTx,
  accountToScVal,
  anyInvoke,
} from "../../utils/soroban";

import { Copy, AddCircle, CloseCircle } from "iconsax-react";
import XLMlogo from "../../assets/2024.svg";

export default function InvokeContract({
  userKey,
  setUserKey,
  setNetwork,
  isWalletInstalled,
  setLoadedContractId,
  loadedContractId,
  connecting,
  setConnecting,
}) {
  const [selectedToken, setSelectedToken] = useState("");
  const [mintAmount, setMintAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [mintStatus, setMintStatus] = useState("PRE");
  const [argsCount, setArgsCount] = useState([]);
  const [args, setArgs] = useState([]);
  const [operation, setOperation] = useState("");
  const memo = "mint tokens";

  const selectedNetwork = FUTURENET_DETAILS;
  const { network, networkPassphrase } = selectedNetwork;

  function addArgsHandler() {
    let curCount = argsCount.length;
    const newCount = curCount + 1;
    setArgsCount(() => [...argsCount, newCount]);
    setArgs(() => [...args, { id: newCount, name: "", type: "", value: "" }]);
  }

  function deleteArgsHandler(selectedArg) {
    setArgsCount((prevArgsCount) =>
      prevArgsCount.filter((arg) => arg !== selectedArg)
    );

    setArgs((prevArgs) => prevArgs.filter((arg) => arg.id !== selectedArg));
  }

  function processArgs(arg) {
    if (arg.type === "i128") {
      const quantity = Soroban.parseTokenAmount(arg.value, 7);
      return new ScInt(quantity).toI128();
    } else if (arg.type === "Address") {
      return accountToScVal(arg.value); // to
    } else if (arg.type === "u32") {
      return nativeToScVal(Number(arg.value), { type: "u32" }); // to
    } else if (arg.type === "u64") {
      return nativeToScVal(Number(arg.value)); // to
    } else if (arg.type === "u64") {
      return nativeToScVal(Number(arg.value)); // to
    } else {
      return nativeToScVal(arg.value);
    }
  }

  async function anyInvokeHandler() {
    try {
      setConnecting(() => true);
      const invokeArgs = [operation];
      for (const eachArg of args) {
        invokeArgs.push(processArgs(eachArg));
      }
      console.log("the invoke arguments are", invokeArgs);

      const txBuiderAnyInvoke = await getTxBuilder(
        userKey,
        xlmToStroop(10).toString(),
        server,
        selectedNetwork.networkPassphrase
      );

      const xdr = await anyInvoke(
        loadedContractId,
        invokeArgs,
        "contract invocation",
        txBuiderAnyInvoke,
        server
      );
      console.log("transaction xdr", xdr);
      //   console.log("decimal processing", new ScInt(7));

      const signedXdr = await signTransaction(xdr, { network: "FUTURENET" });

      const result = await submitTx(signedXdr, networkPassphrase, server);
      console.log("invoke result", result);
    } catch (e) {
      alert(e.message);
    } finally {
      setConnecting(() => false);
    }
  }

  async function loadContractHandler() {
    if (await StrKey.isValidContract(selectedToken)) {
      setLoadedContractId(() => selectedToken);
    }
  }

  const copyHandler = () => {
    navigator.clipboard
      .writeText(loadedContractId)
      .then(() => {
        // console.log("Contract ID copied to clipboard:", loadedContractId);
        // Optionally, show a success message to the user
        alert("Contract ID copied!");
      })
      .catch((err) => {
        // console.error("Failed to copy text to clipboard:", err);
      });
  };

  async function mintSubmitHandler(e) {
    setMintStatus(() => "SIGN");
    e.preventDefault();
    const quantity = Soroban.parseTokenAmount(mintAmount, decimal);

    const txBuiderMint = await getTxBuilder(
      userKey,
      xlmToStroop(100).toString(),
      server,
      selectedNetwork.networkPassphrase
    );

    const xdr = await mintTokens({
      tokenId: selectedToken,
      quantity: Number(quantity),
      destinationPubKey: receiver,
      memo: memo,
      txBuilderAdmin: txBuiderMint,
      server,
    });

    // const signedTx = await signTx(xdr, userKey, FUTURENET_DETAILS);
    const signature = await signTransaction(xdr, { network: "TESTNET" });
    setMintStatus(() => "MINTING");

    const result = await submitTx(signature, networkPassphrase, server);
    setMintStatus(() => "PRE");
  }

  return (
    <div className="overflow-x-hidden bg-gray-100">
      <section className=" bg-gray-100 ">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-5xl mx-auto  space-y-4">
            <div className="mt-6 overflow-hidden  rounded-xl">
              <div className="px-4 py-6 sm:p-8 bg-white mb-3 rounded-xl">
                {!loadedContractId && (
                  <form
                    method="POST"
                    className="mt-2"
                    onSubmit={loadContractHandler}
                  >
                    <div className="grid grid-cols-1  gap-x-5 gap-y-4">
                      <div>
                        <div className=" p-2 ">
                          <h3 className="text-2xl font-normal  text-gray-900">
                            Enter contract ID
                          </h3>
                        </div>
                        <div className="mt-2.5 relative">
                          <input
                            onChange={(e) => setSelectedToken(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            placeholder="Paste contract ID here"
                            className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {loadedContractId.length > 0 && (
                  <>
                    <div className="relative ">
                      <div className="relative p-4 flex  overflow-hidden bg-white justify-between items-center border border-gray-200 rounded-2xl">
                        <div>
                          <div className="flex items-center sm:items-center mb-1">
                            <img
                              src={XLMlogo}
                              className="flex-shrink-0 w-12 h-12 text-gray-400"
                            />
                            <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                              Loaded contract can now be interated with
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <p className="ml-16 text-xl font-small text-[18px] text-gray-700 font-pj">
                              {loadedContractId}{" "}
                            </p>
                            <button onClick={copyHandler}>
                              <Copy
                                size="16"
                                color="#000000"
                                className="flex-shrink-0 w-auto h-6 text-gray-400"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {loadedContractId?.length > 0 && (
                <>
                  <div>
                    <div className="grid grid-cols-1  gap-x-5 gap-y-4">
                      <div className="px-4 py-4 sm:px-8 bg-white mb-3 rounded-xl">
                        <div className=" p-2 ">
                          <h3 className="text-2xl font-normal  text-gray-900">
                            Operation (function)
                          </h3>
                        </div>
                        <div className="mt-1 relative flex gap-2">
                          <input
                            onChange={(e) => setOperation(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            placeholder="Enter the operation you want to invoke"
                            className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                          />{" "}
                          <div className="sm:col-span-2 flex  rounded-xl items-center w-[220px] justify-between  border border-gray-700 ">
                            <button
                              className="relative flex items-center gap-3   px-4  text-lg font-bold text-white transition-all duration-200 font-pj rounded-xl  justify-between "
                              role="button"
                              onClick={addArgsHandler}
                            >
                              <AddCircle size="44" color="#000000" />{" "}
                              <p className="text-black">Add args</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {args.length > 0 && (
                    <div>
                      <div className="grid grid-cols-1  gap-x-5 gap-y-4">
                        <div className="px-4 py-4 sm:px-8 bg-white mb-3 rounded-xl">
                          <div className=" p-2 ">
                            <h3 className="text-2xl font-normal  text-gray-900">
                              Arguments
                            </h3>
                          </div>
                          {argsCount?.map((arg, index) => (
                            <div
                              className="mt-1 relative flex gap-2"
                              key={index}
                            >
                              <input
                                onChange={(e) => {
                                  setArgs(
                                    args.map((cur) =>
                                      cur.id === arg
                                        ? { ...cur, name: e.target.value }
                                        : cur
                                    )
                                  );
                                }}
                                type="text"
                                name=""
                                id=""
                                placeholder="Argument name"
                                className="block px-4 py-4 text-black placeholder-gray-500 w-[200px] transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                              />
                              <div className="">
                                <select
                                  className="block px-4 py-4 h-full text-black placeholder-gray-500 w-[150px] transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                  id="type-select"
                                  value={
                                    args.find((cur) => cur.id === arg)?.type
                                  }
                                  onChange={(e) => {
                                    setArgs(
                                      args.map((cur) =>
                                        cur.id === arg
                                          ? { ...cur, type: e.target.value }
                                          : cur
                                      )
                                    );
                                  }}
                                >
                                  <option value="select type">
                                    Select type
                                  </option>
                                  <option value="i128">i128</option>
                                  <option value="u32">u32</option>
                                  <option value="u64">u64</option>
                                  <option value="String">String</option>
                                  <option value="symbol">symbol</option>
                                  <option value="Address">Address</option>
                                </select>
                              </div>
                              <input
                                onChange={(e) => {
                                  setArgs(
                                    args.map((cur) =>
                                      cur.id === arg
                                        ? { ...cur, value: e.target.value }
                                        : cur
                                    )
                                  );
                                }}
                                type="text"
                                name=""
                                id=""
                                placeholder="Argument value"
                                className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                              />
                              <div className="sm:col-span-2 flex  rounded-xl items-center justify-between  ">
                                <button
                                  onClick={() => deleteArgsHandler(arg)}
                                  className="relative flex items-center gap-3   px-4  text-lg font-bold text-white transition-all duration-200 font-pj rounded-xl  justify-between "
                                  role="button"
                                >
                                  <CloseCircle size="44" color="#616161" />{" "}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              {userKey.length > 0 &&
                (loadedContractId?.length > 0 ? (
                  <div className="sm:col-span-2">
                    <button
                      // onClick={loadContractHandler}
                      onClick={anyInvokeHandler}
                      className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      role="button"
                    >
                      {connecting ? "Processing..." : "Invoke conract"}
                    </button>
                  </div>
                ) : (
                  <div className="sm:col-span-2">
                    <button
                      onClick={loadContractHandler}
                      className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      role="button"
                    >
                      Load contract
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
