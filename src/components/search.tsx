"use client";
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import "@/styles/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function Search() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" && value !== "") {
      router.push(`/search?query=${value}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <IoSearchOutline size={24} />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        onPointerDownOutside={(e) => e.preventDefault()}
        sideOffset={24}
      >
        <Input
          className={`h-8 w-56 md:w-52 lg:w-64 md:bg-secondary/80 bg-secondary border-gray-500 border transition-opacity ease-in-out duration-300 "`}
          onKeyDown={handleEnter}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for a series or movie"
        />
      </PopoverContent>
    </Popover>
  );
}
