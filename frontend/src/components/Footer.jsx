import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='bg-[#f3f6fa]'>
            <div className='w-[85%] flex flex-wrap mx-auto border-b py-16 md-lg:pb-10 sm:pb-6'>
                <div className='w-3/12 lg:w-4/12 sm:w-full'>
                    <img className='w-[190px] h-[70px]' src="http://localhost:3000/images/logo.png" alt="" />
                    
                    <ul className='flex flex-col text-slate-600'>
                        <li>Address: Lorem ipsum dolor sit amet consectetur adipisicing.</li>
                        <li>Phone: 123-456-7890</li>
                        <li>Email: example@example.com</li>
                    </ul>

                </div>    
            
                <div className='w-5/12 lg:w-8/12 sm:w-full'>
                    <div className='flex justify-center sm:justify-start sm:mt-6 w-full'>
                        <div>
                            <h2 className='font-bold text-lg mb-2'>Usefull Links</h2>
                            <div className='flex justify-between gap-[80px] lg:gap-[40px]'>
                                <ul className='flex flex-col gap-2 text-slate-600 text-sm font-semibold'>
                                    <li>
                                        <Link to="/about">About Us</Link>
                                    </li>
                                    <li>
                                        <Link to="/shop">About Our Shop</Link>
                                    </li>
                                    <li>
                                        <Link to="/delivery-information">Deliver Information</Link>
                                    </li>
                                    <li>
                                        <Link to="/privacy-policy">Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link to="/blogs">Blogs</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='w-4/12 lg:w-full lg:mt-6'>
                    <div className='w-full flex flex-col justify-start gap-5'>
                        <h2 className='font-bold text-lg mb-2'>Join Our Shop</h2>
                        <span>Get Email updates about tour latest and shop specials offers</span>

                        <div className='h-[50px] w-full bg-white border relative'>
                            <input className='h-full bg-transparent w-full px-3 outline-0' type="text" placeholder='Enter your mail' />
                            <button className='h-full absolute right-0 bg-[#059473] text-white uppercase px-4 font-bold text-sm'>Subscribe</button>
                        </div>

                        <ul className='flex justify-start items-center gap-3'>
                            <li><a href="#" className='w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-white rounded-full'><FaFacebookF /></a></li>
                            <li><a href="#" className='w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-white rounded-full'><FaTwitter /></a></li>
                            <li><a href="#" className='w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-white rounded-full'><FaLinkedin /></a></li>
                            <li><a href="#" className='w-[38px] h-[38px] hover:bg-[#059473] hover:text-white flex justify-center items-center bg-white rounded-full'><FaGithub /></a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='w-[90%] flex flex-wrap justify-center items-center text-slate-600 mx-auto py-5 text-center'>
                <span>Copyright @2025 All Right Reserved</span>
            </div>
        </footer>
    );
};

export default Footer;