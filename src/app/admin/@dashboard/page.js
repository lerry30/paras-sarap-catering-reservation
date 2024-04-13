'use client';
import Loading from '@/components/Loading';
import { useState } from 'react';

const Dashboard = () => {
    const [ loading, setLoading ] = useState(false);

    return (
        <section className="w-full h-[calc(100vh-var(--nav-height))] flex justify-center gap-2 p-4">
            { loading && <Loading customStyle="size-full" /> }
            <h2 className="font-bold text-4xl text-neutral-400">Dashboard</h2>
        </section>
    );
}

export default Dashboard;