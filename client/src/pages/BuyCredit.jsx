import React, { memo, useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react" // framer motion import
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const BuyCredit = () => {

  const { user, backendUrl, loadCreditsData, token, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate();

  // const initpay = async (order) => {
  // const options = {
  //   key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key
  //   amount: order.amount, // Amount in paise
  //   currency: order.currency,
  //   name: 'Imagify', // Your company name
  //   description: 'Credits Payment',
  //   order_id: order.id, // Order ID created by Razorpay
  //   receipt: order.receipt, // Receipt ID
  //   handler: async (response) => {
  //     // console.log('Payment successful:', response);
  //     // try {
  //     //   const { data } = await axios.post(backendUrl + '/api/user/verify-razor', response, {
  //     //     headers: {
  //     //       'Authorization': `Bearer ${token}`, // Include the token in the request headers
  //     //       'Content-Type': 'application/json'
  //     //     }
  //     //   })
  //     //   if (data.success) {
  //     //     loadCreditsData(); // Reload user credits data
  //     //     toast.success('Credit Added'); // Notify user of successful payment
  //     //     navigate('/'); // Redirect to home page
  //     //   }
  //     //   else {
  //     //     throw new Error(data.message || 'Payment verification failed'); // Throw an error if verification fails
  //     //   }
  //     // }
  //     // catch (error) {
  //     //   toast.error('Payment verification failed'); // Notify user of payment verification failure
  //     // }
  //     try {
  //       const verificationData = {
  //         razorpay_order_id: response.razorpay_order_id,
  //         razorpay_payment_id: response.razorpay_payment_id,
  //         razorpay_signature: response.razorpay_signature
  //       };

  //       const { data } = await axios.post(
  //         `${backendUrl}/api/user/verify-razor`,
  //         verificationData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             'Content-Type': 'application/json'
  //           }
  //         }
  //       );

  //       if (data.success) {
  //         toast.success(`Payment successful! ${data.credits} credits added`);
  //         await loadCreditsData();
  //         navigate('/');
  //       } else {
  //         throw new Error(data.message || 'Verification failed');
  //       }
  //     } catch (error) {
  //       console.error('Verification error:', error);
  //       toast.error(error.response?.data?.message || 'Payment verification failed');
  //     }
  //   }
  // }
  const initpay = async (order) => {
  try {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'Imagify',
      description: `Purchase ${order.credits} credits`,
      order_id: order.id,
      receipt: order.receipt,

      config: {
        display: {
          preferences: {
            show_default_blocks: true,
            blocks: {
              upi: true,
              card: true,
              netbanking: true,
              wallet: true
            }
          }
        }
      },

      handler: async (response) => {
        try {
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            transactionId: order.receipt
          };

          const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/verify-razor`,
            verificationData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              timeout: 10000
            }
          );

          if (data.success) {
            toast.success(`Payment successful! ${data.credits} credits added`);
            await loadCreditsData();
            navigate('/');
          } else {
            throw new Error(data.message || 'Verification failed');
          }
        } catch (error) {
          console.error('Verification error:', error);
          toast.error(error.response?.data?.message || 'Payment verification failed');
        }
      },

      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error('Payment initialization error:', error);
    toast.error('Failed to initialize payment');
  }
};



  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true); // Show login modal if user is not logged in
        return toast.error('Please login to purchase credits'); // Notify user to login
      }

      const { data } = await axios.post(backendUrl + '/api/user/pay-razor', {
        planId,
        // token
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
          'Content-Type': 'application/json' // Set content type to JSON
        }
      })

      if (data.success) {
        initpay(data.order); // Initialize payment with the order details
      }
      else {
        throw new Error(data.message || 'Payment initialization failed'); // Throw an error if payment initialization fails
      }
    }
    catch (error) {
      console.error('Error processing payment:', error.message); // Log the error for debugging
      toast.error(error.response?.data?.message); // Notify the user of the error
    }
  }



  return (
    <motion.div className='min-h-[80vh] text-center pt-14 mb-10' initial={{ opacity: 0.2, y: 100 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0.1 }} viewport={{ once: true }}>
      <button className=' cursor-pointer border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {
          plans.map((item, index) => (
            <div key={index} className='bg-white drop-shadow-sm  rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
              <img width={40} src={assets.logo_icon} alt="logo_icon" />
              <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
              <p className='text-sm'>{item.desc}</p>
              <p className='mt-6'> <span className='text-3xl font-medium'> ${item.price} </span> / {item.credits} credits</p>
              <button onClick={() => paymentRazorpay(item.id)} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52 cursor-pointer'>{user ? 'Purchase' : 'Get Started'}</button>
            </div>
          ))
        }
      </div>
    </motion.div>
  )
}

export default memo(BuyCredit)