/** Route-level loading state that preserves the visual grid while client bundles resolve. */
export default function Loading() {
  return (
    <div className="loading-screen" aria-busy="true" role="status">
      <p className="mono">CALIBRATING SPATIAL FIELD</p>
      <div className="loading-line" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
