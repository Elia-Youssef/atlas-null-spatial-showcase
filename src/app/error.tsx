"use client";

import { useEffect } from "react";

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset(): void;
}

/** Recoverable route error boundary with a keyboard-accessible reset action. */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("ATLAS route error", error);
  }, [error]);

  return (
    <main id="main-content" className="error-screen" tabIndex={-1}>
      <p className="mono">SYSTEM INTERRUPTION · {error.digest ?? "UNSPECIFIED"}</p>
      <h1>The field lost coherence.</h1>
      <p>The primary interface remains intact. Reinitialize this route to continue.</p>
      <button type="button" onClick={reset}>
        Reinitialize system
      </button>
    </main>
  );
}
