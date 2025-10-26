// src/hooks/useSessions.ts
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function useSessions({ from, to, topic }:{from?:string,to?:string,topic?:string}) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error|null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/sessions', { params: { from, to, topic }})
      .then(res => setSessions(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [from, to, topic]);

  return { sessions, loading, error, setSessions };
}
