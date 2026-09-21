import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#E8E8E8] bg-white">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-block rounded text-2xl font-extrabold lowercase tracking-tight text-[#E23744] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E23744]"
        >
          zomato lite
        </Link>
      </div>
    </header>
  );
}
