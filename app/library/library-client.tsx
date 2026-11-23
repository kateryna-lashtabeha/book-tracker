"use client";

import { useEffect, useState } from "react";
import type { Book, BookStatus } from "@/lib/books";

const STATUS_LABELS: Record<BookStatus, string> = {
  "want-to-read": "Want to read",
  reading: "Currently Reading",
  read: "Read",
};

const FILTERS: (BookStatus | "")[] = ["", "want-to-read", "reading", "read"];

export default function LibraryClient({
  initialBooks,
}: {
  initialBooks: Book[];
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [status, setStatus] = useState<BookStatus | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBooks(initialBooks);
    setStatus("");
  }, [initialBooks]);

  async function loadBooks(nextStatus: BookStatus | "") {
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (nextStatus) params.set("status", nextStatus);
      const res = await fetch("/api/books?" + params.toString());
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          "Error " + res.status + ": " + (data.error || "unknown error"),
        );
      }
      const data = (await res.json()) as Book[];
      setBooks(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error: check if the server is running",
      );
    } finally {
      setLoading(false);
    }
  }

  function changeFilter(nextStatus: BookStatus | "") {
    setStatus(nextStatus);
    void loadBooks(nextStatus);
  }

  async function markAsRead(id: string) {
    setError("");
    try {
      const res = await fetch("/api/books/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          "Error " + res.status + ": " + (data.error || "unknown error"),
        );
      }
      await loadBooks(status);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error: check if the server is running",
      );
    }
  }

  return (
    <div>
      <div>
        {FILTERS.map((value) => (
          <button
            key={value === "" ? "all" : value}
            onClick={() => changeFilter(value)}
          >
            {value === "" ? "All" : STATUS_LABELS[value]}
          </button>
        ))}
      </div>

      <p>{loading ? "Loading…" : null}</p>
      {error && <p style={{ color: "darkred", minHeight: "1.2em" }}>{error}</p>}

      <p>
        {books.length} {books.length === 1 ? "book" : "books"}
      </p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} — {book.author} ({STATUS_LABELS[book.status]}){" "}
            {book.status !== "read" ? (
              <button onClick={() => void markAsRead(book.id)}>
                Mark as read
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
