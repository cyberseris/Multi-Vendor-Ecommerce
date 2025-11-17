import React from 'react';
import { Virtuoso } from 'react-virtuoso';

function handleOnWheel(e) {
  const { deltaY } = e;
  console.log('handleOnWheel', deltaY);
  // 需要阻止預設滾動時可視情況加入：
  // e.preventDefault();
}

const Scroller = React.forwardRef(function Scroller({ style, ...props }, ref) {
  return <div ref={ref} style={style} onWheel={handleOnWheel} {...props} />;
});

const PaymentRequest = () => {
  const Row = (index) => {
    return (
      <div className="flex text-sm items-center min-w-[600px] text-white font-medium">
        <div className="w-[20%] p-2 whitespace-nowrap">{index + 1}</div>
        <div className="w-[20%] p-2 whitespace-nowrap">$3434</div>
        <div className="w-[20%] p-2 whitespace-nowrap">
          <span className="py-[1px] px-[5px] bg-slate-300 text-blue-500 rounded-md text-sm">
            Pending
          </span>
        </div>
        <div className="w-[20%] p-2 whitespace-nowrap">25 Dec 2023</div>
        <div className="w-[20%] p-2 whitespace-nowrap">
          <button className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-3 py-[2px] cursor-pointer text-white rounded-sm text-sm">
            Confirm
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <h2 className="text-xl font-medium pb-5 text-[#d0d2d6]">Withdrawal Requests</h2>

        <div className="w-full overflow-x-auto">
          {/* 表頭 */}
          <div className="flex bg-[#a7a3de] uppercase text-xs font-bold min-w-[600px] rounded-md">
            <div className="w-[20%] p-2">No</div>
            <div className="w-[20%] p-2">Amount</div>
            <div className="w-[20%] p-2">Status</div>
            <div className="w-[20%] p-2">Date</div>
            <div className="w-[20%] p-2">Action</div>
          </div>

          {/* 清單：把 Scroller 覆寫掉，攔 onWheel */}
          <Virtuoso
            style={{ height: 350, minWidth: 600 }}
            totalCount={100}
            itemContent={(index) => Row(index)}
            components={{ Scroller }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;
