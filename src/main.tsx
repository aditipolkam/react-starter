import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import MainLayout from "./components/layout/MainLayout.tsx";
import { WalletContextProvider } from "./context/WalletContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletContextProvider>
      <MainLayout>
        <App />
      </MainLayout>
    </WalletContextProvider>
  </React.StrictMode>
);
