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
    <div className="flex space-x-3 items-center w-full">
      <IoSearchOutline size={24} />
      <input
        className={`h-8 placeholder-gray-600 focus-visible:outline-none w-full rounded-xl p-3 md:bg-primary/80 text-black bg-secondary border-gray-500 border transition-opacity ease-in-out duration-300 "`}
        onKeyDown={handleEnter}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a series or movie"
      />
    </div>
  );
}
