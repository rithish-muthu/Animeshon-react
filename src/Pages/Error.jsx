import React from 'react'
import ErrorImage from '../assets/error.png'
import { Link } from 'react-router-dom'

function Error() {
  return (
<div className="bg-cover bg-center bg-no-repeat h-screen" style={{ backgroundImage: `url(${ErrorImage})` }}>
    <div className="flex items-end justify-center h-full">
        <Link to={'/'}>
        <button className='text-black bg-[#47aa96] p-3 mb-8 rounded-xl'>Back to home</button>
        </Link>
    </div>
</div>
  )
}

export default Error