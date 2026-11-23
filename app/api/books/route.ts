import { NextRequest, NextResponse } from "next/server";
import { getBooks, saveBooks, STATUSES, type BookStatus } from "@/lib/books";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const q = request.nextUrl.searchParams.get("q");
  const pageParam = request.nextUrl.searchParams.get("page");
  const limitParam = request.nextUrl.searchParams.get("limit");

  const page = pageParam === null ? 1 : Number(pageParam);
  const limit = limitParam === null ? 10 : Number(limitParam);

  // if status is invalid
  if (status && !STATUSES.includes(status as BookStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  // if pagination parameters are invalid
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    return NextResponse.json(
      { error: "Invalid pagination parameters" },
      { status: 400 },
    );
  }

  let filteredBooks = getBooks();

  // filtering by status
  if (status) {
    filteredBooks = filteredBooks.filter((book) => book.status === status);
  }

  //filtering by query
  const query = q?.trim().toLowerCase();
  if (query) {
    filteredBooks = filteredBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query),
    );
  }

  // pagination
  const totalCount = filteredBooks.length;
  const startIndex = (page - 1) * limit;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + limit);

  return NextResponse.json(paginatedBooks, {
    headers: {
      "X-Total-Count": String(totalCount),
    },
  });
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();

  if (
    typeof body !== "object" ||
    body === null ||
    !("title" in body) ||
    !("author" in body) ||
    !("status" in body)
  ) {
    return NextResponse.json({ error: "Invalid book data" }, { status: 400 });
  }

  if (
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.author !== "string" ||
    !body.author.trim() ||
    typeof body.status !== "string" ||
    !STATUSES.includes(body.status as BookStatus)
  ) {
    return NextResponse.json({ error: "Invalid book data" }, { status: 400 });
  }
  const books = getBooks();

  const newBook = {
    id: (books.length > 0
      ? Math.max(...books.map((book) => Number(book.id))) + 1
      : 1
    ).toString(),
    title: body.title.trim(),
    author: body.author.trim(),
    status: body.status as BookStatus,
  };
  const updatedBooks = [...books, newBook];
  saveBooks(updatedBooks);

  return NextResponse.json(newBook, { status: 201 });
}
