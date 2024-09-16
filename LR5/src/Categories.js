import React from 'react';
import Menu from './data';

const Categories = ({filterItems}) => {
  let arr = Menu.map(item => item.category)
  let huinya = [...new Set(arr)]
  return (
    <div className='btn-container'>
      <button className='filter-btn' onClick={() => filterItems("all")}>
        All
      </button>

      {
      huinya.map((item) => (
        <button className='filter-btn' onClick={() => filterItems(item)}>
          {item}
        </button>
         ))}
    </div>
  )
};

export default Categories;
