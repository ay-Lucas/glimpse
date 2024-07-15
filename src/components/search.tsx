"use client";
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import "@/styles/globals.css";
import { options } from "@/lib/constants";
import { useState } from "react";
import { SearchMultiRequest, SearchMultiResponse } from "@/types/request-types";
import { useRouter } from "next/navigation";

export function Search({
  getMultiSearch,
}: {
  getMultiSearch(value: SearchMultiRequest): Promise<SearchMultiResponse>;
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const handleClick = () => {
    setVisible(!visible);
  };
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
      // res.then(())
    }
  };
  // const handleValue = (value: string) => {
  //   console.log(value);
  // };
  return (
    <div className="group flex w-full">
      <button className="lg:pl-5 pr-6" onClick={handleClick}>
        <IoSearchOutline size={25} />
      </button>
      <Input
        className={`${visible ? "opacity-100" : "opacity-0"} h-8 w-80 md:bg-secondary/80 bg-secondary border-gray-500 border transition-opacity ease-in-out delay-150 duration-300"`}
        onKeyDown={handleEnter}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
