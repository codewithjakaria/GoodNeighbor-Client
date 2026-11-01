"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "12px",
          border: "1px solid var(--toast-border)",
          background: "var(--toast-bg)",
          color: "var(--toast-fg)",
          fontSize: "13px",
          fontWeight: 500,
        },
        success: {
          iconTheme: { primary: "#059669", secondary: "var(--toast-bg)" },
        },
        error: {
          iconTheme: { primary: "#dc2626", secondary: "var(--toast-bg)" },
        },
      }}
    />
  );
}
