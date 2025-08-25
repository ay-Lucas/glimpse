import Link from "next/link";
import React from "react";
import TmdbLogo from "@/assets/tmdb-logo.svg";

export function Footer() {
  return (
    <footer className="z-10 border-t py-5 text-gray-300 ring-gray-700 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between px-4 md:flex-row">
        <p className="text-sm">
          Built by{" "}
          <a
            href="https://lucasanderson.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Lucas Anderson
          </a>
        </p>
        <div className="mt-4 flex space-x-6 md:mt-0">
          <Link href="/" className="text-sm hover:text-white">
            Home
          </Link>
          <Link href="/discover" className="text-sm hover:text-white">
            Discover
          </Link>
          <Link
            href="https://github.com/ay-lucas/glimpse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-white"
          >
            GitHub
          </Link>
        </div>
      </div>
      {/* TMDB Attribution Section */}
      <div className="mx-auto mt-6 max-w-4xl border-t pt-4 text-center ring-gray-700">
        <div className="flex items-center justify-center space-x-2 text-xs">
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <TmdbLogo
              alt="TMDB Logo"
              width={50}
              height={20}
              className="opacity-75 hover:opacity-100"
            />
          </a>
          <p className="max-w-md">
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
