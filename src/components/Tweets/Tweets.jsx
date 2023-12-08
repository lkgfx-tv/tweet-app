import { useState, useEffect } from "react";
import {
  getTweets,
  getTweetsByCategory,
  getTweetsByKeyword,
  deleteTweet,
} from "@/services/apiFecthServices";
import FilterSelection from "../FilterSelection/FilterSelection";
import CreateModal from "../CreateModal/CreateModal";
import TweetForm from "./TweetForm";

function Tweets(props) {
  const { categories } = props;
  const [tweetsList, setTweetsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const tweets = await getTweets();
      setTweetsList(tweets);
    };
    fetchData();
    setLoading(false);
  }, []);

  const handleSelectChange = async (event) => {
    setLoading(true);
    setSelectedCategory(event.target.value);
    if (!event.target.value || event.target.value === "") {
      const tweets = await getTweets();
      setTweetsList(tweets);
    } else {
      const tweets = await getTweetsByCategory(event.target.value);
      setTweetsList(tweets);
    }
    setLoading(false);
  };

  const handleInputChange = async (event) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const handleFilterByKeyword = async () => {
    const tweets = await getTweetsByKeyword(keyword);
    setTweetsList(tweets);
  };

  const handleDeleteTweet = async (id) => {
    setLoading(true);
    await deleteTweet(id);
    const tweets = await getTweets();
    setTweetsList(tweets);
    setLoading(false);
  };

  return (
    <div className="container d-flex  mx-auto align-items-center justify-content-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-center">
                <h5 className="card-title p-2 my-2 text-center">Tweets</h5>
                <FilterSelection
                  categories={categories}
                  selectedCategory={selectedCategory}
                  handleSelectChange={handleSelectChange}
                />
                <CreateModal type="tweet">
                  <TweetForm
                    categories={categories}
                    tweetsList={tweetsList}
                    setTweetsList={setTweetsList}
										setLoading={setLoading}
                  />
                </CreateModal>
              </div>
              <div className="d-flex justify-content-center">
                <input
                  type="text"
                  id="keyword"
                  className="form-control w-50"
                  placeholder="Search"
                  onChange={(e) => handleInputChange(e)}
                />
                <button
                  type="button"
                  className="btn btn-primary mx-1"
                  onClick={() => handleFilterByKeyword()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="list-group">
                  {tweetsList.map((tweet) => (
                    <div
                      key={tweet.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between"
                    >
                      <div className="w-90">
                        <h5>{tweet.title}</h5>
                        <a href={tweet.url} target="_blank" className="">
                          {tweet.url}
                        </a>
                      </div>
                      <div className="w-10 d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-danger my-2 px-2"
                          style={{ height: "40px" }}
                          onClick={() => handleDeleteTweet(tweet.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tweets;
