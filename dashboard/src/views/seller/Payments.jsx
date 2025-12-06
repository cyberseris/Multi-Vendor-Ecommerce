import React, { forwardRef, useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useDispatch } from 'react-redux';
import { MdCurrencyExchange, MdProductionQuantityLimits } from 'react-icons/md';
import { FaCartArrowDown, FaUsers } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { get_seller_payment_details, send_withdrawal_request, messageClear } from '../../store/Reducers/paymentReducer';
import toast from 'react-hot-toast';
import moment from 'moment/moment';

function handleOnWheel(e) {
  const { deltaY } = e;
  console.log('handleOnWheel', deltaY);
  // 需要阻止預設滾動時可視情況加入：
  // e.preventDefault();
}

const Scroller = forwardRef(function Scroller({ style, ...props }, ref) {
  return <div ref={ref} style={style} onWheel={handleOnWheel} {...props} />;
});

/* /payment/send-withdrawal-request */

const Payment = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state=>state.auth)
    const { successMessage, errorMessage, loader, totalAmount, pendingAmount, withdrawalAmount, availableAmount, pendingWithdrawals, successWithdrawals } = useSelector(state=>state.payment)

    useEffect(()=>{
        dispatch(get_seller_payment_details(userInfo._id));
    }, [userInfo._id])

    useEffect(()=>{
        if(successMessage){
            toast.success(successMessage);
            dispatch(messageClear())
        }
        if(errorMessage){
            toast.error(errorMessage);
            dispatch(messageClear())
        }   
    }, [successMessage, errorMessage])

    const [amount, setAmount] = useState(0)

    const sendRequest = (e) => {
        e.preventDefault();
        console.log('amount: ', amount);
        if(availableAmount-amount>=5){
            dispatch(send_withdrawal_request({ 
                amount, 
                sellerId: userInfo._id  
            }));
            setAmount(0);
        }else{
            toast.error('Available amount must be at least $5 after withdrawal.');
        }
    }

    const Row = (index) => {
        return (
        <div className="flex text-sm items-center min-w-600 text-white font-medium">
            <div className="w-[20%] p-2 whitespace-nowrap">{index + 1}</div>
            <div className="w-[20%] p-2 whitespace-nowrap">${pendingWithdrawals[index]?.amount}</div>
            <div className="w-[20%] p-2 whitespace-nowrap">
            <span className="py-[1px] px-[5px] bg-slate-300 text-blue-500 rounded-md text-sm">
                {pendingWithdrawals[index]?.status}
            </span>
            </div>
            <div className="w-[20%] p-2 whitespace-nowrap">{moment(pendingWithdrawals[index]?.createdAt).format('LL')}</div>
        </div>
        );
    };

    return (
        <div className="px-2 md:px-7 py-5">
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-5'>
                <div className='flex justify-between items-center p-5 bg-[#fae8e8] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-lg font-bold'>${totalAmount}</h2>
                        <span className='text-xs font-bold'>Total Sales</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#fa0305] flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-[#fae8e8]' />
                    </div>

                </div>
                
                <div className='flex justify-between items-center p-5 bg-[#fde2ff] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-lg font-bold'>${availableAmount}</h2>
                        <span className='text-xs font-bold'>Available Amount</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#750077] flex justify-center items-center text-xl'>
                        <MdProductionQuantityLimits className='text-[#fae8e8]' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-[#fae8e8] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-lg font-bold'>${withdrawalAmount}</h2>
                        <span className='text-xs font-bold'>WithDrawl Amount</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#fa0305] flex justify-center items-center text-xl'>
                        <FaUsers className='text-[#fae8e8]' />
                    </div>

                </div>

                <div className='flex justify-between items-center p-5 bg-[#fae8e8] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-lg font-bold'>${pendingAmount}</h2>
                        <span className='text-xs font-bold'>Pending Amount</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#fa0305] flex justify-center items-center text-xl'>
                        <FaCartArrowDown className='text-[#fae8e8]' />
                    </div>

                </div>

            </div>


            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 pb-4'>
                <div className='bg-[#6a5fdf] text-[#d0d2d6] rounded-md p-5'>
                    <h2 className='text-lg'>Send Request</h2>
                    <div className='pt-5 mb-5'>
                        <form onSubmit={sendRequest}>
                            <div className='flex gap-3 flex-wrap'>
                                <input onChange={(e)=>setAmount(e.target.value)} value={amount} min='0' type="number" className='px-3 py-2 md:w-[72%] focus:border-indigo-500 outline-none bg-[#6a5fdf] rounded-md text-[#d0d2d6] border border-slate-700'
                                name='amount'  />
                                <button disabled={loader} className='bg-red-500 hover:shadow-red-500/40 hovwer:shadow-md text-white rounded-md px-7 py-2'>{loader?'loading..':'Submit'}</button>

                            </div>
                        </form>
                    </div>

                    <div>
                        <h2 className='text-lg pb-4 mt-5'>Pending Request</h2>
                        <div className="w-full overflow-x-auto">
                            <div className="flex bg-[#a7a3de] uppercase text-xs font-bold min-w-500 rounded-md">
                            <div className="w-[25%] p-2">No</div>
                            <div className="w-[25%] p-2">Amount</div>
                            <div className="w-[25%] p-2">Status</div>
                            <div className="w-[25%] p-2">Date</div>
                            </div>
                            {/* 列表內容 */}
                            <Virtuoso
                            style={{ height: 350, minWidth: 500 }}
                            totalCount={pendingWithdrawals.length}
                            itemContent={(index) => Row(index)}
                            components={{ Scroller }}
                            />
                        </div>
                    </div>
                </div>


                <div className='bg-[#6a5fdf] text-[#d0d2d6] rounded-md p-5'>
                    <div>
                        <h2 className='text-lg pb-4'>Success WithDrawal</h2>
                        <div className="w-full overflow-x-auto">
                            <div className="flex bg-[#a7a3de] uppercase text-xs font-bold min-w-500 rounded-md">
                            <div className="w-[25%] p-2">No</div>
                            <div className="w-[25%] p-2">Amount</div>
                            <div className="w-[25%] p-2">Status</div>
                            <div className="w-[25%] p-2">Date</div>
                            </div>
                            {/* 列表內容 */}
                            <Virtuoso
                            style={{ height: 350, minWidth: 500 }}
                            totalCount={successWithdrawals.length}
                            itemContent={(index) => Row(index)}
                            components={{ Scroller }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Payment;