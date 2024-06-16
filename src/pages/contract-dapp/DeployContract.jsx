import React, { useState } from "react";
import {
  Operation,
  TimeoutInfinite,
  StrKey,
  Address,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
// import arrayBufferToBuffer from "arraybuffer-to-buffer";

import {
  server,
  getTxBuilder,
  FUTURENET_DETAILS,
  BASE_FEE,
  submitTx,
} from "../../utils/soroban";

import {
  BuyCrypto,
  SecuritySafe,
  People,
  CodeCircle,
  DocumentCode,
  AddCircle,
} from "iconsax-react";
import { Command } from "iconsax-react";
import { CommandSquare } from "iconsax-react";
import { Copy } from "iconsax-react";
import XLMlogo from "../../assets/2024.svg";

export default function DeployContract({
  userKey,
  setUserKey,
  setNetwork,
  setLoadedContractId,
  setDeploySelected,
  connecting,
  setConnecting,
}) {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [contractAddr, setContractAddr] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileBuffer = event.target.result;
      setFileContent(() => fileBuffer);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  async function loadContractHandler() {
    if (await StrKey.isValidContract(contractAddr)) {
      setLoadedContractId(() => contractAddr);

      setDeploySelected(() => false);
    }
  }

  const selectedNetwork = FUTURENET_DETAILS;
  const { network, networkPassphrase } = selectedNetwork;

  async function handleCreateContract(e) {
    e.preventDefault();
    // const wasmFile =
    //   "../../../target/wasm32-unknown-unknown/release/soroban_token_contract.wasm";

    // const response = await fetch(wasmFile);
    // const bytes = await response.arrayBuffer();

    // console.log("hardcoded file", bytes);
    // console.log("selected file", fileContent);
    // // console.log("wasm hash value", wasmHash);

    try {
      setConnecting(() => true);
      const wasmFile = fileContent;

      const txBuilderUpload = await getTxBuilder(
        userKey,
        BASE_FEE,
        server,
        selectedNetwork.networkPassphrase
      );

      // const sender = (await server.getAccount(kp.publicKey()))._accountId;
      // const senderAddr1 = new Address(userKey);

      const uploadTx = txBuilderUpload
        .setTimeout(TimeoutInfinite)
        .addOperation(
          Operation.uploadContractWasm({
            wasm: wasmFile,
          })
        )
        .build();

      const preparedTransaction = await server.prepareTransaction(uploadTx);
      // this works for imported account
      // const signedTx = preparedTransaction.sign(kp);
      // const sendTxOracle = await server.sendTransaction(preparedTransaction);

      const xdr = preparedTransaction.toXDR();
      const signedTx = await signTransaction(xdr, { network: "FUTURENET" });
      const txHash = await submitTx(signedTx, networkPassphrase, server);

      const loadedWasmHash = txHash.returnValue._value;
      const senderAddr = new Address(userKey);
      // const consss = new Account(userKey, "31");

      const myAccount = await server.getLatestLedger();

      console.log("latest ledger print", myAccount);

      const txBuilderCreate = await getTxBuilder(
        userKey,
        BASE_FEE,
        server,
        selectedNetwork.networkPassphrase
      );

      const createTx = txBuilderCreate
        .setTimeout(TimeoutInfinite)
        .addOperation(
          Operation.createCustomContract({
            address: senderAddr,
            wasmHash: loadedWasmHash,
          })
        )
        .build();

      const preparedTransactionCreate = await server.prepareTransaction(
        createTx
      );

      const xdrCreate = preparedTransactionCreate.toXDR();
      const signedTx2 = await signTransaction(xdrCreate, {
        network: "FUTURENET",
      });
      const txHash2 = await submitTx(signedTx2, networkPassphrase, server);
      // const resttt = xdr.TransactionMeta.fromXDR(txHash2.resultMetaXdr);

      const contractId = StrKey.encodeContract(
        txHash2.returnValue._value._value
      );
      const isContract = StrKey.isValidContract(contractId);
      setContractAddr(() => contractId);

      // const contractDetails = new Contract(contractId).getFootprint();

      console.log("final value", contractId, isContract);
    } catch (e) {
      console.log(e.message);
    } finally {
      setConnecting(() => false);
    }
  }

  return (
    <div className="overflow-x-hidden bg-gray-100">
      <section className=" bg-gray-100 ">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-5xl mx-auto  space-y-4">
            {/* <div className="grid grid-cols-1 gap-6 px-8 text-center md:px-0 md:grid-cols-2">
              <Library />
            </div> */}
            <div className="gap-4 mt-4 mb-8 ">
              <div className=" p-2 pl-4">
                <h3 className="text-2xl font-normal  text-gray-900">
                  Select from contract library
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2 px-8  md:px-0 md:grid-cols-3">
                <div className="relative ">
                  <div className="relative p-4 overflow-hidden bg-white border border-gray-200 rounded-2xl">
                    <div className="flex items-start sm:items-center mb-1">
                      <BuyCrypto
                        size="32"
                        color="#000000"
                        className="flex-shrink-0 w-10 h-10  text-gray-400"
                      />

                      <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                        Token Contract
                      </p>
                    </div>
                    <p className="ml-4 text-xl font-small text-[14px] text-gray-700  font-pj">
                      Standard soroban token smart contract
                    </p>
                    <div className="p-1 bg-slate-200 absolute right-0 bottom-0 rounded-full z-10s">
                      <CodeCircle size="32" color="#555555" className="" />
                    </div>
                  </div>
                </div>
                <div className="relative ">
                  <div className="relative p-4 overflow-hidden bg-white border border-gray-200 rounded-2xl">
                    <div className="flex items-start sm:items-center mb-1">
                      <SecuritySafe
                        size="32"
                        color="#000000"
                        className="flex-shrink-0 w-10 h-10  text-gray-400"
                      />

                      <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                        Staking Contract
                      </p>
                    </div>
                    <p className="ml-4 text-xl font-small text-[14px] text-gray-700  font-pj">
                      Simple soroban staking smart contract
                    </p>
                    <div className="p-1 bg-slate-200 absolute right-0 bottom-0 rounded-full z-10s">
                      <CodeCircle size="32" color="#555555" className="" />
                    </div>
                  </div>
                </div>
                <div className="relative ">
                  <div className="relative p-4 overflow-hidden bg-white border border-gray-200 rounded-2xl">
                    <div className="flex items-start sm:items-center mb-1">
                      <People
                        size="32"
                        color="#000000"
                        className="flex-shrink-0 w-10 h-10  text-gray-400"
                      />

                      <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                        DAO Contract
                      </p>
                    </div>
                    <p className="ml-4 text-xl font-small text-[14px] text-gray-700  font-pj">
                      Simple soroban governance contract
                    </p>
                    <div className="p-1 bg-slate-200 absolute right-0 bottom-0 rounded-full z-10s">
                      <CodeCircle size="32" color="#555555" className="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" p-0 pl-4">
              <h3 className="text-2xl font-normal  text-gray-900">
                Upload contract build
              </h3>
            </div>

            <div className="relative mb-8">
              <div className="relative p-4 flex  overflow-hidden bg-white justify-between items-center border border-gray-200 rounded-2xl">
                <div>
                  <div className="flex items-center sm:items-center mb-1">
                    <DocumentCode
                      size="32"
                      color="#000000"
                      className="flex-shrink-0 w-10 h-10 text-gray-400"
                    />
                    <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                      Upload contract file here (.wasm)
                    </p>
                  </div>
                  <p className="ml-16 text-xl font-small text-[14px] text-gray-700 font-pj">
                    {file
                      ? `Selected file: ${file.name}`
                      : "Upload the build of the soroban contract you want to deploy here"}
                  </p>
                </div>

                <div className=" flex justify-center bg-[#FF8A65] bg-opacity-25 p-1 rounded-full">
                  <input
                    type="file"
                    accept=".wasm"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center  border border-transparent text-base leading-6 font-medium rounded-md  focus:shadow-outline-indigo  transition ease-in-out duration-150"
                  >
                    <AddCircle size="56" color="#FF8A65" />
                  </label>
                </div>
              </div>
            </div>

            {contractAddr.length > 0 && (
              <div className="relative mb-8">
                <div className="relative p-4 flex  overflow-hidden bg-white justify-between items-center border border-gray-200 rounded-2xl">
                  <div>
                    <div className="flex items-center sm:items-center mb-1">
                      <img
                        src={XLMlogo}
                        className="flex-shrink-0 w-12 h-12 text-gray-400"
                      />
                      <p className="ml-6 text-xl font-bold text-gray-900 text-[24px] font-pj">
                        Contract Created 🎊🥳
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <p className="ml-16 text-xl font-small text-[14px] text-gray-700 font-pj">
                        Contract Id: {contractAddr}{" "}
                      </p>
                      <Copy
                        size="16"
                        color="#000000"
                        className="flex-shrink-0 w-auto h-6 text-gray-400"
                      />
                    </div>
                  </div>

                  <button
                    className=" flex justify-center bg-[#FF8A65] bg-opacity-25 p-2 rounded-full"
                    onClick={loadContractHandler}
                  >
                    <CommandSquare size="50" color="#FF8A65" />
                  </button>
                </div>
              </div>
            )}

            {userKey?.length > 0 && (
              <div className="sm:col-span-2">
                <button
                  onClick={handleCreateContract}
                  className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  role="button"
                >
                  {connecting ? "Processing..." : "Create contract"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
