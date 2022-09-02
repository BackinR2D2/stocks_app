import { React, useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import axios from 'axios';
import Loader from './Loader';
import Swal from 'sweetalert2';

const options = {
  method: 'GET',
  url: 'https://bing-news-search1.p.rapidapi.com/news/search',
  params: {
    q: 'stocks',
    count: '100',
    freshness: 'Day',
    textFormat: 'Raw',
    safeSearch: 'Moderate'
  },
  headers: {
    'X-BingApis-SDK': 'true',
    'X-RapidAPI-Key': process.env.REACT_APP_NEWS_API_KEY,
    'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
  }
};

function Homepage() {

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const getArticles = async () => {
    try {
      const articles = await axios.request(options);
      setNews((articles.data.value).filter(article => article.image !== undefined));
      setLoading(false);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Some error occured while trying to fetch the articles. Try again later.',
        position: 'center'
      });
    }
  }

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className="homepage">
      <h3 className="header">Stocks related news</h3>
      {
        loading ?
          <Loader />
        :
          <div className="newsArticles">
            {
              news.map((article, index) => (
                <div key={index} className="newsArticle">
                  <div className="articleImage">
                    <a href={article.url} target="_blank" rel="noreferrer">
                      <LazyLoadImage
                        alt={"article"}
                        src={article.image.thumbnail.contentUrl}
                        effect="blur" />
                    </a>
                  </div>
                  <div className="articleBody">
                    <a href={article.url} target="_blank" rel="noreferrer" className="articleTitle">
                      <h4>{article.name}</h4>
                    </a>
                    <p className="articlePublishedDate">Published on {new Date(article.datePublished).toLocaleString()}</p>
                    <p>{article.description}</p>
                  </div>
                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default Homepage;