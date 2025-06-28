'use client'
import { privateNavLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const PrivateNavbar = () => {
    const pathname = usePathname();
  return (
    <nav className='flex items-center justify-between fixed z-50 w-full h-28
     px-10 bg-gray-300 gap-4 shadow-2xl'>
        

        <Link
        href="/login"
        className="flex items-center gap-1 hover:scale-150 duration-500"
      >
        <Image
          src="/assets/logo.svg"
          width={60}
          height={60}
          alt="calendra logo"
        />
      </Link>


      {/* NAV LINKS */}

      <section className='sticky top-0 flex justify-between text-black'>
        <div className='flex flex-1 max-sm:gap-0 sm:gap-6'>
        {
            privateNavLinks.map((link) => {
                const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
              return  ( 
              <Link
                href={link.route}

                key={link.label}
                className={cn('flex gap-4 items-center p-4 rounded-lg justify-start hover:scale-150 duration-300', isActive && 'bg-blue-100 rounded-3xl')}
              >
                <Image src={link.imgURL} alt={link.label} width={30} height={30} />
                <p className={cn('text-lg font-semibold max-lg:hidden')}>{link.label}</p>
                {/* {link.name} */}
              </Link>
            )})
        }
        </div>

      </section>

      {/* user button */}

      <div>
        <SignedIn>
            <UserButton />
            </SignedIn>
      </div>

    

    </nav>
  )
}

export default PrivateNavbar