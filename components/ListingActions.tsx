"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

export default function ListingActions({ listingId }: { listingId: string }) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const exists = Array.isArray(data.favorites) && data.favorites.some((item: any) => item._id === listingId);
        setFavorited(exists);
      })
      .catch(() => undefined);
  }, [listingId]);

  async function toggleFavorite() {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId })
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || "Could not update favorites");
      return;
    }
    setFavorited(Boolean(data.favorited));
    toast.success(data.favorited ? "Saved to favorites" : "Removed from favorites");
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={toggleFavorite} variant={favorited ? "secondary" : "ghost"}>
        {favorited ? "Saved" : "Save to favorites"}
      </Button>
      <Button href="#reviews" variant="ghost">
        View reviews
      </Button>
    </div>
  );
}
