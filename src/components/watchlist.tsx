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
  MovieResult,
  ReleaseDate,
  ShowContentRatingResponse,
  TvResult,
  TvResultsResponse,
} from "@/types/request-types-camelcase";
import { Genre } from "@/types/types";
import { setWatchlistName } from "@/lib/actions";
import {
  WatchlistWithMedia,
  MovieWatchlistModel,
  TvShowWatchlistModel,
  WatchlistModel,
} from "@/lib/repositories/watchlist";
import { MediaHeader } from "@/app/(media)/_components/media-header";
import { SlideCard } from "./slide-card";
import { BASE_POSTER_IMAGE_URL } from "@/lib/constants";

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
      <div className="flex flex-row space-x-5 pb-2">
        <div className="items-start">
          <WatchlistDeleteConfirmation
            onConfirm={() => onDeleteWatchlist(watchlist.id)}
          />
        </div>
        <div className="items-start">
          <h2 className="text-2xl font-bold">{watchlist.name}</h2>
          <p>{watchlist.description}</p>
        </div>
      </div>
      {media.length > 0 ? (
        <>
          <div className="flex flex-row space-x-4">
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
  const releaseDateStr =
    (media as TvShowWatchlistModel).firstAirDate ||
    (media as MovieWatchlistModel).releaseDate;
  const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;
  const data =
    mediaType === "tv" ? (media as TvResult) : (media as MovieResult);
  return (
    <SlideCard
      rating={null}
      alt={`poster of ${title}`}
      aspectClass="aspect-[2/3]"
      title={title}
      overview={media.overview}
      tmdbVoteAverage={media.voteAverage}
      tmdbVoteCount={media.voteCount}
      releaseDate={releaseDate}
      mediaType={mediaType}
      tmdbId={tmdbId!}
      imagePath={media.posterPath}
      baseUrl={BASE_POSTER_IMAGE_URL}
      data={data}
    />
  );
}
