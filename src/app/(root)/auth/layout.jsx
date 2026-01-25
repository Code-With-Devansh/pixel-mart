import React from 'react'

const Layout = ({children}) => {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>{children}</div>
  )
}

export default Layout