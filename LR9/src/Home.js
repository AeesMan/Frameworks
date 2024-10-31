import React, { useContext } from 'react'
import { FaBars } from 'react-icons/fa'
import { AppContext } from './context'
const Home = () => {
  const {openSideBar, openModal, closeSideBar} = useContext(AppContext);
  
  return (
    <main>
      <button className='sidebar-toggle' onClick={() => openSideBar()}>
        <FaBars/>
      </button>
      <button className='sidebar-toggle' onClick={() => closeSideBar()}>
        <FaBars/>
      </button>
      <button className='btn' onClick={() => openModal()}>
        Show modal
      </button>
    </main>
  )
}

export default Home