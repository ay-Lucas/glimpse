export default function PersonBio({ bio }: { bio: string }) {
  return (
    <div className="relative">
      <input id="bio-toggle" type="checkbox" className="peer sr-only" />
      <p className="overflow-hidden max-h-[4.5rem] peer-checked:max-h-[1000px] transition-all duration-300 ease-in-out">
        {bio}
      </p>
      <label
        htmlFor="bio-toggle"
        className="mt-2 text-blue-600 cursor-pointer select-none hover:underline block peer-checked:hidden peer-checked:aria-expanded:false"
        aria-expanded="true"
      >
        Read more
      </label>
      <label
        htmlFor="bio-toggle"
        className="mt-2 text-blue-600 cursor-pointer select-none hover:underline hidden peer-checked:block peer-checked:aria-expanded=true"
        aria-expanded="false"
      >
        Show less
      </label>
    </div>
  );
}
