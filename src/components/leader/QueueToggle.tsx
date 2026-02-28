import { toggleQueue } from '@/lib/leaderQueries'

interface Props {
  leaderId: string
  queueOpen: boolean
  setQueueOpen: (value: boolean) => void
}

export default function QueueToggle({
  leaderId,
  queueOpen,
  setQueueOpen,
}: Props) {
  const handleToggle = async () => {
    await toggleQueue(leaderId, queueOpen)
    setQueueOpen(!queueOpen)
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900">
      <p className="mb-4">
        {queueOpen
          ? 'Queue Open – Users can send messages'
          : 'Queue Closed – Users cannot send messages'}
      </p>

      <button
        onClick={handleToggle}
        className={`px-6 py-3 rounded-xl ${
          queueOpen ? 'bg-green-600' : 'bg-red-600'
        }`}
      >
        {queueOpen ? 'Turn OFF Queue' : 'Turn ON Queue'}
      </button>
    </div>
  )
}
