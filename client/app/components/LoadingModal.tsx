"use client";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { ClipLoader } from "react-spinners";

interface LoadingModalProps {
  loading?: boolean;
}

export default function LoadingModal({loading}: LoadingModalProps) {
  const { isLoading } = useContext(GlobalContext);
  const myLoad = loading ? loading : isLoading;
  return (
    <div
      className={`${
        myLoad ? "flex" : "hidden"
      } bg-white/80 fixed w-full h-screen text-center justify-center items-center text-white top-0 left-0 z-[42]`}
    >
      <ClipLoader color="#0284c7" speedMultiplier={2} />
    </div>
  );
}
