export default function Loader() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        background: "#ffffff66",
        position: "fixed",
        bottom: 0,
        right: 0,
        width: "calc(100% - 240px)",
        height: "calc(100vh - 64px)",
        zIndex: 2500,
      }}
    >
      <div
        class="spinner-border"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
