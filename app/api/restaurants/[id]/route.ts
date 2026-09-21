import { getSql } from "@/lib/db";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/restaurants/[id]">
) {
  const { id } = await ctx.params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId)) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const sql = getSql();

  const rows = await sql`SELECT id, name, cuisine, area FROM restaurants WHERE id = ${restaurantId}`;
  if (rows.length === 0) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }
  const restaurant = rows[0] as { id: number; name: string; cuisine: string; area: string };

  const agg = (await sql`
    SELECT AVG(rating)::float AS avg, COUNT(*)::int AS count
    FROM reviews WHERE restaurant_id = ${restaurantId}
  `)[0] as { avg: number | null; count: number };

  const totalReviews = agg.count;
  // AVG first, then round to one decimal place here in the backend.
  const averageRating = agg.avg === null ? null : Math.round(agg.avg * 10) / 10;

  const latestRows = await sql`
    SELECT id, rating, comment, created_at
    FROM reviews WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC, id DESC LIMIT 1
  `;
  const latest = (latestRows[0] ?? null) as
    | { id: number; rating: number; comment: string; created_at: string }
    | null;

  let restRows: Array<{ id: number; rating: number; comment: string; created_at: string }> = [];
  if (latest) {
    restRows = (await sql`
      SELECT id, rating, comment, created_at
      FROM reviews WHERE restaurant_id = ${restaurantId} AND id != ${latest.id}
      ORDER BY created_at DESC, id DESC
    `) as typeof restRows;
  }

  return Response.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating,
    totalReviews,
    latestReview: latest
      ? { id: latest.id, rating: latest.rating, comment: latest.comment, createdAt: latest.created_at }
      : null,
    reviews: restRows.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
    })),
  });
}
