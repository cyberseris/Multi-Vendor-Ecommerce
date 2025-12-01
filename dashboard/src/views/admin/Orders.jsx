import React, { useState, useEffect } from 'react';
import { BsArrowDownSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import { useSelector, useDispatch } from 'react-redux'
import { get_admin_orders } from '../../store/Reducers/orderReducer'

const Orders = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [perPage, setPerPage] = useState(5);
    const state = true
    const [show, setShow] = useState(false);
    const { myOrders, totalOrder } = useSelector(state => state.order)

    useEffect(()=>{
        const obj = {
            page: parseInt(currentPage),
            perPage: parseInt(perPage),
            searchValue: searchValue
        }
        dispatch(get_admin_orders(obj))
    },[currentPage, perPage, searchValue])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center'>
                    <select onChange={(e) => setPerPage(parseInt(e.target.value)) } className='px-4 py-2 hover:border-indigo-500 outline-none bg-[#6a5fdf]  border border-slate-700 rounded-md text-[#d0d2d6]'>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>

                    <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] rounded-md text-[#d0d2d6] border border-slate-700' type="text" placeholder='search' />
                </div>

                <div className='relative mt-5 overflow-x-auto'>
                    <div className='w-full text-sm text-left text-[#d0d2d6]'>
                        <div className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <div className='flex justify-between items-center'>
                                <div className='py-3 w-[25%] font-bold'>Order id</div>
                                <div className='py-3 w-[13%] font-bold'>Price</div>
                                <div className='py-3 w-[18%] font-bold'>Payment</div>
                                <div className='py-3 w-[18%] font-bold'>Order Status</div>
                                <div className='py-3 w-[18%] font-bold'>Actions</div>
                                <div className='py-3 w-[8%] font-bold'><BsArrowDownSquare /></div>
                            </div>
                        </div>
                        {
                            myOrders.map((o, i)=> <div key={i} className='text-[#d0d2d6]'>
                            <div className='flex justify-between items-start border-b border-slate-700'>
                                <div className='py-3 w-[25%] font-medium whitespace-nowrap pl-3'>#{o._id}</div>
                                <div className='py-3 w-[13%] font-medium'>${o.price}</div>
                                <div className='py-3 w-[18%] font-medium'>{o.payment_status}</div>
                                <div className='py-3 w-[18%] font-medium'>{o.delivery_status}</div>
                                <div className='py-3 w-[18%] font-medium'>
                                    <Link to={`/admin/dashboard/order/details/${o._id}`}>View</Link>
                                </div>
                                <div onClick={(e)=>{setShow(o._id)}} className='py-3 w-[8%] font-medium whitespace-nowrap'><BsArrowDownSquare /></div>
                            </div>

                            { 
                                 o.suborder && o.suborder.map((sub_o,i) => <div className={show === o._id ? 'block border-b border-slate-700 bg-[#8288ed]':'hidden'}>
                                <div className='flex justify-start items-start border-b border-slate-700'>
                                    <div className='py-3 w-[25%] font-medium whitespace-nowrap pl-3'>#{sub_o._id}</div>
                                    <div className='py-3 w-[13%] font-medium'>${sub_o.price}</div>
                                    <div className='py-3 w-[18%] font-medium'>{sub_o.payment_status}</div>
                                    <div className='py-3 w-[18%] font-medium'>{sub_o.delivery_status}</div>
                                </div>
                            </div>)
                               
                            }
                            
                            </div>)
                        }  
                    </div>
                </div>

                {
                    totalOrder <= perPage ? "": <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    <Pagination 
                        pageNumber = {currentPage} 
                        setPageNumber = {setCurrentPage}
                        totalItem = {totalOrder}
                        perPage = {perPage}
                        showItem = {3}
                    />
                </div>
                }
            </div>
        </div>
    );
};

export default Orders;