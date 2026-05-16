"use client";

import { useState, useTransition } from "react";
import { toggleTodoAction, editTodoAction, deleteTodoAction } from "../actions/todo-actions";

interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  const [, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    
    startTransition(async () => {
      const res = await editTodoAction(id, { title: editText });
      if (!res?.error) setEditingId(null);
    });
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
        No tasks found. Create one above to get started.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl gap-4"
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Toggle Checkbox */}
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => startTransition(() => toggleTodoAction(todo.id, todo.isCompleted))}
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
            />

            {/* Content Logic: Text vs Edit Input */}
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
                autoFocus
              />
            ) : (
              <span
                className={`text-sm font-medium transition-all ${
                  todo.isCompleted ? "line-through text-slate-500" : "text-slate-200"
                }`}
              >
                {todo.title}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {editingId === todo.id ? (
              <>
                <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 font-semibold rounded text-white transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 font-semibold rounded text-slate-400 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditText(todo.title);
                  }}
                  className="p-1 text-xs text-slate-400 hover:text-blue-400 font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => startTransition(() => deleteTodoAction(todo.id))}
                  className="p-1 text-xs text-slate-400 hover:text-red-400 font-medium transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}