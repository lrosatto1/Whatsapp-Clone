import { useLocalStorage } from '@mantine/hooks';
import React from 'react'
import DashboardLayout from './DashboardLayout';

const Home = () => {
    const [user] = useLocalStorage({
        key: "userData",
        defaultValue: {},
      });
    console.log(user, "user");
    
  return (
    <DashboardLayout>
      
    </DashboardLayout>
  )
}

export default Home