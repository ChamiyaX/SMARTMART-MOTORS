"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#E10600]">
            Critical error
          </p>
          <h1 className="mt-3 text-3xl font-bold">SmartMart Motors</h1>
          <p className="mt-3 max-w-md text-white/60">
            The application failed to load. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 rounded-md bg-[#E10600] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
