interface Props {
  title: string
  count: number
  color: 'yellow' | 'red' | 'green'
}

export default function StatsCard({
  title,
  count,
  color,
}: Props) {
  const colorMap = {
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
    green: 'bg-green-500/20 text-green-400',
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900">
      <div className={`inline-block px-3 py-1 rounded ${colorMap[color]}`}>
        {count}
      </div>
      <p className="mt-2 text-lg">{title}</p>
    </div>
  )
}
