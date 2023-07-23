import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';

interface Emoji {
  name: string;
  category: string;
  group: string;
  htmlCode: string;
}

const EmojiCard: React.FC<Emoji> = ({ name, category, group, htmlCode }) => {
  return (
    <div className="emoji-card">
      <div className="emoji" dangerouslySetInnerHTML={{ __html: htmlCode }} />
      <div className="emoji-details">
        <p>Name: {name}</p>
        <p>Category: {category}</p>
        <p>Group: {group}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const emojisPerPage = 10;

  useEffect(() => {
    fetchEmojis();
  }, []);

  const fetchEmojis = async () => {
    try {
      const response = await axios.get('https://emojihub.yurace.pro/api/all');
      setEmojis(response.data);
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  };

  useEffect(() => {
    setFilteredEmojis(emojis);
  }, [emojis]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * emojisPerPage;
    const endIndex = startIndex + emojisPerPage;
    setFilteredEmojis(emojis.slice(startIndex, endIndex));
  }, [currentPage, emojis]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === 'all') {
      setFilteredEmojis(emojis);
    } else {
      const filtered = emojis.filter((emoji) => emoji.category === selectedCategory);
      setFilteredEmojis(filtered);
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(emojis.length / emojisPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Router>
      <div className="App">
        <h1 className="emoji-list-title">Emoji List</h1>
        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category: </label>
          <select id="category-select" onChange={handleCategoryChange}>
            <option value="all">All</option>
            {Array.from(new Set(emojis.map((emoji) => emoji.category))).map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="emoji-list">
          {filteredEmojis.map((emoji, index) => (
            <EmojiCard key={index} {...emoji} />
          ))}
        </div>
        <div className="pagination">
          {pageNumbers.map((pageNumber) => (
            <NavLink key={pageNumber} to={`/${pageNumber}`}>
              <button className={pageNumber === currentPage ? 'active' : ''}>{pageNumber}</button>
            </NavLink>
          ))}
        </div>
      </div>
    </Router>
  );
};

export default App;
