import React, { useState, useContext, memo } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const { backendUrl, setToken, setUser } = useContext(AppContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        toast.success('Registration successful!');
        navigate('/');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-120px)] mt-[-20px] mb-[-20px] px-4'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500 w-[90%] max-w-[400px]'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Sign Up</h1>
        <p className='text-sm text-center mb-5'>Create an account to continue</p>

        <div className='px-3 py-2 flex items-center gap-2 rounded-full mt-2'>
          <img width={30} src={assets.profile_icon} alt="user_icon" />
          <input onChange={e => setName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full Name' required />
        </div>

        <div className='px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
          <img src={assets.email_icon} alt="email_icon" />
          <input onChange={e => setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email id' required />
        </div>

        <div className='px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
          <img src={assets.lock_icon} alt="lock_icon" />
          <input onChange={e => setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='Password' required />
        </div>

        <button className='bg-blue-600 w-full text-white py-2 mt-6 rounded-full cursor-pointer'>Create Account</button>
        <p className='mt-5 text-center'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></p>
      </form>
    </div>
  );
};

export default memo(SignupPage);
