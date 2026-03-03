// src/app/user/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  group_name: string;
  queue_open: boolean;
  messages_count: number;
  max_messages: number;
}

export default function UserHome({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(/api/get-user/${params.id})
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) {
          alert('Error fetching user data: ' + (data?.error || 'Unknown'));
          setLoading(false);
          return;
        }
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        alert('Crash: ' + err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="text-white p-4">Loading profile...</div>;
  if (!user) return <div className="text-white p-4">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex items-center mb-4">
        <button className="mr-4" onClick={() => history.back()}>&larr;</button>
        <h1 className="text-xl font-bold">{user.first_name}</h1>
        <button className="ml-auto">?</button>
      </div>

      <div className="bg-gray-800 rounded p-4 mb-4">
        <p>Group: {user.group_name}</p>
        <p>Queue Status: {user.queue_open ? 'Open' : 'Closed'}</p>
        <p>Messages: {user.messages_count} / {user.max_messages}</p>
      </div>

      <button
        disabled={!user.queue_open || user.messages_count >= user.max_messages}
        className={px-4 py-2 rounded ${user.queue_open && user.messages_count < user.max_messages ? 'bg-blue-500' : 'bg-gray-600 cursor-not-allowed'}}
      >
        Send Message
      </button>
    </div>
  );
}