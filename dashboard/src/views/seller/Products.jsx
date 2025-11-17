import React, {useState, useEffect} from 'react';
import Search from '../components/Search';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productReducer';

const Products = () => {
    const dispatch = useDispatch();
    const { products, totalProduct } = useSelector(state => state.product)

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [perPage, setPerPage] = useState(5);

    useEffect(()=>{
        const obj = {
            perPage: parseInt(perPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_products(obj))
        
    }, [searchValue, currentPage, perPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>All Products</h1>
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
                                products.map((d, i)=> <tr key={i}>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>{i+1}</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap flex justify-center items-center'>
                                    <img className='w-[45px] h-[45px]' src={d.images[0]} alt="" />
                                </td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>{d?.name?.slice(0,15)}...</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>{d.category}</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>{d.brand}</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>${d.price}</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>{
                                    d.discount === 0? <span>No Discount</span>: <span>${d.discount}元</span>
                                }</td>
                                <td className='py-1 px-4 text-center font-medium whitespace-nowrap'>{d.stock}</td>


                                <td className='py-2 px-4 text-center font-medium whitespace-nowrap'>
                                    <div className='flex justify-center items-center gap-4'>
                                        <Link to={`/seller/dashboard/edit-product/${d._id}`} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                        <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                                        <Link className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'><FaTrash /></Link>
                                    </div>
                                </td>
                            </tr>)
                            }


                            
                        </tbody>
                    </table>
                </div>

                {
                    totalProduct <= perPage ? "" : <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    <Pagination 
                        pageNumber = {currentPage} 
                        setPageNumber = {setCurrentPage}
                        totalItem = {50}
                        perPage = {perPage}
                        showItem = {3}
                    />
                </div>

                }
                
            </div>
        </div>
    );
};

export default Products;