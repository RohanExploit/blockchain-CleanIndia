import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${title} | CleanIndia Web3`;
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
}
