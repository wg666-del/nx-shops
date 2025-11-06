import { useState, useEffect } from "react";

// 实现一个功能强大的 useFetch Hooks
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [url, options]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(url, options);
      const data = await res.json();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  return [data, loading, error, refetch];
};

export default useFetch;

