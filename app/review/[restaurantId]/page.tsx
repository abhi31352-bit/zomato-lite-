"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

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
    <main className="bg-white text-[#1C1C1C]">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-[560px]">
          <Link
            href={`/restaurant/${restaurantId}`}
            className="inline-block rounded text-sm font-medium text-[#E23744] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E23744]"
          >
            ← Back to restaurant
          </Link>
          <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">
            {restaurantName ? `Review ${restaurantName}` : "Write a review"}
          </h1>

          <div className="mt-8">
            <p className="text-sm font-medium">Your rating</p>
            <div className="mt-3 flex gap-1 sm:gap-2" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                  className={`rounded-lg p-1 text-4xl transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E23744] sm:text-5xl ${
                    n <= rating ? "text-[#FFB800]" : "text-[#D6D6D6] hover:text-[#FFB800]"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="mt-2 h-5 text-sm font-medium text-[#696969]" aria-live="polite">
              {rating >= 1 ? RATING_LABELS[rating] : ""}
            </p>
          </div>

          <div className="mt-6">
            <label htmlFor="comment" className="text-sm font-medium">
              Your review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="What did you order? How was the taste, portion and delivery?"
              className="mt-2 w-full rounded-xl border border-[#E8E8E8] bg-white p-4 text-base placeholder:text-[#9A9A9A] focus:border-[#E23744] focus:outline-none focus:ring-2 focus:ring-[#E23744]/30"
            />
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-[#E23744] bg-[#FFF7F7] p-3 text-sm">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="mt-6 w-full rounded-lg bg-[#E23744] py-3.5 text-base font-medium text-white transition-colors hover:bg-[#C81F2D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E23744] disabled:cursor-not-allowed disabled:bg-[#F4A9AE] disabled:hover:bg-[#F4A9AE]"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
        </div>
      </div>
    </main>
  );
}
