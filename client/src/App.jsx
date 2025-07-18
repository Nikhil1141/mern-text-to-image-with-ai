import React, { memo, useContext } from 'react'
import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard'

const App = () => {

  const {showLogin} = useContext(AppContext);

  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <ToastContainer position='bottom-right' />
      <Navbar/>
      {showLogin && <Login/>}
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/result" element={<Result/>} />
          <Route path="/buy" element={<BuyCredit/>} />
          <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer/>
    </div> 
  )
}

export default memo(App)