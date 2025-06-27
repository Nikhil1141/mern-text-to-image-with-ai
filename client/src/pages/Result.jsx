import React, { memo, useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react" // framer motion import
import {AppContext} from '../context/AppContext';

const Result = () => {

  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const { generateImage } = useContext(AppContext); // Assuming generateImage is a function from context to generate image

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const image = await generateImage(input); // Call the generateImage function from context

      if(image){
        setIsImageLoaded(true); // Set the state to indicate image is loaded
        setImage(image); // Set the generated image URL
        setLoading(false); // Stop loading
      } else {
        setLoading(false); // Stop loading if no image is returned
        console.error("No image generated, please try again.");
      }
    }
  }

  return (
    <motion.form onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center' initial={{ opacity: 0.2, y: 100 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0.1 }} viewport={{ once: true }}>
      <div>
        <div className='relative'>
          <img src={image} alt="sample_img1" className='max-w-sm rounded' />
          <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
        </div>
        {
          loading &&
          <p>Loading.....</p>
        }
        {/* <p className={!loading ? 'hidden' : ''} >Loading.....</p> */}
      </div>

      {
        !isImageLoaded &&
        <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
          <input onChange={e => setInput(e.target.value)} value={input} type="text" placeholder='Describe what you want to generate' className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color' />
          <button type='submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full cursor-pointer'>Generate</button>
        </div>
      }

      {
        isImageLoaded &&
        <div className='flex flex-wrap gap-2 justify-center text-white text-sm p-0.5 rounded-full mt-10'>
          <p onClick={() => { setIsImageLoaded(false) }} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
          <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
        </div>
      }


    </motion.form>
  )
}

export default memo(Result)