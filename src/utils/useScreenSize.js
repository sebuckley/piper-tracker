import { useState, useEffect } from "react";

export default function useScreenSize() {
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLarge(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isLarge };
}
