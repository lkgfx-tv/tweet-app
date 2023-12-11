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
import { TwitterTweetEmbed } from "react-twitter-embed";
import styles from "./Tweets.module.css";

function Tweets(props) {
  const { categories } = props;
  const [tweetsList, setTweetsList] = useState([]);
  const [copyText, setCopyText] = useState(false);
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

  const copyUrl = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyText(true);
        setTimeout(() => setCopyText(false), 2000);
      })
      .catch((err) => {
        console.error("Copy error: ", err);
      });
  };

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
    <div className="container d-flex  w-100 mx-1 pb-3 align-items-center justify-content-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-10">
          <div className="card w-100">
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
                      className="list-group-item d-flex justify-content-between"
                    >
                      <div className="d-flex flex-column ">
                        <h5>{tweet.title}</h5>
                        <a href={tweet.url} target="_blank" className="">
                          {tweet.url}
                        </a>
                        <div
                          style={{ width: "100%", marginBottom: "0" }}
                          className={styles.TweetContainer}
                        >
                          <TwitterTweetEmbed
                            tweetId={`${tweet.url.split("/")[5]}`}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <button
                          className="btn btn-secondary my-2 px-2"
                          style={{ height: "40px", width: "80px" }}
                          onClick={() => copyUrl(tweet.url)}
                        >
                          Copy
                        </button>
                        <button
                          className="btn btn-danger my-2 px-2"
                          style={{ height: "40px", width: "80px" }}
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
