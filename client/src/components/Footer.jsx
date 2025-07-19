import React, { memo } from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='flex items-center justify-between gap-4 py-3 mt-20'>
      <img src={assets.logo} alt="logo" className='w-28 sm:w-32 lg:w-30' />
      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright @Text2Vision | All rights reserved.</p>
      <div className='flex gap-2.5'>
        <img src={assets.facebook_icon} alt="facebook_icon" />
        <img src={assets.twitter_icon} alt="twitter_icon" />
        <img src={assets.instagram_icon} alt="instagram_icon" />
      </div>
    </div>
  )
}

export default memo(Footer)