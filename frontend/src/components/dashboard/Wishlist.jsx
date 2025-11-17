import React, {useEffect} from 'react';  
import { FaEye, FaHeart, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_cart, get_wishlist, add_to_wishlist, remove_wishlist, messageClear } from '../../store/reducers/cartReducer';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const  { userInfo } = useSelector(state=>state.auth)
    const  { wishlist, successMessage, errorMessage } = useSelector(state=>state.cart)

    useEffect(()=>{
        dispatch(get_wishlist(userInfo.id))
    },[])

    useEffect(()=>{
        if(successMessage){
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if(errorMessage){
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])

    const add_cart = (id) => {
        if(userInfo){
            dispatch(add_to_cart({
                userId: userInfo.id,
                quantity: 1,
                productId: id
            }))
        }else{
           navigate('/login') 
        }   
    }

    const remove_from_wishlist = async (productId) => {
        const res = await dispatch(remove_wishlist(productId))

        if(remove_wishlist.fulfilled.match(res)){
            await dispatch(get_wishlist(userInfo.id))
        }  
    }

    return (
        <div className='w-full grid grid-cols-4 mg-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6'>
            {
                wishlist.map((p, i)=><div key={i} className='border group transition-all duration-500 hover:shadow-md hover:-mt-3 bg-white'>
                    <div className='relative overflow-hidden'>

                        {
                            p.discount?<div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>-${p.discount}</div>:''
                        }

                        <img className='sm:w-full w-full h-[240px]' src={p.images} alt="" />

                        <ul className='flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3'>
                            <li onClick={()=>remove_from_wishlist(p._id)} className='w-[38px] h-[38px] cursor-pointer bg-white text-green-500 flex justify-center items-center rounded-full hover:bg-[#059473] hover:text-white hover:rotate-[720deg] transition-all'>
                                <FaHeart />
                            </li>
                            <Link to={`/product/details/${p.slug}`} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#059473] hover:text-white hover:rotate-[720deg] transition-all'>
                                <FaEye />
                            </Link>
                            <li onClick={()=>add_cart(p._id)} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#059473] hover:text-white hover:rotate-[720deg] transition-all'>
                                <RiShoppingCartLine />
                            </li>
                        </ul>
                    </div>

                    <div className='py-3 text-slate-600 px-2'>
                        <h2 className='font-bold'>{p.name}</h2>
                        <div className='flex jusitfy-start items-center gap-3'>
                            <span className='text-md font-semibold'>${p.price}</span>
                            <div className='flex'>
                                <Rating ratings={p.rating} />
                            </div>
                        </div>
                    </div>

                </div>)
            }
        </div>
    );
};

export default Wishlist;