const Search = ({setPerPage, setSearchValue, searchValue}) => {
    return (
        <div className='flex justify-between items-center'>
            <select onChange={(e) => setPerPage(parseInt(e.target.value)) } className='px-4 py-2 hover:border-indigo-500 outline-none bg-[#6a5fdf]  border border-slate-700 rounded-md text-[#d0d2d6]'>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
            </select>
            <input onChange={(e)=>setSearchValue(e.target.value)} value={searchValue} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] rounded-md text-[#d0d2d6] border border-slate-700' type="text" placeholder='search' />
        </div>
    );
};

export default Search;