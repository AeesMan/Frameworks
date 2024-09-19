import React from 'react';
import Menu from './data';

const Categories = ({filterItems}) => {
  let arr = Menu.map(item => item.category)
  let sort = [...new Set(arr)]
  return (
    <div className='btn-container'>
      <button className='filter-btn' onClick={() => filterItems("all")}>
        All
      </button>

      {
      sort.map((item) => (
        <button className='filter-btn' onClick={() => filterItems(item)}>
          {item}
        </button>
         ))}
    </div>
  )
};

export default Categories;
