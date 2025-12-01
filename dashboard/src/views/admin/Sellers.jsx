import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import { FaEye } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { get_active_sellers } from '../../store/Reducers/sellerReducer'

const Sellers = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [perPage, setPerPage] = useState(5);
    const state = true
    const [show, setShow] = useState(false);
    const { active_sellers, totalSeller } = useSelector(state => state.seller)

    useEffect(()=>{
        const obj = {
            perPage: parseInt(perPage),
            page: parseInt(currentPage),
            searchValue: searchValue
        }
        dispatch(get_active_sellers(obj))
    }, [searchValue, currentPage, perPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>

                <div className='flex justify-between items-center'>
                    <select onChange={(e) => setPerPage(parseInt(e.target.value)) } className='px-4 py-2 hover:border-indigo-500 outline-none bg-[#6a5fdf]  border border-slate-700 rounded-md text-[#d0d2d6]'>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                    <input value={searchValue} onChange={(e)=> setSearchValue(e.target.value)} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] rounded-md text-[#d0d2d6] border border-slate-700' type="text" placeholder='search' />
                </div>

                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-[#d0d2d6]'>
                        <thead  className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Image</th>
                                <th scope='col' className='py-3 px-4'>Name</th>
                                <th scope='col' className='py-3 px-4'>Shop Name</th>
                                <th scope='col' className='py-3 px-4'>Status</th>
                                <th scope='col' className='py-3 px-4'>Payment Status</th>
                                <th scope='col' className='py-3 px-4'>Email</th>
                                <th scope='col' className='py-3 px-4'>Division</th>
                                <th scope='col' className='py-3 px-4'>District</th>
                                <th scope='col' className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                active_sellers.map((s, i)=> <tr key={i}>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>{i+1}</td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap flex justify-center items-center'>
                                    <img className='w-[45px] h-[45px]' src={ s?.image } alt="" />
                                </td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>{ s.name }</td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>{ s?.shopInfo?.shopName }</td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>{ s.status }</td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>{ s.payment }</td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>{ s.email }</td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>{ s.shopInfo?.division }</td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>{ s?.shopInfo?.sub_district }</td>
                                <td className='py-3 px-4 text-center font-medium whitespace-nowrap'>
                                    <div className='flex justify-center items-center gap-4'>
                                        <Link to={`/admin/dashboard/seller/details/${s._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                                    </div>
                                </td>
                            </tr>)
                            }

                        </tbody>
                    </table>
                </div>

                {
                    totalSeller <= perPage ? <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    <Pagination 
                        pageNumber = {currentPage} 
                        setPageNumber = {setCurrentPage}
                        totalItem = {totalSeller}
                        perPage = {perPage}
                        showItem = {4}
                    />
                </div> : <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    <Pagination 
                        pageNumber = {currentPage} 
                        setPageNumber = {setCurrentPage}
                        totalItem = {totalSeller}
                        perPage = {perPage}
                        showItem = {4}
                    />
                </div>
                }

                   


            </div>
        </div>
    );
};

export default Sellers;