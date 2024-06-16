import { useState, lazy, Suspense, useEffect } from "react";

import { isConnected, getPublicKey, getNetwork } from "@stellar/freighter-api";

import Home from "./pages/home/Home";
import Header from "./common/Header";
import ContractDapp from "./pages/contract-dapp/ContractDapp";
import Playground from "./pages/dapp-playground/Playground";
import DappComponents from "./pages/dapp-components/DappComponents";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import NotFound from "./not-found/NotFound";

function App() {
  const [userkey, setUserKey] = useState("");
  const [network, setNetwork] = useState("");

  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [connecting, setConnecting] = useState(false);
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
  }, [userkey, network, isConnected, connecting]);
  return (
    <div className="bg-gray-100">
      <Router>
        <Header
          setNetwork={setNetwork}
          setUserKey={setUserKey}
          userKey={userkey}
          isWalletInstalled={isWalletInstalled}
          setConnecting={setConnecting}
          connecting={connecting}
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
                setConnecting={setConnecting}
                connecting={connecting}
              />
            }
          />
          <Route path="/playground" element={<Playground />} />

          <Route path="/sorobuild-ui" element={<DappComponents />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
