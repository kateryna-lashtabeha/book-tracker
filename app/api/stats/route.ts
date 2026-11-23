import { connection, NextResponse } from "next/server";
import { getBooks, type Book } from "@/lib/books";
import { getStats } from "@/lib/books";

// type BookStats = {
//   readBooks: Book[];
//   currentlyReading: Book[];
//   wantToRead: Book[];
// };

export async function GET() {
  await connection();
  //   const books: Book[] = getBooks();

  //   const stats = books.reduce<BookStats>(
  //     (result, book) => {
  //       if (book.status === "read") {
  //         result.readBooks.push(book);
  //       } else if (book.status === "reading") {
  //         result.currentlyReading.push(book);
  //       } else if (book.status === "want-to-read") {
  //         result.wantToRead.push(book);
  //       }

  //       return result;
  //     },
  //     {
  //       total: book.length,
  //       readBooks: [],
  //       currentlyReading: [],
  //       wantToRead: [],
  //     },
  //   );

  //   return NextResponse.json({
  //     total: books.length,
  //     wantToRead: stats.wantToRead,
  //     reading: stats.currentlyReading,
  //     read: stats.readBooks,
  //   });
  const stats = getStats(getBooks());
  return NextResponse.json(stats);
}
