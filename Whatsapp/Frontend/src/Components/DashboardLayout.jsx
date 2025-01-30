import React from 'react'
import Sidebar from './Sidebar'

const DashboardLayout = ({children}) => {
  return (
    <div className='grid lg:grid-cols-[350px, 1fr] h-screen max-h-screen '>
    <section>
        <Sidebar />
    </section>
    {children}
    </div>
  )
}

export default DashboardLayout