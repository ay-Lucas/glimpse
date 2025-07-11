"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { setWatchlist } from "../actions";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/context/watchlist";
import { watchlistSchema } from "@/types/schema";
import { useFormStatus } from "react-dom";

export default function WatchlistForm({
  watchlistId,
  initialDescription = "",
  initialIsPublic = false,
  initialName = "",
  onSaved,
  onCancel,
}: {
  initialName?: string;
  initialDescription?: string;
  initialIsPublic?: boolean;
  watchlistId?: string;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialName || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [isPublic, setIsPublic] = useState(initialIsPublic || false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pending } = useFormStatus();

  const { fetchWatchlists } = useWatchlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // client‐side Zod validation
    const parsed = watchlistSchema.safeParse({
      watchlistId,
      name,
      description,
      isPublic,
    });

    if (!parsed.success) {
      // flatten to single‐string per field
      const fieldErrors: Record<string, string> = {};
      for (const [field, msgs] of Object.entries(
        parsed.error.flatten().fieldErrors
      )) {
        fieldErrors[field] = msgs?.[0]!;
      }
      setErrors(fieldErrors);
      return;
    }

    // no client errors → call your action
    const res = await setWatchlist(
      new FormData(e.currentTarget as HTMLFormElement)
    );

    // check for server side errors
    if (res.errors) {
      const fieldErrors: Record<string, string> = {};
      fieldErrors["name"] = res.errors.name?.[0]!;
      setErrors(fieldErrors);
      return;
    }
    if (onSaved) onSaved();
    await fetchWatchlists();
  };

  return (
    <form
      className="grid gap-5"
      onSubmit={handleSubmit}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Input type="hidden" name="watchlistId" value={watchlistId} />
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Name your list..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="watchlist-description" className="">
          Description
        </Label>
        <Textarea
          id="watchlist-description"
          name="description"
          rows={4}
          placeholder="Describe your list..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          id="watchlist-is-public"
          name="isPublic"
          type="checkbox"
          defaultChecked={initialIsPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="watchlist-is-public">
          Make this watchlist <strong>public</strong>
        </Label>
      </div>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
