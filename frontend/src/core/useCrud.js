import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function useCrud(entity) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await api.get(`/${entity}`);
    setData(res.data);
    setLoading(false);
  };

  const create = async (payload) => {
    await api.post(`/${entity}`, payload);
    load();
  };

  const update = async (id, payload) => {
    await api.put(`/${entity}/${id}`, payload);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/${entity}/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, create, update, remove };
}
