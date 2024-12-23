import { useLocalStorage } from '@mantine/hooks';
import React from 'react'

const Home = () => {
    const [user] = useLocalStorage({
        key: "userData",
        defaultValue: {},
      });
    console.log(user, "user");
    
  return (
    <div>Home</div>
  )
}

export default Home