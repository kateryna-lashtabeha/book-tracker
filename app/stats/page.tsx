import { getBooks, getStats } from "@/lib/books";

export default function StatsPage() {
  const books = getBooks();
  const stats = getStats(books);
  const readPercent =
    stats.total === 0 ? 0 : Math.round((stats.read / stats.total) * 100);

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 640,
        margin: "2rem auto",
        padding: "0 1rem",
      }}
    >
      <h1>Reading Stats</h1>
      <p>
        {stats.total} {stats.total === 1 ? "book" : "books"} in total
      </p>
      <ul>
        <li>Want to read: {stats.wantToRead}</li>
        <li>Reading: {stats.reading}</li>
        <li>Read: {stats.read}</li>
      </ul>
      <p>{readPercent}% read</p>
    </main>
  );
}
