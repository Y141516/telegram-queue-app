'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Props {
  leaderId: string
}

interface Leader {
  id: string
  name: string
}

export default function MessageForm({ leaderId }: Props) {
  const [leader, setLeader] = useState<Leader | null>(null)
  const [content, setContent] = useState('')
  const [type, setType] = useState('question')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchLeader = async () => {
      const { data } = await supabase
        .from('leaders')
        .select('*')
        .eq('id', leaderId)
        .single()

      if (data) setLeader(data)
    }

    fetchLeader()
  }, [leaderId])

  const sendMessage = async () => {
    if (!content.trim()) return

    setSending(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from('messages').insert({
      user_id: user.id,
      leader_id: leaderId,
      content,
      message_type: type,
    })

    setContent('')
    setSending(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">
        Sending to {leader?.name ?? 'Loading...'}
      </h1>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 border p-3 rounded-lg"
      />

      <button
        onClick={sendMessage}
        disabled={!content.trim() || sending}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl mt-4 disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}
