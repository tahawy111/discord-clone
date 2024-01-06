import { useEffect, useState } from "react";

export const useNavigator = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigator =
    typeof window !== "undefined" && window.navigator
      ? window.navigator
      : null;

  if (!mounted) return "";

  return navigator;
};
