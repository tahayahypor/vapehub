import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import "./styles/globals.css";
import "@fontsource/vazirmatn";

import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#181818",
              color: "#ffffff",
              border: "1px solid #2D2D2D",
              borderRadius: "16px",
              fontFamily: "Vazirmatn",
            },
            success: {
              iconTheme: {
                primary: "#00FF95",
                secondary: "#000000",
              },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);