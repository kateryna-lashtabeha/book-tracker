import { getBooks } from "@/lib/books";
import LibraryClient from "./library-client";
import { addBook } from "./actions";

export default function LibraryPage() {
  const books = getBooks();

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 640,
        margin: "2rem auto",
        padding: "0 1rem",
      }}
    >
      <h1>My Library</h1>

      <LibraryClient initialBooks={books} />

      <h2>Add a book</h2>
      <form action={addBook}>
        <input name="title" placeholder="Title" required />
        <input name="author" placeholder="Author" required />
        <select name="status" defaultValue="want-to-read">
          <option value="want-to-read">Want to Read</option>
          <option value="reading">Currently Reading</option>
          <option value="read">Read</option>
        </select>
        <button type="submit">Add</button>
      </form>
    </main>
  );
}
