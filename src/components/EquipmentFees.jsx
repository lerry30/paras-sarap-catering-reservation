import Chair from '../../public/chair.png';
import Table from '../../public/table.png';
import Tent from '../../public/tent.png';

import Image from 'next/image';

import { useState, useLayoutEffect } from 'react';
import { getData } from '@/utils/send';
import { toNumber } from '@/utils/number';

const EquipmentFees = () => {
    const [ fee, setFee ] = useState(0);
    const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

    const getEquipmentCost = async () => {
        try {
            const response = await getData('/api/policies/reservation');
            const cost = toNumber(response?.data?.rentalEquipmentFees);
            setFee(cost);
        } catch(error) {}
    }

    useLayoutEffect(() => {
        getEquipmentCost();
    }, []);

    return (
        <>
            <h3 className="font-headings w-full text-lg font-semibold pb-4">Rental Equipment Fees</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-600/75 p-8 rounded-lg flex flex-col sm:flex-row justify-between col-span-2 md:col-span-1">
                    <Image 
                        src={ Chair }
                        alt={ 'chair' }                                    
                        sizes='100%'
                        style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'contain',
                            transformOrigin: 'center',
                        }}
                        priority
                    />
                    <h3 className="font-headings text-xl font-semibold pt-4">Chair</h3>
                </div>
                <div className="bg-teal-600/75 p-8 rounded-lg flex flex-col sm:flex-row justify-between col-span-2 md:col-span-1">
                    <Image 
                        src={ Tent }
                        alt={ 'tent' }                                    
                        sizes='100%'
                        style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'contain',
                            transformOrigin: 'center',
                        }}
                        priority
                    />
                    <h3 className="font-headings text-xl font-semibold pt-4">Tent</h3>
                </div>
                <div className="bg-teal-600/75 p-8 rounded-lg flex flex-col md:flex-row col-span-2">
                    <Image 
                        src={ Table }
                        alt={ 'table' }                                    
                        sizes='100%'
                        style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'contain',
                            transformOrigin: 'center',
                        }}
                        priority
                    />
                    <article className="md:ml-12 pt-4">
                        <h3 className="font-headings text-xl font-semibold">Table</h3>
                        <p className="font-paragraphs font-thin text-2xl antialiased">
                            The total cost for tables, chairs, and tents is <span className="font-normal">{pesoFormatter.format(fee)}</span> per guest.
                        </p>
                    </article>
                </div>
            </div>
        </>
    );
}

export default EquipmentFees;
