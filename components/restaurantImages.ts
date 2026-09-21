// Frontend-only map: restaurant id -> local photo served from public/.
// There is deliberately no image column in the database; ids missing
// here fall back to the gradient placeholder.
export const RESTAURANT_IMAGES: Record<number, string> = {
  1: "/restaurants/ludhiana-burrito.jpg",
};
