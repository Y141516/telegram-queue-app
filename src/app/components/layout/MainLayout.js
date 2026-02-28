"use client"

import Link from "next/link"

export default function MainLayout({ children }) {
  return (
    <div className="h-screen flex flex-col">

      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold">Messenger</h1>

        <nav className="flex gap-6 text-sm">
          <Link href="/">Chats</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (Chat List) */}
        <aside className="w-full md:w-80 border-r border-gray-200 dark:border-neutral-800 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>

          {/* Dummy chat list */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 cursor-pointer">
              John Doe
            </div>
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 cursor-pointer">
              Rahul Sharma
            </div>
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 cursor-pointer">
              Sarah
            </div>
          </div>
        </aside>

        {/* Chat Window */}
        <main className="hidden md:flex flex-1 items-center justify-center">
          <p className="text-gray-400">Select a chat to start messaging</p>
        </main>

      </div>
    </div>
  )
}
