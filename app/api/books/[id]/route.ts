import { NextRequest, NextResponse } from "next/server";
import { getBooks, saveBooks, STATUSES, type BookStatus } from "@/lib/books";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const books = getBooks();
  const book = books.find((book) => book.id === id);

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json(book);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!Number.isInteger(Number(id)) || Number(id) < 1) {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  const books = getBooks();
  const book = books.find((book) => book.id === id);

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("status" in body) ||
    typeof body.status !== "string" ||
    !STATUSES.includes(body.status as BookStatus)
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updatedBooks = books.map((book) =>
    book.id === id
      ? {
          ...book,
          status: body.status as BookStatus,
        }
      : book,
  );

  saveBooks(updatedBooks);

  const updatedBook = updatedBooks.find((book) => book.id === id);

  return NextResponse.json(updatedBook);
}
