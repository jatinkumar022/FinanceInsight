import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "@/components/ui/toaster";

import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />

      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
