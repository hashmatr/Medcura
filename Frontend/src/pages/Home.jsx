import React from 'react'
import Header from '../Component/Header';
import Banner from '../Component/Banner';
import SpecialityMenu from '../Component/SpecialityMenu';
import TopDoctors from '../Component/TopDoctors';
import AIAgent from '../Component/AIAgent'; // Import the AI Agent

const Home = () => {
  return (
    <div>
      <Header/>
      <SpecialityMenu/>
      <TopDoctors/>
      <Banner/>
      <AIAgent/>
    </div>
  )
}

export default Home