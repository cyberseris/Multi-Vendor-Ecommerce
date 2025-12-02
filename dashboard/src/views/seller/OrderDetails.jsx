import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { get_seller_order, seller_order_status_update, messageClear } from '../../store/Reducers/orderReducer'
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const dispatch = useDispatch()
    const { orderId } = useParams()
    const { sellerOrder, successMessage, errorMessage } = useSelector(state => state.order)
    const [ status, setStatus ] = useState('')

    useEffect(()=>{
        if(orderId){
            dispatch(get_seller_order(orderId))
        }
    }, [orderId])

    useEffect(()=>{
        if(sellerOrder){
            setStatus(sellerOrder?.delivery_status)
        }
    }, [sellerOrder])

    const update_status = (e) => {
        dispatch(seller_order_status_update({orderId, info: {status: e.target.value}}))
        setStatus(e.target.value)
    }

    useEffect(() => {
        if(successMessage){
            toast.success(successMessage)
            dispatch(messageClear())
        }

        if(errorMessage){
            toast.error(errorMessage)
            dispatch(messageClear())
        }

    }, [successMessage, errorMessage]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center p-4'>
                    <h2 className='text-xl text-[#d0d2d6]'>Order Details</h2>
                    <select value={status} onChange={ update_status } className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#475569] border border-slate-700 rounded-md text-[#d0d2d6]' name="" id="">
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="warehouse">warehouse</option>
                        <option value="placed">placed</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div>

                <div className='p-4'>
                    <div className='flex gap-2 text-lg text-[#d0d2d6]'>
                        <h2>#{sellerOrder._id}</h2>
                        <span>{sellerOrder.date}</span>
                    </div>
                    
                    <div className='flex flex-wrap'>
                        <div className='w-[30%]'> 
                            <div className='pr-3 text-[#d0d2d6] text-lg'>
                                <div className='flex flex-col  gap-1'>
                                    <h2>Deliver To: {sellerOrder.name} </h2>
                                    <p>
                                        <span className='text-sm'>
                                            {sellerOrder.shippingInfo}
                                        </span>
                                    </p>
                                </div>

                                <div className='flex justify-start items-center gap-3'>
                                    <h2>{sellerOrder.delivery_status}</h2>
                                    <span className='text-base'>{sellerOrder.payment_status}</span>
                                </div>

                                <span>Price: ${sellerOrder.price}</span>
                                <div className='mt-4 flex flex-col gap-4 bg-[#8288ed] rounded-md'>
                                    <div className='text-[#d0d2d6]'>
                                        {
                                            sellerOrder && sellerOrder.products?.map((p,i)=><div key={i} className='flex gap-3 text-md'>
                                            <img className='w-[50px] h-[50px] rounded-full' src={p.images[0]} alt="" />
                                            <div>
                                                <h2>{p.name}</h2>
                                                <p>
                                                    <span>Brand: </span>
                                                    <span>{p.brand} </span>
                                                    <span className='text-lg'>Quantity: {p.quantity}</span>
                                                </p>
                                            </div>
                                        </div>)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;