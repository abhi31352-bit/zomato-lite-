export default function RatingBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#267E3E] px-2 py-0.5 text-sm font-semibold text-white">
      {value} <span aria-hidden="true">★</span>
    </span>
  );
}
