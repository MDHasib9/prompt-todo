"use client";

import { useState, useTransition } from "react";
import { createTodoAction } from "../actions/todo-actions";
import { todoSchema } from "../schemas/todos";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Client-side validation for instant feedback
    const result = todoSchema.safeParse({ title });
    if (!result.success) {
      setError(result.error.flatten().fieldErrors.title?.[0] || "Invalid input");
      return;
    }

    // 2. Execute Server Action within a transition boundary
    startTransition(async () => {
      const response = await createTodoAction({ title });
      
      if (response?.error) {
        setError(response.error);
      } else {
        setTitle(""); // Clear input on success
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a new high-priority task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 font-semibold rounded-lg text-white transition-colors text-sm shrink-0"
        >
          {isPending ? "Adding..." : "Add Task"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 font-medium pl-1">{error}</p>}
    </form>
  );
}