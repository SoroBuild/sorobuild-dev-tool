import React, { useState } from "react";
import {
  Operation,
  Soroban,
  TimeoutInfinite,
  Keypair,
  Account,
  StrKey,
  Address,
  hash,
  MuxedAccount,
  Contract,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
// import arrayBufferToBuffer from "arraybuffer-to-buffer";

import {
  server,
  getTxBuilder,
  getTokenInfo,
  FUTURENET_DETAILS,
  BASE_FEE,
  mintTokens,
  xlmToStroop,
  submitTx,
  ConnectWallet,
  createContract,
} from "../../utils/soroban";

import {
  BuyCrypto,
  SecuritySafe,
  People,
  ElementPlus,
  FolderAdd,
} from "iconsax-react";

// const arrayBuffer = require("arraybuffer-to-buffer");

export default function ContractDapp({
  userKey,
  setUserKey,
  setNetwork,
  isWalletInstalled,
}) {
  const [connecting, setConnecting] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [mintAmount, setMintAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [mintStatus, setMintStatus] = useState("PRE");
  const memo = "mint tokens";

  const [tokenInfo, setTokenInfo] = useState({
    decimal: 0,
    name: " ",
    symbol: "",
  });

  const { decimal, name, symbol } = tokenInfo;

  const selectedNetwork = FUTURENET_DETAILS;
  const { network, networkPassphrase } = selectedNetwork;

  async function handleConnect() {
    setConnecting(() => true);
    await ConnectWallet(setUserKey, setNetwork);
    setConnecting(() => false);
  }

  async function handleCreateContract(e) {
    e.preventDefault();
    const wasmFile =
      "../../../target/wasm32-unknown-unknown/release/soroban_token_contract.wasm";
    const secret = "SCLQTNYINVRXY32WDORXTD2JMM6YPBIASP7DKHXVEZX47DWEYZPRY2HO";

    const kp = Keypair.fromSecret(secret);

    const response = await fetch(wasmFile);
    const bytes = await response.arrayBuffer();
    const wasmHashValue = hash(bytes);

    // console.log("wasm byte value is", bytes);
    // console.log("wasm hash value", wasmHash);

    const txBuilderUpload = await getTxBuilder(
      userKey,
      BASE_FEE,
      server,
      selectedNetwork.networkPassphrase
    );

    // const sender = (await server.getAccount(kp.publicKey()))._accountId;
    const senderAddr1 = new Address(userKey);

    // console.log("the sender address", senderAddr);

    const uploadTx = txBuilderUpload
      .setTimeout(TimeoutInfinite)
      .addOperation(
        Operation.uploadContractWasm({
          wasm: bytes,
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

    // new MuxedAccount(senderAddr, userKey).incrementSequenceNumber();

    const preparedTransactionCreate = await server.prepareTransaction(createTx);
    // this works for imported account
    // const signedTx = preparedTransaction.sign(kp);
    // const sendTxOracle = await server.sendTransaction(preparedTransaction);

    const xdrCreate = preparedTransactionCreate.toXDR();
    const signedTx2 = await signTransaction(xdrCreate, {
      network: "FUTURENET",
    });
    const txHash2 = await submitTx(signedTx2, networkPassphrase, server);
    // const resttt = xdr.TransactionMeta.fromXDR(txHash2.resultMetaXdr);

    const contractId = StrKey.encodeContract(txHash2.returnValue._value._value);
    const isContract = StrKey.isValidContract(contractId);

    const contractDetails = new Contract(contractId).getFootprint();

    console.log("final value", contractId, isContract);
    console.log("contract details", contractDetails);
  }

  async function handleSubmitToken(e) {
    e.preventDefault();
    setTokenLoading(() => true);
    const txBuilder1 = await getTxBuilder(
      userKey,
      BASE_FEE,
      server,
      selectedNetwork.networkPassphrase
    );

    const txBuilder2 = await getTxBuilder(
      userKey,
      BASE_FEE,
      server,
      selectedNetwork.networkPassphrase
    );

    const txBuilder3 = await getTxBuilder(
      userKey,
      BASE_FEE,
      server,
      selectedNetwork.networkPassphrase
    );

    const tokenDecimal = await getTokenInfo(
      selectedToken,
      "decimals",
      txBuilder1,
      server
    );

    const tokenName = await getTokenInfo(
      selectedToken,
      "name",
      txBuilder2,
      server
    );

    const tokenSymbol = await getTokenInfo(
      selectedToken,
      "symbol",
      txBuilder3,
      server
    );

    setTokenInfo((cur) => ({
      ...cur,
      decimal: tokenDecimal,
      name: tokenName,
      symbol: tokenSymbol,
    }));
    setTokenLoading(() => false);

    // console.log("token symbol", tokenName);
    // console.log("token name", tokenName);
  }

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
      <section className="py-10 bg-gray-100 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Deploy a soroban contract
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-500">
              Deploy no-code Soroban smart contracts for your dApp and manage
              them seamlessly.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mt-12 sm:mt-16 space-y-4">
            <div className="gap-4 ">
              <div className="grid grid-cols-1 gap-6 px-8 text-center md:px-0 md:grid-cols-2">
                <div className="p-6  flex items-center text-center justify-center overflow-hidden bg-white rounded-xl">
                  {/* <SecuritySafe
                    size="32"
                    color="#555555"
                    className="flex-shrink-0 w-10 h-10 mx-10 text-gray-400"
                  /> */}
                  <ElementPlus
                    size="32"
                    color="#555555"
                    className="flex-shrink-0 w-10 h-10 mx-10 text-gray-400"
                  />
                  <p className=" text-lg font-medium text-gray-900">
                    Deploy Contract from wasm
                  </p>
                </div>

                <div className="p-6 flex items-center text-center justify-center overflow-hidden bg-white rounded-xl">
                  <FolderAdd
                    size="32"
                    color="#555555"
                    className="flex-shrink-0 w-10 h-10 mx-10 text-gray-400"
                  />
                  <p className=" text-lg font-medium leading-relaxed text-gray-900">
                    Load and interact with contract
                  </p>
                </div>
              </div>
            </div>
            <div className="gap-4">
              <div className="grid grid-cols-1 gap-6 px-8 text-center md:px-0 md:grid-cols-3">
                <div className="overflow-hidden bg-gray-300 rounded-xl">
                  <div className="p-6">
                    <BuyCrypto
                      size="32"
                      color="#555555"
                      className="flex-shrink-0 w-10 h-10 mx-auto text-gray-400"
                    />
                    <p className="mt-6 text-lg font-medium text-gray-900">
                      Token Contract
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden bg-white rounded-xl">
                  <div className="p-6">
                    <SecuritySafe
                      size="32"
                      color="#555555"
                      className="flex-shrink-0 w-10 h-10 mx-auto text-gray-400"
                    />
                    <p className="mt-6 text-lg font-medium text-gray-900">
                      Staking Contract
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden bg-white rounded-xl">
                  <div className="p-6">
                    <People
                      size="32"
                      color="#555555"
                      className="flex-shrink-0 w-10 h-10 mx-auto text-gray-400"
                    />
                    <p className="mt-6 text-lg font-medium leading-relaxed text-gray-900">
                      DAO Contract
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden bg-white rounded-xl">
              <div className="px-6 py-12 sm:p-12">
                <h3 className="text-3xl font-semibold text-center text-gray-900">
                  Mint Token
                </h3>

                {tokenInfo?.decimal === 0 && (
                  <form
                    method="POST"
                    className="mt-14"
                    onSubmit={handleSubmitToken}
                  >
                    <div className="grid grid-cols-1  gap-x-5 gap-y-4">
                      <div>
                        <label className="text-base font-medium text-gray-900">
                          {" "}
                          Enter token address
                        </label>
                        <div className="mt-2.5 relative">
                          <input
                            onChange={(e) => setSelectedToken(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            placeholder="Paste token address here"
                            className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                          />
                        </div>
                      </div>

                      {userKey?.length > 0 && (
                        <div className="sm:col-span-2">
                          <button
                            onClick={handleSubmitToken}
                            className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            role="button"
                          >
                            {tokenLoading
                              ? "Token Info Loading..."
                              : "Load Token Info"}
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                )}

                {tokenInfo.decimal > 0 && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 mt-14 bg-gray-200 p-4">
                      <div>
                        <label className="text-base font-medium text-gray-900">
                          {" "}
                          Token ID
                        </label>
                        <div className="mt-2.5 relative">
                          {selectedToken.slice(0, 12)}...
                          {selectedToken.slice(-12)}
                        </div>
                      </div>

                      <div className="flex justify-between ">
                        <div>
                          <label className="text-base font-medium text-gray-900">
                            {" "}
                            Name
                          </label>
                          <div className="mt-2.5 relative">
                            {tokenInfo.name}
                          </div>
                        </div>
                        <div>
                          <label className="text-base font-medium text-gray-900">
                            {" "}
                            Symbol
                          </label>
                          <div className="mt-2.5 relative">
                            {tokenInfo.symbol}
                          </div>
                        </div>
                      </div>
                    </div>
                    <form className="mt-14" onSubmit={mintSubmitHandler}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                        <div>
                          <label className="text-base font-medium text-gray-900">
                            {" "}
                            Quantity
                          </label>
                          <div className="mt-2.5 relative">
                            <input
                              onChange={(e) => setMintAmount(e.target.value)}
                              type="tel"
                              name=""
                              id=""
                              placeholder="Enter quantity to mint"
                              className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-base font-medium text-gray-900">
                            {" "}
                            Mint to
                          </label>
                          <div className="mt-2.5 relative mb-3">
                            <input
                              onChange={(e) => setReceiver(e.target.value)}
                              type="text"
                              name=""
                              id=""
                              placeholder="Receiver's address"
                              className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                            />
                          </div>
                        </div>

                        {userKey?.length > 0 && (
                          <div className="sm:col-span-2">
                            <button
                              type="submit"
                              className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                              role="button"
                            >
                              {mintStatus === "PRE" && "Mint"}
                              {mintStatus === "SIGN" && "Waiting Approval..."}
                              {mintStatus === "MINTING" && "Minting..."}
                            </button>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                )}
                {!isWalletInstalled ? (
                  <div className="sm:col-span-2 mt-4">
                    <a
                      href="https://www.freighter.app/"
                      className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      role="button"
                      target="_blank"
                    >
                      Install Freighter
                    </a>
                  </div>
                ) : (
                  userKey?.length <= 0 && (
                    <div className="sm:col-span-2">
                      <button
                        onClick={handleConnect}
                        className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        role="button"
                      >
                        Connect Wallet
                      </button>
                    </div>
                  )
                )}
              </div>
              <div className="sm:col-span-2">
                <button
                  onClick={handleCreateContract}
                  className="relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  role="button"
                >
                  create contract
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
