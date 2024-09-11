import React, { useState } from 'react';
import people from './data';
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from 'react-icons/fa';

const Review = () => {
  const [index, setIndex] = useState(0);
  const { name, job, image, text } = people[index];

  const checkNumber = (number) => {
    if (number > people.length - 1) {
      return 0;
    }
    if (number < 0) {
      return people.length - 1;
    }
    return number;
  };

  const surprise = () => {
  let randomIndex = Math.floor(Math.random() * people.length);
  if (randomIndex === index) {
    randomIndex = (index + 1) % people.length;
  }
  setIndex(randomIndex);
  };

  const prevCard = () => {
    if (index === 0) {
      setIndex(people.length - 1);
    } else {
      setIndex(index - 1);
    }
  };
  

  const nextCard = () => {
    if(index === people.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

 

  return (
    <article className="review">
      <div className="img-container">
        <img src={image} alt={name} className="person-img" />
        <span className="quote-icon">
          <FaQuoteRight />
        </span>
      </div>
      <h4 className="author">{name}</h4>
      <p className="job">{job}</p>
      <p className="info">{text}</p>
      <div className="button-container">
        <button className="prev-btn" onClick={prevCard}>
          <FaChevronLeft />
        </button>
        <button className="next-btn" onClick={nextCard}>
          <FaChevronRight />
        </button>
      </div>
      <button className="random-btn" onClick={surprise}>Surprise me</button>
    </article>
  );
};

export default Review;
