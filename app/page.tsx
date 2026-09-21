"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RatingBadge from "@/components/RatingBadge";

type CardData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
};

export default function Home() {
  const [data, setData] = useState<CardData | null>(null);

  useEffect(() => {
    fetch("/api/restaurants/1")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="bg-white text-[#1C1C1C]">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold">Popular restaurants</h1>

        {!data ? (
          <p className="mt-6 text-[#696969]">Loading…</p>
        ) : (
          <Link
            href="/restaurant/1"
            className="mt-6 block max-w-sm overflow-hidden rounded-xl border border-[#E8E8E8] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E23744]"
          >
            <div
              className="flex h-40 items-center justify-center bg-gradient-to-br from-[#FFE9EC] via-[#FFF6F3] to-[#FFF9E6] text-6xl"
              role="img"
              aria-label="Burrito illustration placeholder"
            >
              🌯
            </div>
            <div className="p-4">
              <p className="text-lg font-semibold">{data.name}</p>
              <p className="mt-0.5 text-sm text-[#696969]">
                {data.cuisine} · {data.area}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {data.averageRating !== null && (
                  <RatingBadge value={data.averageRating} />
                )}
                <span className="text-sm text-[#696969]">
                  {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}
