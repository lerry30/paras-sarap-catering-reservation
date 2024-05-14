'use client';
import Loading from '@/components/Loading';
import Image from 'next/image';
import TitleFormat from '@/utils/titleFormat';
import { ChevronLeft, ChevronRight, CircleUserRound } from '@/components/icons/All';
import { areDatesEqual } from '@/utils/date';
import { deleteWithJSON, getData, sendForm, sendFormUpdate } from '@/utils/send';
import { useEffect, useState } from 'react';
import { createFullname } from '@/utils/name';
import { Prompt, PromptTextBox } from '@/components/Modal';

const Schedules = () => {
	const [ loading, setLoading ] = useState(false);
	const [ startOfTheMonth, setStartOfTheMonth ] = useState(undefined);
	const [ endOfTheMonth, setEndOfTheMonth ] = useState(undefined);
	const [ currentMonth, setCurrentMonth ] = useState(0);
	const [ currentYear, setCurrentYear ] = useState(2024);
	const [ noOfRows, setNoOfRows ] = useState(5);
	const [ displayData, setDisplayData ] = useState({});
	const [ eventStatus, setEventStatus ] = useState({ id: '', status: '' });
	const [ tab, setTab ] = useState('pending');
	const [ shiftStatus, setShiftStatus ] = useState({}); // { id: 'pending' }

	const [ approvePrompt, setApprovePrompt ] = useState(false);
    const [ rejectPrompt, setRejectPrompt ] = useState(false);
	const [ reasonForRejection, setReasonForRejection ] = useState(false);

	const [ reservations, setReservations ] = useState([]);

	const today = new Date();
	const dateObj = new Date();
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const noOfUnpickableDaysStartFromNow = 3;
	// const noOfDaysCanSched = 1000 * 60 * 60 * 24 * noOfUnpickableDaysStartFromNow;

	const setCalNumbers = (year, month) => {
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		setStartOfTheMonth(firstDay);
		setEndOfTheMonth(lastDay);

		const startDay = firstDay?.getDay() || -1;
		const endDay = lastDay?.getDate() || -1;
		setNoOfRows(Math.ceil((startDay + endDay) / 7) * 7);
	}

	const updateMonth = (direction) => {
		let nYear = currentYear;
		const nMonth = (currentMonth + direction + 12) % 12
		setCurrentMonth(nMonth);

		if (direction === -1) {
			if (nMonth === 11) {
				nYear = currentYear + direction;
			}
		} else {
			if (nMonth === 0) {
				nYear = currentYear + direction;
			}
		}

		setCurrentYear(nYear);
		setCalNumbers(nYear, nMonth);
	}

	const filterReservationDate = (date) => {
		for (const reservationObject of reservations) {
			const resDay = reservationObject?.date?.day;
			if (!resDay) continue;

			const dateObject = new Date(resDay);

			const dayReserved = areDatesEqual(date, dateObject);
			if (dayReserved) {
				return { isDateReserved: true, data: reservationObject }
			}
		}

		return { isDateReserved: false, data: {} };
	}

	const changeReservationStatus = (id, status) => {
        setEventStatus({ id, status });
        setApprovePrompt(status === 'approved');
        setRejectPrompt(status === 'rejected');
    }

    const confirmChanges = async () => {
        setLoading(true);
        try {
            const { id, status } = eventStatus;
            const form = new FormData();
            form.append('id', id);
            form.append('status', status);
            await sendFormUpdate('/api/reservations/reservation', form);

			setDisplayData({}); // { data }
			setShiftStatus(state => ({ ...state, [id]: status }));


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

	const shiftTab = (status) => {
		setTab(status);
		setDisplayData({}); // { data }
	}

	const getReservations = async () => {
		setLoading(true);

		try {
			const { data } = (await getData('/api/reservations')) || { data: [] };
			setReservations(data);
		} catch (error) {
			console.log(error);
		}

		setLoading(false);
	}

	useEffect(() => {
		getReservations();

		setCalNumbers(dateObj.getFullYear(), dateObj.getMonth());
		setCurrentMonth(dateObj.getMonth());
		setCurrentYear(dateObj.getFullYear());
	}, []);

	return (
		<>
			{loading && <Loading customStyle="size-full" />}
			<section className="flex h-[calc(100vh-var(--nav-height))] max-h-screen overflow-hidden p-4">
				<div className="grow flex flex-col">
					<main className="flex flex-col gap-2">
						<header>
							<div className="flex items-center justify-between pr-2 pb-2">
								{/* dateObj.toLocaleString('default', { month: 'long' }); // The best way to get the month name from a date */}
								<h2 className="font-headings">{`${months[currentMonth]} ${currentYear}`}</h2>
								<h2 className="font-headings font-semibold">Calendar</h2>
								<div className="flex gap-4">
									<button onClick={() => updateMonth(-1)}><ChevronLeft size={20} /></button>
									<button onClick={() => updateMonth(1)}><ChevronRight size={20} /></button>
								</div>
							</div>
							<div className="grid grid-cols-7 gap-2 pr-2">
								{
									days.map((day, index) => (
										<div key={index} className="w-full p-2 flex justify-center bg-neutral-100">
											<span className="font-headings font-bold text-sm">{day}</span>
										</div>
									))
								}
							</div>
						</header>
						<section className="grid grid-cols-7 gap-2 pr-2 font-paragraphs">
							{
								Array(noOfRows).fill(0).map((item, index) => {
									const startDay = startOfTheMonth?.getDay();
									const endDay = endOfTheMonth?.getDate();
									const number = index - startDay + 1;

									if (number > 0) {
										if (number <= endDay) {
											const milli = new Date(`${months[currentMonth]} ${number}, ${currentYear}`);
											const isToday = areDatesEqual(today, milli);

											if (isToday) {
												return (
													<div key={index} className="w-full aspect-square overflow-hidden p-1 border-[1px] border-neutral-400 cursor-pointer bg-skin-ten flex flex-col">
														<span className="text-white font-bold">{number}</span>
														<span className="text-neutral-200 text-sm font-semibold">Today</span>
													</div>
												)
											}

											// unpickable days start from now for preparations
											const range = number - today.getDate();
											if (currentMonth === (new Date()).getMonth() && currentYear === (new Date()).getFullYear()) {
												if (range > 0 && range <= noOfUnpickableDaysStartFromNow) {
													return (
														<div key={index} className="w-full aspect-square p-1 border-[1px] border-neutral-400 cursor-pointer bg-neutral-400 flex flex-col text-wrap overflow-hidden">
															<span className="text-white font-bold min-w-[50px]">{number}</span>
															<span className="w-full text-[12px] text-neutral-200 font-semibold overflow-clip mt-auto">unavailable</span>
														</div>
													)
												}
											}

											// past
											if (milli.getTime() < today.getTime()) {
												return (
													<div key={index} className="w-full aspect-square overflow-hidden p-1 border-[1px] border-neutral-600 cursor-pointer bg-neutral-600 flex flex-col">
														<span className="text-white font-bold min-w-[50px]">{number}</span>
													</div>
												)
											}

											const fResult = filterReservationDate(milli);
											if (fResult?.isDateReserved) {
												const data = fResult?.data;
												if(Object.keys(data).length > 0) {
													const id  = data?._id;
													const event = data?.event;
													let status = data?.status;

													if(Object.keys(shiftStatus).length === 0)
														setShiftStatus(state => ({ ...state, [id]: status }));
													else
														status = shiftStatus[id] || status;

													if(tab === status) {
														return (
															<div key={index} onClick={ () => {
																	setDisplayData(data);
																	setEventStatus({ id: '', status });
																}} className={ `w-full aspect-square overflow-hidden p-1 border-[1px] cursor-pointer flex flex-col border-blue-700 bg-blue-700 ${ status === 'rejected' && 'border-red-700 bg-red-700' }` }>
																<span className="text-white font-bold min-w-[50px]">{number}</span>
																<span className="text-neutral-200 text-[12px] font-semibold mt-auto overflow-clip">{ event }</span>
															</div>
														)
													}
												}
											}

											return (
												<div key={index} className="relative w-full aspect-square p-1 border-[1px] border-neutral-400 cursor-pointer">
													{/* default */}
													<span className="text-neutral-950">{number}</span>

													{/* selected display */}
													<div className="box absolute top-0 left-0 right-0 bottom-0 opacity-[0.01] bg-blue-700 p-1">
														<div className="flex flex-col">
															<span className="text-white font-bold">{number}</span>
															{/* <span className="text-neutral-200 text-[12px] text-wrap font-semibold w-full">{ service }</span> */}
														</div>
													</div>
												</div>
											)
										}
									}

									return <div key={index} className="w-full aspect-square p-2 bg-neutral-400/30"></div>
								})
							}
						</section>
					</main>
				</div>
				{/* list */}
				<div className="w-1/2 p-4 border-[1px] border-neutral-400">
					<div className="h-[calc(var(--nav-height)-28px)] flex divide-x-[1px] divide-[var(--skin-ten)] mb-[14px]">
						<button onClick={ () => shiftTab('pending') } className={ `w-full py-2 leading-none ${ tab === 'pending' && 'bg-skin-ten text-white font-semibold' }` }>Pending</button>
						<button onClick={ () => shiftTab('approved') } className={ `w-full py-2 leading-none ${ tab === 'approved' && 'bg-skin-ten text-white font-semibold' }` }>Approved</button>
						<button onClick={ () => shiftTab('rejected') } className={ `w-full py-2 leading-none ${ tab === 'rejected' && 'bg-skin-ten text-white font-semibold' }` }>Rejected</button>
					</div>
					{/* { console.log(tab) } */}
					{
						Object.keys(displayData).length > 0 ?
							<article className="w-full h-[calc(100%-var(--nav-height)+18px)] flex flex-col gap-2">
								<div className="flex gap-2">
									{
										displayData?.user?.filename ?
											<div className="size-14">
												<Image 
													src={ displayData?.user?.filename }
													alt={ displayData?.user?.firstname || '' }
													width={ 200 }
													height={ 200 }
													sizes='100%'
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														transformOrigin: 'center',
														borderRadius: '4px',
													}}
													priority
												/>
											</div>
										:
											<div className="">
												<CircleUserRound size={56} strokeWidth={1} className="" />
											</div>
									}
									<div>
										<h3 className="font-headings font-semibold text-lg">{ createFullname(displayData?.user?.firstname, displayData?.user?.lastname) }</h3>
										<span className="font-paragraphs italic text-sm">{ displayData?.user?.email }</span>
									</div>
								</div>

								<hr />

								<h2 className="font-headings font-semibold">{ TitleFormat(displayData?.event) }</h2>

								<hr />
								
								<h2 className="font-headings font-semibold">Date:</h2>
								<div className="flex gap-2 font-paragraphs">
									<h2 className="font-semibold text-sm text-neutral-500">Reserved At:</h2>
									<span className="text-sm text-neutral-500">{ displayData?.date?.day }</span>
								</div>

								<div className="flex gap-2 flex-wrap">
									<div className="flex gap-2 font-paragraphs">
										<h2 className="font-semibold text-sm text-neutral-500">From:</h2>
										<span className="text-sm text-neutral-500">{ displayData?.date?.time?.from }</span>
									</div>

									<div className="flex gap-2 font-paragraphs">
										<h2 className="font-semibold text-sm text-neutral-500">To:</h2>
										<span className="text-sm text-neutral-500">{ displayData?.date?.time?.to }</span>
									</div>
								</div>

								<hr />

								<article className="font-headings font-semibold flex gap-2">
									<span>Status: </span>
									<span className={ `text-sm rounded-full border-[1px] px-2 text-neutral-700 leading-normal` }>{ eventStatus?.status }</span>
								</article>

								<hr />

								<div className="font-headings flex gap-4 py-4">
									{
										(eventStatus?.status === 'pending' || eventStatus?.status === 'rejected') &&
											<button onClick={ () => changeReservationStatus(displayData?._id, 'approved') } className="bg-skin-ten text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-emerald-800 leading-normal">APPROVE</button>
									}

									{
										(eventStatus?.status === 'pending' || eventStatus?.status === 'approved') &&
											<button onClick={ () => changeReservationStatus(displayData?._id, 'rejected') } className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-800 leading-normal">REJECT</button>
									}
								</div>
							</article>
						:
							<article className="w-full h-[calc(100%-var(--nav-height)+18px)] flex items-center justify-center">
								<h1 className="font-headings font-bold text-lg text-neutral-900/70">Preview</h1>
							</article>
					}
				</div>
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
					const { id } = eventStatus;
					const formData = new FormData(form);
					formData.append('id', id);
					await sendForm('/api/reservations/reservation/rejection', formData);
					setReasonForRejection(false);
				} } header="Reason for Rejection" message="Please provide a brief and concise reason for rejecting the client's reservation. This will help communicate the decision effectively."/>
			}
		</>
	);
}

export default Schedules;