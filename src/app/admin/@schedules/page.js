'use client';
import Loading from '@/components/Loading';
import { ChevronLeft, ChevronRight } from '@/components/icons/All';
import { areDatesEqual } from '@/utils/date';
import { getData } from '@/utils/send';
import { useEffect, useState } from 'react';

const Schedules = () => {
	const [loading, setLoading] = useState(false);
	const [startOfTheMonth, setStartOfTheMonth] = useState(undefined);
	const [endOfTheMonth, setEndOfTheMonth] = useState(undefined);
	const [currentMonth, setCurrentMonth] = useState(0);
	const [currentYear, setCurrentYear] = useState(2024);
	const [noOfRows, setNoOfRows] = useState(5);

	const [reservations, setReservations] = useState([]);

	const today = new Date();
	const dateObj = new Date();
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const noOfUnpickableDaysStartFromNow = 3;
	const noOfDaysCanSched = 1000 * 60 * 60 * 24 * noOfUnpickableDaysStartFromNow;

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

	const getReservations = async () => {
		setLoading(true);

		try {
			const { data } = (await getData('/api/reservations')) || { data: [] };
			setReservations(data);

			console.log(data);
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
			<section className="flex h-[calc(100vh-var(--nav-height))] max-h-screen overflow-hidden p-4">
				{loading && <Loading customStyle="size-full" />}
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
														<div key={index} className="w-full aspect-square overflow-hidden p-1 border-[1px] border-neutral-400 cursor-pointer bg-neutral-400 flex flex-col">
															<span className="text-white font-bold min-w-[50px]">{number}</span>
															<span className="text-neutral-200 text-[12px] font-semibold mt-auto overflow-clip">unavailable</span>
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
												return (
													<div key={index} className="w-full aspect-square overflow-hidden p-1 border-[1px] border-blue-700 cursor-pointer bg-blue-700 flex flex-col">
														<span className="text-white font-bold min-w-[50px]">{number}</span>
														<span className="text-neutral-200 text-[12px] font-semibold mt-auto overflow-clip">res</span>
													</div>
												)
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
				<div className="w-1/2 border-[1px] border-neutral-400">

				</div>
			</section>
		</>
	);
}

export default Schedules;