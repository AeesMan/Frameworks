import React, { useState } from 'react';
import { FaInfo } from "react-icons/fa";
const Question = ({title, info}) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <article className='question'>
      <header>
        <h4>{title}</h4>
        <button
          className='btn'
          onClick={() => {
          setShowInfo(!showInfo);
          }}>
          {showInfo ? <FaInfo /> : <FaInfo />}
        </button>
      </header>

      {showInfo && <p>{info}</p>}
    </article>
  )
};

export default Question;
