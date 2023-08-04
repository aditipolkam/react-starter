import React from "react";
import Button from "../components/Button";
import { useContext } from "react";
import WalletContext from "../context/WalletContextProvider";
import { disconnect } from "wagmi/actions";
import { shortAddress } from "../helpers/formatters";

const Header = () => {
  const { address, signer, connectWallet, disconnectWallet } = useContext(WalletContext);
  
  return (
    <div className="w-full flex justify-between">
      <div className="flex items-center gap-2 text-xl">
        <img src="/react.svg" alt="logo" className="w-12 h-12" />
        React Starter
      </div>
      <div className="flex items-center">
        <Button label={signer ? shortAddress(address) : "Connect Wallet"} handleClick={!signer ? connectWallet : disconnectWallet} />
      </div>
    </div>
  );
};

export default Header;
