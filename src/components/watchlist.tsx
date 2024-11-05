"use client";
import { WatchlistI } from "@/types";
import Link from "next/link";
import { WatchlistDropdown } from "./watchlist-dropdown";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { deleteWatchlist, setWatchlistName } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { watchlistNameSchema } from "@/types/schema";
import { Edit2, Edit2Icon, EditIcon, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function EditableWatchlistTitle({
  initialTitle,
  session,
  watchlistId,
}: {
  initialTitle: string;
  session: Session;
  watchlistId: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [originalTitle, setOriginalTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setOriginalTitle(title);
  }, [isEditing]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = async () => {
    setIsEditing(false);
    if (!isInputValid(title)) {
      setTitle(originalTitle);
      return;
    }
    await setWatchlistName(session.user.id, watchlistId, title);
  };
  const isInputValid = (string: string) => {
    const validatedFields = watchlistNameSchema.safeParse({
      name: string,
    });
    return validatedFields.success;
  };

  return (
    <div className="text-2xl items-center">
      {isEditing ? (
        <Input
          type="text"
          size={10}
          className="text-2xl text-center"
          value={title}
          onChange={handleTitleChange}
          onBlur={saveTitle}
          onKeyDown={(e) => e.key === "Enter" && saveTitle()}
          autoFocus
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center p-1.5"
        >
          <h2 className="mr-2">{title}</h2>
          <Edit2Icon size={17} />
        </div>
      )}
    </div>
  );
}

interface WatchlistDeleteConfirmationProps {
  onConfirm: () => Promise<void> | void; // Accepts either a function that returns a Promise or a void
}

function WatchlistDeleteConfirmation({
  onConfirm,
}: WatchlistDeleteConfirmationProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleDeleteClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const confirmDelete = async () => {
    await onConfirm();
    setShowModal(false);
  };

  return (
    <>
      <button className="absolute">
        <X
          className="text-gray-400 hover:text-gray-100 transition-colors"
          onClick={handleDeleteClick}
          size={30}
        />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md mx-auto shadow-lg text-center space-y-4 mb-40">
            <h3 className="text-lg font-semibold">Delete Confirmation</h3>
            <p>Are you sure you want to delete this watchlist?</p>
            <div className="flex justify-center space-x-4">
              <Button variant="destructive" onClick={confirmDelete}>
                Yes, Delete
              </Button>
              <Button onClick={handleClose} variant="default">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Watchlist({ watchlist }: { watchlist: WatchlistI }) {
  const { data: session } = useSession();
  function onDeleteWatchlistConfirm() {
    const res = deleteWatchlist(session!.user.id, watchlist.id);
    console.log(res);
  }
  return (
    <div className="p-3 bg-background border-secondary border rounded-2xl backdrop-blur-3xl">
      {watchlist ? (
        <>
          {watchlist.items.length > 0 ? (
            <div>
              <WatchlistDeleteConfirmation
                onConfirm={onDeleteWatchlistConfirm}
              />
              <div className="flex justify-center p-3">
                <EditableWatchlistTitle
                  initialTitle={watchlist.watchlistName}
                  session={session!}
                  watchlistId={watchlist.id}
                />
              </div>
              <div className="grid space-y-2">
                <div className="grid grid-cols-[1fr_75px_1fr_1fr_1fr_auto] gap-6 px-3 py-2 items-center">
                  <span className="text-gray-500">Title</span>
                  <span className="text-gray-500">Poster</span>
                  <span className="text-gray-500">Genres</span>
                  <span className="text-gray-500">Vote Avg</span>
                  <span className="text-gray-500">Popularity</span>
                </div>
                {watchlist.items.map((item, index) => (
                  <div
                    key={item.itemId}
                    className="grid grid-cols-[1fr_75px_1fr_1fr_1fr_auto] gap-6 border-secondary border p-3 rounded-xl items-center hover:border-primary/20 transition"
                  >
                    <Link
                      href={`/${item.itemType}/${item.tmdbId}`}
                      className="flex items-center"
                    >
                      <div>{item.title}</div>
                    </Link>
                    <Image
                      width={75}
                      height={75}
                      src={`https://image.tmdb.org/t/p/original/${item.posterPath}`}
                      alt={`${item.title} poster`}
                      quality={75}
                      className="object-cover w-[75px] h-[75px] rounded-[40%]"
                    />
                    <div className="flex flex-wrap gap-1">
                      {item.genres?.map((genre, genreIndex) => (
                        <span
                          key={genreIndex}
                          className="shadow-lg rounded-lg px-2 py-1 select-none transition border bg-primary-foreground border-secondary"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="ml-7">
                      {(item.tmdbVoteAverage * 10).toFixed(0)}%
                    </div>
                    <div className="ml-7">
                      {(item.popularity * 10).toFixed(0)}
                    </div>
                    <div className="justify-self-end">
                      <WatchlistDropdown
                        watchlistId={item.watchlistId}
                        watchlistItemId={item.itemId}
                        session={session!}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-center">(Empty)</div>
          )}
        </>
      ) : (
        <div>You have no playlists</div>
      )}
    </div>
  );
}
