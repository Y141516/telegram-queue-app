import { useRouter } from 'next/navigation'

export default function BulkReplyButton({
  leaderId,
}: {
  leaderId: string
}) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/leader/messages')}
      className="bg-blue-600 px-6 py-3 rounded-xl w-full"
    >
      Reply to all messages
    </button>
  )
}
