import React, { useEffect, useState } from "react";
import PostFinders from "../baseApi";
import ProfilePostCard from "../components/ProfilePostCard";
import SideBar from "../components/SideBar";
export default function Search() {
  const [searchVal, setSearchVal] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const result = await PostFinders.get("/");
        console.log("Fetched posts", result);
        setPosts(result.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    getPosts();
  }, []);

  const handleInputChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleSearch = () => {
    // Filter posts based on search value
    const filterBySearch = posts.filter((item) =>
      item.caption.toLowerCase().includes(searchVal.toLowerCase())
    );
    setFilteredPosts(filterBySearch); // Update filtered posts
  };

  return (
    <div className="flex flex-col flex-grow flex-shrink-0 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 lg:h-full lg:sticky lg:top-0">
          <SideBar />
        </div>
        <div className="flex flex-col lg:w-3/4 mt-6">
          <input
            type="text"
            value={searchVal}
            onChange={handleInputChange}
            placeholder="Search..."
            className="p-2 border rounded outline-none"
          />
          <button
            onClick={handleSearch}
            className="mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Search
          </button>
          {/* Display filtered posts */}
          <div className="mt-4">
            {filteredPosts.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPosts.length ? (
                    filteredPosts.map((post) => (
                      <ProfilePostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <p className="text-gray-500">No posts available.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-white">No results found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
