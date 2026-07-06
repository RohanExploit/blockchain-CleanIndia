import { useState } from "react";

export function useClipboard(timeout = 2000) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), timeout);
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setHasCopied(false);
      return false;
    }
  };

  return { hasCopied, copyToClipboard };
}
