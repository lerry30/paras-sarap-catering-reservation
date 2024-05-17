'use client';
import { useEffect, useState } from 'react';
import { deleteWithJSON, getData, sendForm, sendFormUpdate } from '@/utils/send';
import { Prompt, PromptTextBox } from '@/components/Modal';
import Card from '@/components/admin/reservations/Card';
import Loading from '@/components/Loading';

const ReservationList = () => {
    const [ reservations, setReservations ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ displayStatus, setDisplayStatus ] = useState('pending');

    const [ approvePrompt, setApprovePrompt ] = useState(false);
    const [ rejectPrompt, setRejectPrompt ] = useState(false);
	const [ reasonForRejection, setReasonForRejection ] = useState(false);

    const [ formData, setFormData ] = useState({ id: '', status: '' });

    const changeReservationStatus = (id, status) => {
        setFormData({ id, status });
        setApprovePrompt(status === 'approved');
        setRejectPrompt(status === 'rejected');
    }

    const confirmChanges = async () => {
        setLoading(true);
        try {
            const { id, status } = formData;
            const form = new FormData();
            form.append('id', id);
            form.append('status', status);
            const response = await sendFormUpdate('/api/reservations/reservation', form);
            await getResList();
            setDisplayStatus(status);

            if(status === 'rejected')
                setReasonForRejection(true);
            if(status === 'approved')
				await deleteWithJSON('/api/reservations/reservation/rejection', { id });
        } catch(error) {
            console.log(error);
        }

        setApprovePrompt(false);
        setRejectPrompt(false);
        setLoading(false);
    }

    const getResList = async () => {
        setLoading(true);
        try {
            const { data } = (await getData('/api/reservations')) || { data: [] };
            setReservations(data);
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getResList();
    }, []);

    return <>
        { loading && <Loading customStyle="size-full" /> }
        <div className="flex justify-between px-4 py-2 border-b-[1px] sticky top-[var(--nav-height)] bg-white z-subnavbar">
            <div>
                <h2 className="font-headings font-semibold">Reservation List</h2>
            </div>
            <div className="flex gap-2 divide-x-[1px] divide-black">
                <div className="px-1">
                    <button onClick={ ev => setDisplayStatus('pending') } className={ `px-2 rounded-lg ${ displayStatus === 'pending' && 'bg-skin-ten text-white' }` }>Pending</button>
                </div>
                <div className="px-1">
                    <button onClick={ ev => setDisplayStatus('approved') } className={ `px-2 rounded-lg ${ displayStatus === 'approved' && 'bg-skin-ten text-white' }` }>Approved</button>
                </div>
                <div className="px-1">
                    <button onClick={ ev => setDisplayStatus('rejected') } className={ `px-2 rounded-lg ${ displayStatus === 'rejected' && 'bg-skin-ten text-white' }` }>Rejected</button>
                </div>
            </div>
        </div>
        <section className="w-full h-[calc(100vh-var(--nav-height))] flex flex-col px-4 py-2 overflow-auto hide-scrollbar">
            {
                reservations.length === 0 ?
                    <div className="m-auto">
                        <h3 className="font-headings text-lg text-neutral-700">No Reservations Found</h3>
                    </div>
                :
                    <div className="w-full flex flex-col pb-40">
                        {
                            reservations.map((res, index) => {
                                // console.log(res);
                                const status = res?.status?.trim()?.toLowerCase();
                                if(displayStatus !== status) {
                                    return <div key={ index }></div>
                                }

                                return <Card 
                                    key={ index } 
                                    reservationData={ res } 
                                    tab={ displayStatus } 
                                    changeReservationStatus={ changeReservationStatus } 
                                />
                            })
                        }
                </div>
            }
        </section>
        {
            approvePrompt && <Prompt callback={ confirmChanges } 
                onClose={ () => { 
                    setApprovePrompt(false) ;
                    setLoading(false);
            }} header="Confirm Approval" message="Are you sure you want to approve this reservation?"/>
        }
        {
            rejectPrompt && <Prompt callback={ confirmChanges } 
                onClose={ () => { 
                    setRejectPrompt(false) ;
                    setLoading(false);
            }} header="Confirm Rejection" message="Are you sure you want to reject this reservation?"/>
        }
        {
            reasonForRejection && <PromptTextBox 
            callback={ async (form) => {
                const { id } = formData;
                const nFormData = new FormData(form);
                nFormData.append('id', id);
                await sendForm('/api/reservations/reservation/rejection', nFormData);
                setReasonForRejection(false);
            } } header="Reason for Rejection" message="Please provide a brief and concise reason for rejecting the client's reservation. This will help communicate the decision effectively."/>
        }
    </>
}

export default ReservationList;
    