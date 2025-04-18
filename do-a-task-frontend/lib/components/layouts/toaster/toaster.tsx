"use client";                          //  ← mark it as a client component
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // ← ensure the styles are loaded

export function Toaster() {
  return <ToastContainer />;
}