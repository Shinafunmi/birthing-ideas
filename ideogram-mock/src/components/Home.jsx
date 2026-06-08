import React from 'react'
import { Menu, House, TvMinimalPlay, Bell, Video, Clapperboard   } from 'lucide-react'


const Home = () => {
  return (
    <div className='mx-10 py-5 gap-5 flex flex-col items-start justify-start bg-red-300'>
        <Menu />
        <House />
        <TvMinimalPlay />
        <Bell  />
        <Video />
        <Clapperboard />
    </div>
  );
}

export default Home;