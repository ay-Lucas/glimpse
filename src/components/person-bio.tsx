export default function PersonBio({ bio }: { bio: string }) {
  return (
    <div className="relative">
      <input id="bio-toggle" type="checkbox" className="peer sr-only" />
      <p className="max-h-[4.5rem] overflow-hidden transition-all duration-300 ease-in-out peer-checked:max-h-[1000px]">
        {bio}
      </p>
      <label
        htmlFor="bio-toggle"
        className="peer-checked:aria-expanded:false mt-2 block cursor-pointer select-none text-blue-600 hover:underline peer-checked:hidden"
        aria-expanded="true"
      >
        Read more
      </label>
      <label
        htmlFor="bio-toggle"
        className="peer-checked:aria-expanded=true mt-2 hidden cursor-pointer select-none text-blue-600 hover:underline peer-checked:block"
        aria-expanded="false"
      >
        Show less
      </label>
    </div>
  );
}
