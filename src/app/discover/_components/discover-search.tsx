"use client";
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import "@/styles/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DiscoverSearch() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" && value !== "") {
      router.push(`/search?query=${value}`);
    }
  };

  return (
    <div className="flex w-full items-center space-x-3">
      <IoSearchOutline size={24} />
      <input
        className={`" h-8 w-full rounded-xl border border-gray-500 bg-secondary p-3 text-black placeholder-gray-600 transition-opacity duration-300 ease-in-out focus-visible:outline-none md:bg-primary/80`}
        onKeyDown={handleEnter}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a series or movie"
      />
    </div>
  );
}
