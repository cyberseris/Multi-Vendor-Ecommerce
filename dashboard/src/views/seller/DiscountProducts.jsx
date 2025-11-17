import React, {useState} from 'react';
import Search from '../components/Search';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import Category from './../admin/Category';

const DiscountProducts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [perPage, setPerPage] = useState(5);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Discount Products</h1>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <Search setPerPage={setPerPage} setSearchValue={setSearchValue} searchValue={searchValue} />

                <div className='relative overflow-x-auto mt-5'>
                    <table className='w-full text-sm text-[#d0d2d6]'>
                        <thead  className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Image</th>
                                <th scope='col' className='py-3 px-4'>Name</th>
                                <th scope='col' className='py-3 px-4'>Category</th>
                                <th scope='col' className='py-3 px-4'>Brand</th>
                                <th scope='col' className='py-3 px-4'>Price</th>
                                <th scope='col' className='py-3 px-4'>Discount</th>
                                <th scope='col' className='py-3 px-4'>Stock</th>
                                <th scope='col' className='py-3 px-4'>Active</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                [1,2,3,4,5].map((d, i)=> <tr key={i}>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>{d}</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap flex justify-center items-center'>
                                    <img className='w-[45px] h-[45px]' src={`http://localhost:3000/images/category/${d}.jpg`} alt="" />
                                </td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>Men Full Sleeve</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>Tshirt</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>Veirdo</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>$232</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>10%</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>20</td>


                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>
                                    <div className='flex justify-center items-center gap-4'>
                                        <Link className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                        <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                                        <Link className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'><FaTrash /></Link>
                                    </div>
                                </td>
                            </tr>)
                            }


                            
                        </tbody>



                    </table>
                </div>

                <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    <Pagination 
                        pageNumber = {currentPage} 
                        setPageNumber = {setCurrentPage}
                        totalItem = {50}
                        perPage = {perPage}
                        showItem = {3}
                    />
                </div>
            </div>
        </div>
    );
};

export default DiscountProducts;