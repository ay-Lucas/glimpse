import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import "@/styles/globals.css";

export function Search() {
  return (
    <div className="group flex">
      <Input className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity ease-in-out delay-150 duration-300 bg-primary" />
      <button className="pl-5 pr-2">
        <IoSearchOutline size={25} />
      </button>
    </div>
  );
}
