import Link from "next/link";
import React from "react";
import TmdbLogo from "@/assets/tmdb-logo.svg";

export function Footer() {
  return (
    <footer className="border-t ring-gray-700 z-10 backdrop-blur-sm text-gray-300 py-5">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm">
          Built by{" "}
          <a
            href="https://lucasanderson.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline"
          >
            Lucas Anderson
          </a>
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
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
      {/* TMDB Attribution Section */}
      <div className="mt-6 border-t ring-gray-700 pt-4 max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center space-x-2 text-xs">
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
