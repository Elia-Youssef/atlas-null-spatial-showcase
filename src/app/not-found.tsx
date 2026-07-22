import Link from "next/link";

/** Static 404 route suitable for direct GitHub Pages navigation. */
export default function NotFound() {
  return (
    <main id="main-content" className="error-screen" tabIndex={-1}>
      <p className="mono">404 · NODE NOT FOUND</p>
      <h1>This coordinate is empty.</h1>
      <p>The requested system is outside the current ATLAS field.</p>
      <Link href="/">Return to index</Link>
    </main>
  );
}
