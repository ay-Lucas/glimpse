import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="border-t ring-gray-100 z-10 backdrop-blur-sm text-gray-200 py-5">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm">
          Built by{" "}
          <a
            href="https://lucasanderson.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Lucas Anderson
          </a>
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/" className="hover:text-white text-sm">
            Home
          </Link>
          <Link href="/discover" className="hover:text-white text-sm">
            Discover
          </Link>
          <Link
            href="https://github.com/your-username/glimpse"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-sm"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
