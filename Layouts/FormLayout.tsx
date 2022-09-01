import Image from 'next/image';
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode;
    pageName: string;
}

const FormLayout = ({ children, pageName }: Props) => {
    const BG_PIC = 'https://images.unsplash.com/photo-1644219037677-2703bc509933?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3000&q=80'

    // const [matches, setMatches] = useState<boolean>(false)

    // useEffect(() => {
    //     window
    //         .matchMedia("(max-width: 768px)")
    //         .addEventListener('change', e => setMatches(e.matches));
    // }, []);
    return (
        <div className='h-auto md:h-screen w-full flex flex-col md:flex-row'>
            <div className='relative h-screen w-1/2 bg-red-800' >
                {/* <Image priority objectFit='cover' objectPosition='center' layout='fill' className='bg-slate-500' src={BG_PIC} /> */}
            </div>
            <div className='md:h-screen w-1/2 md:flex md:items-center md:justify-center px-10 py-20 md:py-0 bg-white'>
                {children}
            </div>
        </div>
    )
}

export default FormLayout