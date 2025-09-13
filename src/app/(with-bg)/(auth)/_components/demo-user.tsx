"use client";

import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function DemoUser() {
  const demoUser = {
    email: "demo@lucasanderson.dev",
    password: "12345678",
  };

  const copyToClipboard = (text: string) => {
    let isCopy = copy(text);

    if (isCopy) {
      toast.success("Copied to Clipboard");
    }
  };

  return (
    <div className="rounded-lg bg-gray-800/75 px-8 py-8 shadow-2xl backdrop-blur sm:px-12">
      <div className="mb-2 flex flex-col space-y-3 font-bold">Demo Account</div>
      <div className="grid grid-cols-[auto_auto] items-center gap-y-4 text-start">
        <Label>Email</Label>
        <button
          onClick={() => copyToClipboard(demoUser.email)}
          className="w-fit text-start"
        >
          <Label className="cursor-pointer rounded-md border border-input bg-gray-950 p-2 text-start text-muted-foreground">
            {demoUser.email}
          </Label>
        </button>
        <Label>Password</Label>
        <button
          onClick={() => copyToClipboard(demoUser.password)}
          className="w-fit text-start"
        >
          <Label className="cursor-pointer rounded-md border border-input bg-gray-950 p-2 text-start text-muted-foreground">
            {demoUser.password}
          </Label>
        </button>
      </div>
    </div>
  );
}
