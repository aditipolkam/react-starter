import { createContext, useEffect, useState } from "react";
import { Signer, ethers } from "ethers";

interface CustomWindow extends Window {
  ethereum?: any; 
}

export const WalletContext = createContext({
  address: "",
  signer: null as Signer | null,
  connectWallet: () => {},
  disconnectWallet: () => {},
});

export const WalletContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [address, setAddress] = useState<string>("");
  const [signer, setSigner] = useState<Signer|null>(null);
 
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  function handleChange() {
    window.location.reload();
  }

  const connectWallet = async () => {
    console.log("in connect wallet");
 
    try {
      const { ethereum } = window as CustomWindow;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      const provider = new ethers.BrowserProvider(ethereum);
      const currentSigner = await provider.getSigner();
      setSigner(currentSigner);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { ethereum } = window as CustomWindow;
      if (!ethereum) {
        console.log("No ethereum object found.");
        return;
      }
      //await ethereum.request({ method: "eth_logout" });
      setAddress("");
      setSigner(null);
    } catch (err) {
      console.error(err);
    }
  };


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as CustomWindow;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        alert("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setAddress(account);
        ethereum.on("accountsChanged", handleChange);
        ethereum.on("chainChanged", handleChange);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const context = {
    address,
    signer,
    connectWallet,
    disconnectWallet,

  };

  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
  );
};

export default WalletContext;
