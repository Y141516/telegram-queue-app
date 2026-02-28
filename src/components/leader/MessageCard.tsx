'use client'

import { supabase } from '@/lib/supabaseClient'

interface Props {
  message: {
    id: string
    content: string
    status: string
    priority: string
    created_at: string
  }
}

export default function MessageCard({ message }: Props) {
  const resolveMessage = async () => {
    await supabase
      .from('messages')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
      })
      .eq('id', message.id)
  }

  const isEmergency = message.priority === 'emergency'

  return (
    <div
      className={`p-6 rounded-2xl ${
        isEmergency
          ? 'bg-red-900/30 border border-red-500'
          : 'bg-slate-900'
      }`}
    >
      <div className="flex justify-between">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            message.status === 'pending'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          {message.status}
        </span>

        {isEmergency && (
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
            Emergency
          </span>
        )}
      </div>

      <p className="mt-4 text-lg">{message.content}</p>

      {message.status === 'pending' && (
        <button
          onClick={resolveMessage}
          className="mt-4 bg-green-600 px-4 py-2 rounded-lg"
        >
          Mark Resolved
        </button>
      )}
    </div>
  )
}
