import { useState, lazy, Suspense, useEffect } from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {
  isConnected,
  getPublicKey,
  signAuthEntry,
  signTransaction,
  signBlob,
  isAllowed,
  setAllowed,
  requestAccess,
  getUserInfo,
  getNetwork,
} from "@stellar/freighter-api";

import Home from "./pages/home/Home";
import Header from "./common/Header";
import ContractDapp from "./pages/contract-dapp/ContractDapp";
import Playground from "./pages/dapp-playground/Playground";
import DappComponents from "./pages/dapp-components/DappComponents";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

function App() {
  // const Home = lazy(() => import("./pages/home/Home"));
  // const ContractDapp = lazy(() => import("./pages/contract-dapp/ContractDapp"));
  // const ComponentDapp = lazy(() =>
  //   import("./pages/dapp-components/DappComponents")
  // );

  // const DappPlayground = lazy(() =>
  //   import("./pages/dapp-playground/Playground")
  // );

  const [userkey, setUserKey] = useState("");
  const [network, setNetwork] = useState("");
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);

  // console.log("is connected state", isWalletInstalled);

  // console.log("current user key", userkey);

  useEffect(() => {
    async function fetchConnectedUser() {
      const connected = await isConnected();
      const publicKey = await getPublicKey();
      const nt = await getNetwork();
      setUserKey(() => publicKey);
      setNetwork(() => nt);
      setIsWalletInstalled(() => connected);
    }
    fetchConnectedUser();
  }, [userkey, network, isConnected]);
  return (
    <div className="bg-gray-100">
      <Router>
        <Header
          setNetwork={setNetwork}
          setUserKey={setUserKey}
          userKey={userkey}
          isWalletInstalled={isWalletInstalled}
        />
        <Routes>
          <Route path="/" element={<Home />} index />
          <Route
            path="/contracts"
            element={
              <ContractDapp
                userKey={userkey}
                setNetwork={setNetwork}
                setUserKey={setUserKey}
                isWalletInstalled={isWalletInstalled}
              />
            }
          />
          <Route path="/playground" element={<Playground />} />
          <Route path="/components" element={<DappComponents />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
