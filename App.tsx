import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/profile-context";
import { Routes } from "./src/routes";
import { CartProvider } from "./src/context/cart-context";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="auto" />
        <Routes />
      </CartProvider>
    </AuthProvider>
  );
}
