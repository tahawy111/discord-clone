import { X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface ImageModalProps {
  src: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ImageModal({ src, setIsOpen }: ImageModalProps) {
  return (
    <div className="fixed top-0 left-0 bg-black/50 w-full h-screen overflow-auto z-[41] flex items-center justify-center">
      <div className="w-96 h-96 relative">
          <span
            className="cursor-pointer text-3xl font-black fixed right-5 top-5"
            onClick={() => setIsOpen(false)}
          >
            <X className="hover:bg-slate-100 p-1 w-10 h-10 rounded-lg transition hover:text-black" />
          </span>
        <Image
          className={`object-contain`}
          // width={288}
          // height={288}
          fill
          alt="Image Modal"
          src={src}
        />
      </div>
    </div>
  );
}
