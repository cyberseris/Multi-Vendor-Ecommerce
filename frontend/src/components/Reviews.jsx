import React, { useState, useEffect } from 'react';
import Rating from './Rating';
import RatingTemp from './RatingTemp';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import RatingReact from 'react-rating';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { CiStar } from 'react-icons/ci';
import { useSelector, useDispatch } from 'react-redux';
import { customer_review, get_reviews, product_details, messageClear } from '../store/reducers/homeReducer';
import { toast } from 'react-hot-toast';

const Reviews = ({product}) => {
    const dispatch = useDispatch();
    const [perPage, setPerPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [rat, setRat] = useState('');
    const [re, setRe] = useState('')
    const { userInfo } = useSelector(state => state.auth)
    const { reviews, rating_review, totalReview,successMessage, errorMessage } = useSelector(state => state.home)


    useEffect(()=>{
        if(product._id){
            dispatch(get_reviews({productId: product._id, pageNumber}))
        }
    }, [product, pageNumber])


    const review_submit = (e) => {
        e.preventDefault();
        if(userInfo){
            const obj = {
                name: userInfo.name,
                review: re,
                rating: rat,
                productId: product._id
            }
            dispatch(customer_review(obj))
        }
    }

    useEffect(()=>{
        if(successMessage){
            toast.success(successMessage)
            setRat('')
            setRe('')
            dispatch(get_reviews({productId: product._id, pageNumber}))
            dispatch(product_details(product.slug))
            dispatch(messageClear())
        }
        if(errorMessage){
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])

    return (
        <div className='mt-8'>
            <div className='flex gap-10 mg-lg:flex-col'>
                <div className='flex flex-col gap-2 justify-start items-start py-4'>
                    <div>
                        <span className='text-6xl font-semibold'>{product.rating}</span>
                        <span className='text-3xl font-semibold text-slate-500'>/5</span>
                    </div>
                    <div className='flex text-3xl'>
                        <Rating ratings={product.rating} />
                    </div>
                    <p className='text-sm text-slate-600'>({totalReview}) Reviews</p>

                    
                </div>

                <div className='flex flex-col gap-2 py-4'>
                    {
                        rating_review.map((r,i) =>
                            <div key={i} className='flex justify-start items-center gap-5'>
                                <div className='text-md flex gap-1 w-[93px]'>
                                    <RatingTemp rating={r.rating} />
                                </div>
                                <div className='w-[200px] h-[14px] bg-slate-200 relative'>
                                    <div style={{width: `${Math.floor((( 100 * r?.sum || 0)) / totalReview)}%`}} className='h-full bg-[#Edbb0E] w-[60%]'></div>
                                </div>
                                <p className='text-sm text-slate-600 w-[0%]'>{r.sum}</p>
                            </div>)
                    }
                </div>
            </div>
            

            <h2 className='text-slate-600 text-xl font-bold py-5'>Product Review ({totalReview})</h2>
            <div className='flex flex-col gap-8 pb-10 pt-4'>
                {
                    reviews.map((r,i)=> <div key={i} className='flex flex-col gap-1'>
                        <div className='flex justify-between items-center'>
                            <div className='flex  gap-1 text-xl'>
                                <RatingTemp rating={r.rating} />
                            </div>
                            <span className='text-slate-600'>{r.date}</span>
                        </div>

                        <span className='text-slate-600 text-md'>{r.name}</span>
                        <p className='text-slate-600 text-sm'>{r.review}</p>  
                    </div>
                    )
                }

                <div className='flex justify-end'>
                    {
                        totalReview > 5 && <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalItem={totalReview} perPage={perPage} showItem={Math.floor(totalReview/3)} />
                    }
                </div>

            </div>


            <div>
                {
                    userInfo ? <div className='flex flex-col gap-3'>
                        <div className='flex gap-1'>
                            <RatingReact 
                                onChange={(e)=>setRat(e)}
                                initialRating={rat}
                                emptySymbol={<span className='text-slate-600 text-4xl'><CiStar /></span>}
                                fullSymbol={<span className='text-[#Edbb0E] text-4xl'><FaStar /></span>}
                            />
                        </div>
                        <form onSubmit={review_submit}> 
                            <textarea value={re} onChange={(e)=>setRe(e.target.value)} required className='border outline-0 p-3 w-full' name="" id="" cols="30" rows="5">                    
                            </textarea>
                            <div className='mt-2'>
                                <button className='py-1 px-5 bg-indigo-500 text-white rounded-sm'>Submit </button>
                            </div>
                        </form>

                    </div>: <div>
                        <Link to='/login' className='py-1 px-5 bg-red-500 text-white rounded-sm'>Login First</Link>
                    </div>
                }
            </div>


        </div>
    );
};

export default Reviews;