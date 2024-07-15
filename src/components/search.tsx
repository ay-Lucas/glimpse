"use client";
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import "@/styles/globals.css";
import { options } from "@/lib/constants";
import { useState } from "react";
import { SearchMultiRequest, SearchMultiResponse } from "@/types/request-types";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function Search({
  getMultiSearch,
}: {
  getMultiSearch(value: SearchMultiRequest): Promise<SearchMultiResponse>;
}) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      console.log(value);
      const res = await getMultiSearch({
        query: value,
        region: "en-US",
        include_adult: false,
        page: 1,
        language: "en-US",
        id: "",
      });
      if (
        res.results === undefined ||
        (res.total_results !== undefined && res.total_results < 1)
      )
        return;
      const item = res.results[0];
      router.push(`/${item?.media_type}/${item?.id}`);
      console.log(res);
    }
  };

  return (
    <div className="group flex">
      <button className="pr-3">
        <IoSearchOutline size={25} />
      </button>
      <Input
        className={`w-72 h-8 md:bg-secondary/80 bg-secondary border-gray-500 border transition-opacity ease-in-out duration-300 "`}
        onKeyDown={handleEnter}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a series or movie"
      />
    </div>
  );
}
