import { useState, useEffect } from "react";

const useFetchData = ({ url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then((res) => {
      res.json().then((result) => {
        setData(result?.data);
        setLoading(false);
      });
    });
  }, [url]);

  return { data, loading };
};

export default useFetchData