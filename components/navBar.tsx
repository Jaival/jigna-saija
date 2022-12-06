import {useTheme} from "next-themes";
import Image from "next/image";
import Link from 'next/link';
import React, {useEffect, useState} from "react";

export default function NavBar() {
  const [navbar, setNavbar] = useState(false);
  const {theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
     <nav className="w-full">
       <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">

         <div className="flex items-center justify-between py-3 md:py-5 md:block">
           <Link href="/" className="flex items-center w-48">
             {
               theme == 'light' ?
                  <Image className={'w-64 flex-no-shrink fill-current'}
                         alt={'Jigna Saija'} width={320} height={320}
                         src={'/logos/jigna_saija_dark.png'}/>
                  :
                  <Image className={'w-64 flex-no-shrink fill-current'}
                         alt={'Jigna Saija'} width={320} height={320}
                         src={'/logos/jigna_saija_light.png'}/>
             }
           </Link>
           <div className="absolute right-10 md:hidden lg:hidden xl:hidden">
             <button onClick={() => setNavbar(!navbar)} className="relative group">
               <div
                  className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all ring-gray-300 hover:ring-2 ring-opacity-30 duration-200">
                 <div
                    className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                   {navbar ? (
                      <>
                        <div
                           className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left rotate-[42deg]"></div>
                        <div
                           className="bg-white h-[2px] w-1/2 rounded transform transition-all duration-300 -translate-x-10"></div>
                        <div
                           className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left -rotate-[42deg]"></div>
                      </>
                   ) : (
                      <>
                        <div
                           className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left "></div>
                        <div
                           className="bg-white h-[2px] w-1/2 rounded transform transition-all duration-300 "></div>
                        <div
                           className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left "></div>
                      </>
                   )}
                 </div>
               </div>
             </button>
           </div>
         </div>

         <div>
           <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? 'block' : 'hidden'
              }`}
           >
             <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
               <li>
                 <Link href="/projects" className="navbar-li">
                   Projects
                 </Link>
               </li>
               <li>
                 <Link href="/gallery" className="navbar-li">
                   Gallery
                 </Link>
               </li>
               <li>
                 <Link href="/contactMe" className="navbar-li">
                   Contact Me
                 </Link>
               </li>
               <button
                  aria-label="Toggle Dark Mode"
                  type="button"
                  className="w-10 h-10 p-3 rounded focus:outline-none"
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
               >
                 {mounted && (
                    <svg
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 24 24"
                       fill="currentColor"
                       stroke="currentColor"
                       className="w-4 h-4 text-yellow-light dark:text-orange-dark"
                    >
                      {theme === "dark" ? (
                         <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                         />
                      ) : (
                         <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                         />
                      )}
                    </svg>
                 )}
               </button>
             </ul>
           </div>
         </div>
       </div>
     </nav>
  );
}
