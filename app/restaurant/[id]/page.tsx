"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RatingBadge from "@/components/RatingBadge";

type Review = { id: number; rating: number; comment: string; createdAt: string };

type RestaurantData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ReviewRow({ review }: { review: Review }) {
  return (
    <li className="p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <RatingBadge value={review.rating} />
        <span className="text-sm text-[#696969]">{formatDate(review.createdAt)}</span>
      </div>
      <p className="mt-2">{review.comment}</p>
    </li>
  );
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => {});
  }, [id]);

  if (notFound) {
    return (
      <main className="bg-white text-[#1C1C1C]">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
          <p>Restaurant not found.</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="bg-white text-[#1C1C1C]">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
          <p className="text-[#696969]">Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-[#1C1C1C]">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
        <div
          className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FFE9EC] via-[#FFF6F3] to-[#FFF9E6] text-7xl sm:h-64"
          role="img"
          aria-label="Burrito illustration placeholder"
        >
          🌯
        </div>

        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">{data.name}</h1>
        <p className="mt-1 text-[#696969]">
          {data.cuisine} · {data.area}
        </p>

        {data.totalReviews === 0 || data.averageRating === null ? (
          <div className="mt-8 rounded-xl border border-[#E8E8E8] bg-white p-6">
            <p className="text-lg font-semibold">No reviews yet.</p>
            <p className="mt-1 text-sm text-[#696969]">Be the first to review this place.</p>
            <Link
              href={`/review/${id}`}
              className="mt-4 inline-block rounded-lg bg-[#E23744] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#C81F2D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E23744]"
            >
              Write the first review
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-2">
              <RatingBadge value={data.averageRating} />
              <p className="text-sm text-[#696969]">
                {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
              </p>
            </div>

            {data.latestReview && (
              <section className="mt-6 rounded-xl border border-[#E8E8E8] bg-[#FFF7F7] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E23744]">
                  Latest review
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <RatingBadge value={data.latestReview.rating} />
                  <span className="text-sm text-[#696969]">
                    {formatDate(data.latestReview.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-lg">{data.latestReview.comment}</p>
              </section>
            )}

            <section className="mt-8">
              <h2 className="text-lg font-semibold">Older reviews</h2>
              <ul className="mt-3 divide-y divide-[#E8E8E8] rounded-xl border border-[#E8E8E8]">
                {data.reviews.map((r) => (
                  <ReviewRow key={r.id} review={r} />
                ))}
              </ul>
            </section>

            <Link
              href={`/review/${id}`}
              className="mt-8 hidden rounded-lg bg-[#E23744] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#C81F2D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E23744] md:inline-block"
            >
              Write a review
            </Link>

            <div className="sticky bottom-0 -mx-4 mt-8 border-t border-[#E8E8E8] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
              <Link
                href={`/review/${id}`}
                className="block rounded-lg bg-[#E23744] px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#C81F2D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E23744]"
              >
                Write a review
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
