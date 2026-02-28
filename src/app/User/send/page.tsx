'use client'

import { useSearchParams } from 'next/navigation'
import MessageForm from '@/components/MessageForm'


export default function SendPage() {
  const params = useSearchParams()
  const leaderId = params.get('leader')

  if (!leaderId) {
    return <div className="p-6">No leader selected</div>
  }

  return <MessageForm leaderId={leaderId} />
}
