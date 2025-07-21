import React, { memo, useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className='flex items-center justify-between py-4 relative'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='w-28 sm:w-32 lg:w-30' />
      </Link>

      {/* Mobile Menu Icon */}
      <div className='sm:hidden z-50' onClick={toggleMenu}>
        {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
      </div>

      {/* Desktop Menu */}
      <div className='hidden sm:flex items-center gap-2 sm:gap-3'>
        {user ? (
          <>
            <button onClick={() => navigate('/buy')} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
              <img src={assets.credit_star} alt="credit_star" className='w-5' />
              <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits left: {credit}</p>
            </button>

            {/* DASHBOARD LINK */}
            <p className='cursor-pointer text-gray-600 max-sm:hidden pl-4' onClick={() => navigate('/dashboard')}>Dashboard</p>

            <p className='text-gray-600 max-sm:hidden pl-4'>Hi, {user.name}</p>
            <div className='relative group'>
              <img src={assets.profile_icon} className='w-10 drop-shadow' alt="profile_icon" />
              <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                <ul className='list-none m-0 p-2 bg-white rounded-md text-sm'>
                  <li onClick={() => { logout(); navigate('/'); }} className='py-1 px-10 cursor-pointer pr-10'>Logout</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className='cursor-pointer' onClick={() => navigate('/buy')}>Pricing</p>
            <button onClick={() => navigate('/login')} className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full cursor-pointer'>Login</button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='absolute top-[64px] right-0 w-full bg-white py-6 px-6 flex flex-col gap-4 sm:hidden shadow-md z-40'>
          {user ? (
            <>
              <button onClick={() => { navigate('/buy'); closeMenu(); }} className='flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full'>
                <img src={assets.credit_star} alt="credit_star" className='w-5' />
                <p className='text-sm text-gray-600'>Credits left: {credit}</p>
              </button>

              {/* DASHBOARD LINK - MOBILE */}
              <p className='cursor-pointer' onClick={() => { navigate('/dashboard'); closeMenu(); }}>Dashboard</p>

              <p className='text-gray-600'>Hi, {user.name}</p>
              <button onClick={() => { logout(); closeMenu(); navigate('/'); }} className='text-left text-red-600'>Logout</button>
            </>
          ) : (
            <>
              <p className='cursor-pointer' onClick={() => { navigate('/buy'); closeMenu(); }}>Pricing</p>
              <button onClick={() => { navigate('/login'); closeMenu(); }} className='bg-zinc-800 text-white px-5 py-2 rounded-full'>Login</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(Navbar)
