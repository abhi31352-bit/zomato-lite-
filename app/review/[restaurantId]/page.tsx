"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ReviewPage() {
  const params = useParams<{ restaurantId: string }>();
  const restaurantId = params.restaurantId;
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setRestaurantName(data.name);
      })
      .catch(() => {});
  }, [restaurantId]);

  const canSubmit = rating >= 1 && comment.trim().length > 0 && !submitting;

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId: Number(restaurantId), rating, comment: comment.trim() }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      // Display what the backend said — never invent our own message.
      setError(data?.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }
    router.push(`/restaurant/${restaurantId}`);
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#1C1917]">
      <header className="bg-[#E23744] text-white">
        <div className="mx-auto w-full max-w-[560px] px-6 py-4">
          <p className="text-xl font-bold lowercase tracking-tight">zomato lite</p>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[560px] px-6 py-12">
        <Link href={`/restaurant/${restaurantId}`} className="text-sm text-[#57534E] underline underline-offset-4">
          Back to restaurant
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">
          {restaurantName ? `Review ${restaurantName}` : "Write a review"}
        </h1>

        <div className="mt-8">
          <p className="text-sm font-medium">Your rating</p>
          <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className={`h-11 w-11 rounded-lg border text-xl transition-colors ${
                  n <= rating
                    ? "border-[#E23744] bg-[#E23744] text-white"
                    : "border-[#E7E5E4] bg-white text-[#A8A29E] hover:border-[#E23744] hover:text-[#E23744]"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="comment" className="text-sm font-medium">
            Your review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="What did you eat? How was it?"
            className="mt-3 w-full rounded-lg border border-[#E7E5E4] bg-white p-4 text-base placeholder:text-[#A8A29E] focus:border-[#E23744] focus:outline-none"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-[#E23744] bg-white p-3 text-sm">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="mt-6 w-full rounded-lg bg-[#E23744] py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </main>
  );
}
