import { useState, useCallback, useEffect } from 'react';

export interface ModelData {
  id?: string | number;
  model_name?: string;
  artist_name?: string;
  description?: string;
  tags?: string[];
  trigger_word?: string;
  cover_image?: string;
  user_id: string;
  gen_id: string;
  version: string;
  _reactKey?: string;
  [key: string]: any;
}

export function useModels() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadModels = useCallback(async (cancelled = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("https://d1-start.avi-kay2019.workers.dev/api/models");
      if (!res.ok) {
        throw new Error(`Failed to load models: ${res.statusText}`);
      }
      
      const json = await res.json();
      
      if (!cancelled) {
        // Assign a consistent unique key based on gen_id or fallback
        const dataWithUniqueKeys = (json.data || []).map((m: any, idx: number) => ({
          ...m,
          _reactKey: m.gen_id || m.id || idx.toString()
        }));
        setModels(dataWithUniqueKeys);
      }
    } catch (err: any) {
      console.error("Data fetching error:", err);
      if (!cancelled) setError(err);
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadModels(cancelled);

    const interval = setInterval(() => {
      loadModels(cancelled);
    }, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [loadModels]);

  const refetch = () => {
    loadModels(false);
  };

  return { 
    models, 
    refetch,
    isLoading, 
    error 
  };
}