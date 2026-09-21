import { getSql } from "@/lib/db";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request must be valid JSON." }, { status: 400 });
  }

  const { restaurantId, rating, comment } = body as {
    restaurantId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  // Check 1: rating is a whole number between 1 and 5.
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Rating must be a whole number between 1 and 5." }, { status: 400 });
  }

  // Check 2: comment is a non-empty string after trimming.
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return Response.json({ error: "Comment must not be empty." }, { status: 400 });
  }

  // Check 3: restaurantId refers to a restaurant that actually exists.
  if (typeof restaurantId !== "number" || !Number.isInteger(restaurantId)) {
    return Response.json({ error: "Restaurant does not exist." }, { status: 400 });
  }

  const sql = getSql();

  const existing = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`;
  if (existing.length === 0) {
    return Response.json({ error: "Restaurant does not exist." }, { status: 400 });
  }

  const inserted = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${comment.trim()})
    RETURNING id
  `;

  const reviewId = (inserted[0] as { id: number }).id;
  return Response.json({ success: true, reviewId }, { status: 201 });
}
