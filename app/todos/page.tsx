import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma"; // Adjust relative route paths depending on folder location
import TodoForm from "../../components/todo-form";
import TodoList from "../../components/todo-list";

export default async function TodosPage() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Fetch todos directly from Neon Postgres on the server
  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }, // Fresh tasks on top
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 sm:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Block */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              My Workspace
            </h1>
            <p className="text-sm text-slate-400">Manage your high-performance application queue</p>
          </div>
          <UserButton />
        </header>

        {/* Content Flow Architecture */}
        <div className="space-y-6">
          <TodoForm />
          <TodoList todos={todos} />
        </div>

      </div>
    </main>
  );
}