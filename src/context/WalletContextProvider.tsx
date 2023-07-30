import { createContext, useEffect, useState } from "react";

export const WalletContext = createContext({
  address: "",
  signer: null,
  connectWallet: () => {},
  //   disconnectWallet: () => {},
  network: "",
  switchNetwork: () => {},
});

export const WalletContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  function handleChange() {
    window.location.reload();
  }

  const connectWallet = async () => {
    console.log("in connect wallet");
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      await checkNetwork();
    } catch (err) {
      console.error(err);
    }
  };

  const checkNetwork = async () => {
    try {
      const { ethereum } = window;
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });
      setNetwork(chainId);
      console.log(chainId);
    } catch (err) {
      console.error(err);
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      } catch (error: any) {
        console.log(error.code);
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881",
                  chainName: "Polygon Mumbai Testnet",
                  rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                  nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            });
            window.ethereum.on("chainChanged", handleChange);
          } catch (error) {
            console.log(error);
          }
        }
        console.log(typeof error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
      );
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
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
        await checkNetwork();
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
    // disconnectWallet,
    network,
    switchNetwork,
  };

  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
  );
};

export default WalletContext;
