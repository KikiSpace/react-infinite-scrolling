import { useEffect, useState } from "react";
import axios from "axios";

const URL_ENDPOINT = "https://api.itbook.store/1.0/search";

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: `${URL_ENDPOINT}/${query}/${pageNumber}`,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...res.data.books.map((book) => book.title),
            ]),
          ];
        });
        setHasMore(res.data.books.length > 0);
        setLoading(false);
        console.log(res);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, books, hasMore };
};

export default useBookSearch;
