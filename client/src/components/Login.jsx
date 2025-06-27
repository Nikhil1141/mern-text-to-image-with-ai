import React, { memo, useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { motion } from "motion/react" // framer motion import
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

    const [state, setState] = useState('Login'); // to toggle between Login and Sign Up
    const {setShowLogin, backendUrl, setToken, setUser} = useContext(AppContext); // context to control the visibility of the login modal

    const [name, setName] = useState(''); // state for full name in Sign Up
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try{
            if(state === 'Login'){
                const {data} = await axios.post(backendUrl + '/api/user/login', {
                    email,
                    password
                }) // login request to the backend

                if(data.success){
                    setToken(data.token); // set token in context
                    setUser(data.user); // set user in context
                    localStorage.setItem('token', data.token); // store token in local storage
                    setShowLogin(false); // close the login modal
                    toast.success('Login successful!'); // show success message
                }
                else{
                    toast.error(data.message || 'Login failed. Please try again.');
                }
            }
            else{
                const {data} = await axios.post(backendUrl + '/api/user/register', {
                    name,
                    email,
                    password
                }) // sign up request to the backend

                if(data.success){
                    setToken(data.token); // set token in context
                    setUser(data.user); // set user in context
                    localStorage.setItem('token', data.token); // store token in local storage
                    setShowLogin(false); // close the login modal
                    toast.success('Registration successful!'); // show success message
                }
                else{
                    toast.error(data.message || 'Registration failed. Please try again.');
                }
            }
        }
        catch(error){
            console.error(error);
            toast.error('Error occurred. Please try again later'); // handle errors
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    },[]) // to prevent body scroll when login modal is open

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center' >
            <motion.form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500' initial={{ opacity: 0.2, y: 50 }} transition={{ duration: 0.8 }} whileInView={{opacity: 1, y: 0}} viewport={{once: true}}>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>

                {state !== 'Login' && <div className=' px-3 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img width={30} src={assets.profile_icon} alt="user_icon" />
                    <input onChange={e => setName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full Name' required />
                </div>}

                <div className=' px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.email_icon} alt="email_icon" />
                    <input onChange={e => setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email id' required />
                </div>

                <div className=' px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.lock_icon} alt="lock_icon" />
                    <input onChange={e => setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='Password' required />
                </div>

                <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>
                <button className='bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer'>{state === 'Login' ? 'login' : 'create account'}</button>
                {
                    state === 'Login' ? <p className='mt-5 text-center'>Don't have an account?<span onClick={()=> setState('Sign Up')} className='text-blue-600 cursor-pointer'>Sign up</span></p> :
                        <p className='mt-5 text-center'>Already have an account?<span onClick={()=> setState('Login')} className='text-blue-600 cursor-pointer'>Login</span></p>
                }
                <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='cross_icon' className='absolute top-5 right-5 cursor-pointer' />
            </motion.form>
        </div>
    )
}

export default memo(Login)