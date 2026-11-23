import fs from "node:fs";
import path from "node:path";

export const STATUSES = ["want-to-read", "reading", "read"] as const;

export type BookStatus = (typeof STATUSES)[number];

export type Book = {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  createdAt?: string;
};

export type BookStats = {
  total: number;
  wantToRead: number;
  reading: number;
  read: number;
};

export function getBooks(): Book[] {
  const filePath = path.join(process.cwd(), "data", "books.json");

  const fileContents = fs.readFileSync(filePath, "utf8");

  return JSON.parse(fileContents) as Book[];
}

export function saveBooks(books: Book[]): void {
  const filePath = path.join(process.cwd(), "data", "books.json");

  fs.writeFileSync(filePath, JSON.stringify(books, null, 2), "utf8");
}

export function getStats(books: Book[]): BookStats {
  const stats = books.reduce<BookStats>(
    (result, book) => {
      if (book.status === "want-to-read") {
        result.wantToRead++;
      } else if (book.status === "read") {
        result.read++;
      } else if (book.status === "reading") {
        result.reading++;
      }
      result.total++;
      return result;
    },
    {
      total: 0,
      wantToRead: 0,
      reading: 0,
      read: 0,
    },
  );
  return stats;
}
