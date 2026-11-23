import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 640,
        margin: "2rem auto",
        padding: "0 1rem",
      }}
    >
      <h1>My Book Tracker</h1>
      <p>A small reading tracker: my library, my reading statuses, my stats.</p>
      <p>
        <Link href="/library">Go to My Library</Link>
      </p>
    </main>
  );
}
