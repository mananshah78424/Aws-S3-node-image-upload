import axios from "axios";
import { useEffect, useState } from "react";

export default function NewsBar() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=f09d0fd235364f29bab9440454f99ea4`
        );

        setArticles(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching newsbar: ", error);
        setLoading(false);
      }
    };

    // Check if it's time to fetch news
    const checkFetchTime = () => {
      const lastFetch = localStorage.getItem("lastFetch");
      const now = new Date();
      const nextFetchTime = new Date();

      nextFetchTime.setHours(10, 0, 0, 0); // Set next fetch time to 10 AM

      if (!lastFetch || new Date(lastFetch) < now) {
        // Fetch if not fetched today or never fetched
        fetchNews();
        localStorage.setItem("lastFetch", now.toISOString());
      } else if (now > nextFetchTime) {
        // If the current time is past the next fetch time, update the next fetch time
        nextFetchTime.setDate(nextFetchTime.getDate() + 1); // Set next fetch time to the next day
        localStorage.setItem("nextFetch", nextFetchTime.toISOString());
        fetchNews();
      }
    };

    checkFetchTime();

    // Set up polling every 24 hours (86400000 milliseconds)
    const interval = setInterval(checkFetchTime, 86400000); // 24 hours

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4 text-white lg:pr-10 mx-auto lg:mx-0 lg:w-1/3 w-full max-h-screen overflow-y-auto">
      {/* Trending Header */}
      <div className="border-b border-gray-700 pb-2 mt-8">
        <h1 className="text-lg font-bold">
          What is happening Now - Live News Feed
        </h1>
      </div>

      {/* Trend Items */}
      {articles.map((article, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg"
        >
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {/* Text */}
            <div className="flex-1">
              <h2 className="text-base text-xs font-medium text-gray-400">
                {article.title.length > 75
                  ? `${article.title.slice(0, 75)}...`
                  : article.title}
              </h2>

              <p className="text-gray-600 text-xs mt-1">
                {new Date(article.publishedAt).toLocaleDateString()}{" "}
                {/* Format date */}
              </p>
            </div>
            {/* Icon (Optional) */}
          </a>
        </div>
      ))}
    </div>
  );
}
