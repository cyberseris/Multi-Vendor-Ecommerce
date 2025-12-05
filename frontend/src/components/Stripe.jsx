import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios'
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)


const Stripe = ({orderId, price}) => {
    console.log("stripePromise: ", stripePromise)
    const [clientSecret, setClientSecret] = useState('')
    const appearance = {
        theme: 'stripe'
    }

    const options = {
        appearance,
        clientSecret 
    }

    const create_payment = async() => {
        try{
            const { data } = await axios.post('http://localhost:5000/api/order/create-payment', {price}, {withCredentials: true}) 

            setClientSecret(data.clientSecret)
        }catch(error){  
            console.log("Error creating payment: ", error.response.data)
        }
    }

    return (
        <div className='mt-4'>
            {
                clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm orderId={orderId} />
                    </Elements>
                ) : <button onClick={create_payment} className='px-10 py-[6px] rounded-sm bg-green-700 hover:shadow-green-700/30 hover:shadow-lg text-white'>Start Payment</button>
            }
        </div>
    );
};

export default Stripe;