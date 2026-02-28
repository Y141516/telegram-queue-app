import { supabase } from './supabaseClient'

export const getLeaderStats = async (leaderId: string) => {
  const today = new Date().toISOString().split('T')[0]

  const { data: pending } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('leader_id', leaderId)
    .eq('status', 'pending')

  const { data: emergency } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('leader_id', leaderId)
    .eq('priority', 'emergency')
    .eq('status', 'pending')

  const { data: resolved } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('leader_id', leaderId)
    .not('resolved_at', 'is', null)
    .gte('resolved_at', today)

  return {
    pending: pending?.length || 0,
    emergency: emergency?.length || 0,
    resolved: resolved?.length || 0,
  }
}

export const toggleQueue = async (
  leaderId: string,
  currentState: boolean
) => {
  await supabase
    .from('leaders')
    .update({ queue_open: !currentState })
    .eq('id', leaderId)
}
