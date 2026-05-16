"use server"; // Tells Next.js to treat every function in this file as a secure server-side entrypoint

import { prisma } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { todoSchema } from "../schemas/todos";
import { revalidatePath } from "next/cache";

/**
 * Action: Create a new Todo
 */
export async function createTodoAction(rawInput: unknown) {
  // 1. Authenticate the user securely on the server
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access");

  // 2. Validate the incoming data against our Zod schema
  const validation = todoSchema.safeParse(rawInput);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors.title?.[0] || "Invalid data" };
  }

  const { title } = validation.data;

  try {
    // 3. Write to Neon Postgres via Prisma
    await prisma.todo.create({
      data: {
        title,
        userId,
      },
    });

    // 4. Purge the Next.js cache for the /todos page so the UI displays the fresh data instantly
    revalidatePath("/todos");
    return { success: true };
  } catch (error) {
    return { error: "Database failure: Could not create task." };
  }
}

/**
 * Action: Toggle completion status
 */
export async function toggleTodoAction(id: string, currentStatus: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access");

  try {
    // Crucial Security check: Ensure this todo belongs to the current user before updating
    await prisma.todo.update({
      where: { id, userId },
      data: { isCompleted: !currentStatus },
    });

    revalidatePath("/todos");
  } catch (error) {
    return { error: "Failed to update task status." };
  }
}

/**
 * Action: Edit the text content of a todo
 */
export async function editTodoAction(id: string, rawInput: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access");

  const validation = todoSchema.safeParse(rawInput);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors.title?.[0] || "Invalid data" };
  }

  try {
    await prisma.todo.update({
      where: { id, userId },
      data: { title: validation.data.title },
    });

    revalidatePath("/todos");
    return { success: true };
  } catch (error) {
    return { error: "Failed to edit task." };
  }
}

/**
 * Action: Delete a todo permanently
 */
export async function deleteTodoAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access");

  try {
    await prisma.todo.delete({
      where: { id, userId },
    });

    revalidatePath("/todos");
  } catch (error) {
    return { error: "Failed to delete task." };
  }
}