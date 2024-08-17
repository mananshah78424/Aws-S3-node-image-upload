import { useEffect, useState } from "react";
import PostFinder from "../baseApi";
export default function NewsBar({ setReady }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await PostFinder.get("/news"); // Fetch from your proxy

        setArticles(response.data.articles);
        setLoading(false);
        setReady(true); // Notify parent that NewsBar is ready
      } catch (error) {
        console.log("Error fetching newsbar: ", error);
        setLoading(false);
        setReady(true); // Notify parent even if there's an error
      }
    };

    const checkFetchTime = () => {
      const lastFetch = localStorage.getItem("lastFetch");
      const now = new Date();
      const nextFetchTime = new Date();
      nextFetchTime.setHours(10, 0, 0, 0);

      if (!lastFetch || new Date(lastFetch) < now) {
        fetchNews();
        localStorage.setItem("lastFetch", now.toISOString());
      } else if (now > nextFetchTime) {
        nextFetchTime.setDate(nextFetchTime.getDate() + 1);
        localStorage.setItem("nextFetch", nextFetchTime.toISOString());
        fetchNews();
      }
    };

    checkFetchTime();

    const interval = setInterval(checkFetchTime, 86400000);

    return () => clearInterval(interval);
  }, [setReady]);

  if (loading) return <div className="p-4">Loading News...</div>;

  return (
    <div className="p-4 space-y-4 text-white lg:pr-10 mx-auto lg:mx-0 lg:w-1/3 w-full max-h-screen overflow-y-auto">
      <div className="border-b border-gray-700 pb-2 mt-8">
        <h1 className="text-lg font-bold">
          What is happening Now - Live News Feed
        </h1>
      </div>
      {articles.map((article, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg"
        >
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <div className="flex-1">
              <h2 className="text-base text-xs font-medium text-gray-400">
                {article.title.length > 75
                  ? `${article.title.slice(0, 75)}...`
                  : article.title}
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
