"use client";
import { useEffect } from "react";

import EmptyState from "../components/EmptyState";

export default function Users() {
  useEffect(() => {
    const reloadCount = parseInt(sessionStorage.getItem("reloadCount")!) || 1;
    if (reloadCount < 2) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
  }, []);
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
}
