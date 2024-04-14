'use client';
// import Loading from '@/components/Loading';
// import { zAdmin } from '@/stores/admin';
// import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Admin = () => {
    // const [ display, setDisplay ] = useState([]);
    // const searchParams = useSearchParams();

    const router = useRouter();
    
    // const start = () => {
    //     const param = searchParams?.get('display') || 'dashboard';
    //     const views = zAdmin.getState().slots;
    //     setDisplay(views[param]);
    // }

    useEffect(() => {
        router.push('/admin?display=dashboard');
    });

    return (
        // <Suspense fallback={ <Loading customStyle="size-full" /> }>
        //     <section>
        //         { display }
        //     </section>
        // </Suspense>
        <section></section>
    );
}

export default Admin;