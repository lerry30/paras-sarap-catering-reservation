'use client';
import { useEffect, useRef, useState } from 'react';
import { getData, sendJSON } from '@/utils/send';
import Loading from '@/components/Loading';

const ReservationList = () => {

    const [ loading, setLoading ] = useState(false);

    return <>
        { loading && <Loading customStyle="size-full" /> }
        <section className="flex flex-col p-4">

        </section>
    </>
}

export default ReservationList;
    