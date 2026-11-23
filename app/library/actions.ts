"use server";

import { revalidatePath } from "next/cache";
import { getBooks, saveBooks, STATUSES, type BookStatus } from "@/lib/books";

export async function addBook(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const status = String(formData.get("status") ?? "want-to-read");

  if (!title || !author) return;
  if (!STATUSES.includes(status as BookStatus)) return;

  const books = getBooks();
  books.push({
    id:
      books.length > 0
        ? (Number(books[books.length - 1].id) + 1).toString()
        : "1",
    title,
    author,
    status: status as BookStatus,
    createdAt: new Date().toISOString().split("T")[0],
  });
  saveBooks(books);

  revalidatePath("/library");
  revalidatePath("/stats");
}
