interface Leader {
  id: string
  name: string
}

interface Props {
  leaders: Leader[]
  onSelect: (id: string) => void
}

export default function LeaderSelectModal({
  leaders,
  onSelect,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-lg font-bold mb-4">
          Choose Leader
        </h2>

        {leaders.map((leader) => (
          <button
            key={leader.id}
            onClick={() => onSelect(leader.id)}
            className="w-full mb-2 bg-gray-100 p-3 rounded-lg hover:bg-gray-200"
          >
            {leader.name}
          </button>
        ))}
      </div>
    </div>
  )
}
