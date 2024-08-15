const axios = require("axios");
const getNews = async (req, res) => {
  try {
    const response = await axios.get(
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=f09d0fd235364f29bab9440454f99ea4"
    );
    // console.log(response);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

module.exports = {
  getNews,
};
