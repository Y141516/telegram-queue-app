'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    setMessages(data || [])
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">My Messages</h1>

      {messages.map((msg) => (
        <div key={msg.id} className="mb-4 p-4 bg-gray-100 rounded-xl">
          <p>{msg.content}</p>
          <span className="text-sm text-gray-500">{msg.status}</span>
        </div>
      ))}
    </div>
  )
}
