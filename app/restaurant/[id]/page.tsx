"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
      <main className="min-h-screen bg-[#FFFFFF] text-[#1C1917]">
        <div className="mx-auto w-full max-w-[560px] px-6 py-12">
          <p>Restaurant not found.</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#FFFFFF] text-[#1C1917]">
        <div className="mx-auto w-full max-w-[560px] px-6 py-12">
          <p className="text-[#57534E]">Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#1C1917]">
      <header className="bg-[#E23744] text-white">
        <div className="mx-auto w-full max-w-[560px] px-6 py-4">
          <p className="text-xl font-bold lowercase tracking-tight">zomato lite</p>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[560px] px-6 py-12">
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <p className="mt-1 text-sm text-[#78716C]">
          {data.cuisine} · {data.area}
        </p>

        {data.totalReviews === 0 || data.averageRating === null ? (
          <div className="mt-10 rounded-lg border border-[#E7E5E4] bg-white p-6">
            <p className="text-lg">No reviews yet.</p>
            <p className="mt-1 text-sm text-[#78716C]">Be the first to review this place.</p>
            <Link
              href={`/review/${id}`}
              className="mt-4 inline-block rounded-lg bg-[#E23744] px-5 py-2.5 text-sm font-medium text-white"
            >
              Write the first review
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 flex items-baseline gap-3">
              <p className="text-6xl font-semibold">{data.averageRating}</p>
              <p className="text-sm text-[#78716C]">
                {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
              </p>
            </div>

            {data.latestReview && (
              <section className="mt-8 rounded-lg border-2 border-[#E23744] bg-white p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#E23744]">Latest review</p>
                <p className="mt-2 text-sm">
                  {data.latestReview.rating} / 5 · {formatDate(data.latestReview.createdAt)}
                </p>
                <p className="mt-1 text-base">{data.latestReview.comment}</p>
              </section>
            )}

            <section className="mt-8">
              <h2 className="text-sm font-medium text-[#57534E]">Older reviews</h2>
              <ul className="mt-3 divide-y divide-[#E7E5E4] rounded-lg border border-[#E7E5E4] bg-white">
                {data.reviews.map((r) => (
                  <li key={r.id} className="p-4">
                    <p className="text-sm text-[#57534E]">
                      {r.rating} / 5 · {formatDate(r.createdAt)}
                    </p>
                    <p className="mt-1">{r.comment}</p>
                  </li>
                ))}
              </ul>
            </section>

            <Link
              href={`/review/${id}`}
              className="mt-8 inline-block rounded-lg border border-[#E23744] px-5 py-2.5 text-sm font-medium text-[#E23744]"
            >
              Write a review
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
