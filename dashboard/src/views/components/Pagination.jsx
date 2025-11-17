import React from 'react';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const Pagination = ({ pageNumber, setPageNumber, totalItem, perPage, showItem }) => {
    let totalPage = Math.ceil(totalItem / perPage);
    let startPage = pageNumber
    let dif = totalPage - pageNumber;
    // 假設 totalPage=2, showItem=3
    // pageNumber=2, dif=0, startPage=-1
    // 假設 totalPage=10, showItem=3
    // pageNumber=9, dif=1, startPage=7
    if(dif <= showItem){
        startPage = totalPage - showItem + 1;
    }
    //
    let endPage = startPage < 0 ? showItem : showItem + startPage;

    if(startPage <= 0){
        startPage = 1;
    }

    const createBton = () => {
        const btns = [];
        for(let i = startPage; i < endPage; i++){
            btns.push(
                <li onClick={() => setPageNumber(i)} key={i} className={`${pageNumber === i ? 'bg-indigo-300 shadow-lg shadow-indigo-300/50 text-white': 'bg-slate-600 hover:bg-indigo-400 shadow-lg hover:shadow-indigo-500/50 hover:text-white text-[#d0d2d6]'} 
                w-[33px] h-[33px] rounded-full flex justify-center items-center cursor-pointer`}>
                    {i}
                </li>
            )
        }
        return btns;
    }

    return (
        <ul className='flex gap-3'>
            {
                pageNumber > 1 && <li onClick={()=>setPageNumber(pageNumber-1)} className='w-[33px] rounded-full flex justify-center items-center bg-slate-300 text-[#000000] cursor-pointer'>
                    <MdOutlineKeyboardDoubleArrowLeft />
                </li>
            }
            {
                createBton()
            }
            {
                pageNumber < totalPage && <li onClick={()=>setPageNumber(pageNumber+1)} className='w-[33px] rounded-full flex justify-center items-center bg-slate-300 text-[#000000] cursor-pointer'>
                    <MdOutlineKeyboardDoubleArrowRight />
                </li>
            }
        </ul>
    )
};

export default Pagination;
