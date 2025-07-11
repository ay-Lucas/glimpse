"use client";
import Link from "next/link";
import { WatchlistDropdown } from "./watchlist-dropdown";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { watchlistSchema } from "@/types/schema";
import { Edit2Icon, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useWatchlist } from "@/context/watchlist";
import { Session } from "@supabase/supabase-js";
import { pickTvRating } from "@/app/(media)/tv/[id]/utils";
import { pickMovieRating } from "@/app/(media)/movie/[id]/utils";
import {
  MovieReleaseDatesResponse,
  ReleaseDate,
  ShowContentRatingResponse,
} from "@/types/request-types-camelcase";
import { Genre } from "@/types/types";
import { setWatchlistName } from "@/lib/actions";
import {
  WatchlistWithMedia,
  MovieWatchlistModel,
  TvShowWatchlistModel,
  WatchlistModel,
} from "@/lib/repositories/watchlist";

export function EditableWatchlistTitle({
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
    const validatedFields = watchlistSchema.safeParse({
      name: string,
    });
    return validatedFields.success;
  };

  return (
    <div className="items-center text-2xl">
      {isEditing ? (
        <Input
          type="text"
          size={10}
          className="text-center text-2xl"
          value={title}
          onChange={handleTitleChange}
          onBlur={saveTitle}
          onKeyDown={(e) => e.key === "Enter" && saveTitle()}
          autoFocus
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center"
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
      <button>
        <X
          className="text-gray-400 transition-colors hover:text-gray-100"
          onClick={handleDeleteClick}
          size={30}
        />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="mx-auto mb-40 max-w-md space-y-4 rounded-lg bg-background p-6 text-center shadow-lg">
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

export function Watchlist({ watchlist }: { watchlist: WatchlistWithMedia }) {
  const { onDeleteWatchlist } = useWatchlist();
  const { tvShows, movies } = watchlist.items;
  function getMediaType(tvId: number | null) {
    return typeof tvId === "number" ? "tv" : "movie";
  }
  const media = [...tvShows, ...movies];
  if (!watchlist) return <div>You have 0 watchlists</div>;
  return (
    <div className="rounded-2xl border border-secondary bg-background p-3 backdrop-blur-3xl">
      <div className="flex flex-row space-x-5">
        <div className="items-start">
          <WatchlistDeleteConfirmation
            onConfirm={() => onDeleteWatchlist(watchlist.id)}
          />
        </div>
        <div className="items-start">
          <h2 className="text-2xl font-bold">{watchlist.name}</h2>
          <p className="">{watchlist.description}</p>
        </div>
      </div>
      {media.length > 0 ? (
        <>
          <div className="grid grid-cols-[1fr_minmax(75px,1fr)_1fr_1fr_1fr_1fr_1fr_30px] items-center gap-6 px-3 pb-1">
            <span className="text-gray-500">Title</span>
            <span className="text-gray-500">Poster</span>
            <span className="text-gray-500">Genres</span>
            <span className="text-gray-500">Vote Avg</span>
            <span className="text-gray-500">Popularity</span>
            <span className="text-gray-500">Rating</span>
          </div>

          <div className="grid space-y-2">
            {media.map((media, index) => (
              <WatchlistCard
                mediaType={getMediaType(media.tvId)}
                media={media}
                key={media.id + index}
                watchlist={watchlist}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-sm">(Empty)</div>
      )}
    </div>
  );
}

function WatchlistCard({
  media,
  mediaType,
  watchlist,
}: {
  media: MovieWatchlistModel | TvShowWatchlistModel;
  mediaType: "movie" | "tv";
  watchlist: WatchlistModel;
}) {
  const ratingsRes =
    mediaType === "tv"
      ? (media as TvShowWatchlistModel).contentRatings
      : (media as MovieWatchlistModel).releaseDates;
  const rating =
    mediaType === "tv"
      ? pickTvRating((ratingsRes as ShowContentRatingResponse).results)
      : pickMovieRating((ratingsRes as MovieReleaseDatesResponse).results);
  const title =
    (media as MovieWatchlistModel).title ||
    (media as TvShowWatchlistModel).name;
  const genres = media.genres as Genre[];
  const tmdbId = media.tvId || media.movieId;
  return (
    <div className="grid grid-cols-[1fr_minmax(75px,1fr)_1fr_1fr_1fr_1fr_1fr_30px] items-center gap-6 rounded-xl border border-secondary p-3 transition hover:border-primary/20">
      <Link href={`/${mediaType}/${tmdbId}`} className="medias-center flex">
        <p className="text-xl font-bold">{title}</p>
      </Link>
      <Image
        width={75}
        height={75}
        src={`https://image.tmdb.org/t/p/original/${media.posterPath}`}
        alt={`${title} poster`}
        quality={75}
        className="rounded-lg object-cover"
      />
      <div className="flex flex-wrap gap-1">
        {genres?.map((genre, genreIndex) => (
          <span
            key={genreIndex}
            className="flex select-none items-center rounded-lg border border-secondary bg-primary-foreground px-2 py-1 shadow-lg transition"
          >
            {genre.name}
          </span>
        ))}
      </div>
      <div>{(media.voteAverage * 10).toFixed(0)}%</div>
      <div>{(media.popularity * 10).toFixed(0)}</div>
      <div>{rating}</div>
      <div>{new Date(media.addedAt).toLocaleDateString()}</div>
      <div>
        <WatchlistDropdown
          watchlistId={media.watchlistId}
          mediaType={mediaType}
          tmdbId={tmdbId!}
          isPublic={watchlist.isPublic}
          watchlistDescription={watchlist.description ?? ""}
          isDefaultWatchlist={watchlist.isDefault}
          watchlistName={watchlist.name}
        />
      </div>
    </div>
  );
}
