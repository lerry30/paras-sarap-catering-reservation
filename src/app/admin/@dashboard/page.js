'use client';

import Loading from '@/components/Loading';
import AnimateNumber from '@/components/AnimateNumber';

import { getData } from '@/utils/send';
import { toNumber } from '@/utils/number';

import { useState, useEffect } from 'react';
//import { Bar, Doughnut, Line } from 'react-chartjs-2';
//import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

//ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
    const [reservations, setReservations] = useState({ pending: 10, approved: 50, rejected: 5, expired: 3 });
    const [users, setUsers] = useState(0);
    const [venues, setVenues] = useState(0);
    const [dishes, setDishes] = useState(0);
    const [drinks, setDrinks] = useState(0);
    const [serviceSatisfactionRate, setServiceSatisfactionRate] = useState({});
    const [monthlyComparison, setMonthlyComparison] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [monthlyAccount, setMonthlyAccount] = useState(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const [popularVenues, setPopularVenues] = useState({});

    const [ loading, setLoading ] = useState(false);

    const reservationData = {
        labels: ['Pending', 'Approved', 'Rejected', 'Expired'],
        datasets: [
            {
                label: 'Reservations',
                data: [reservations.pending, reservations.approved, reservations.rejected, reservations.expired],
                backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#FF3333'],
                hoverBackgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#FF3333']
            }
        ]
    };

    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Reservations Comparison',
                data: monthlyComparison,
                backgroundColor: '#36A2EB',
                hoverBackgroundColor: '#36A2EB'
            }
        ]
    };

    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'User Growth',
                data: monthlyAccount,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const venuePopularityData = {
        labels: Object.keys(popularVenues),
        datasets: [
            {
                label: 'Venue Popularity',
                data: Object.values(popularVenues),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }
        ]
    };

    const satisfactionData = {
        labels: ['Satisfied', 'Neutral', 'Dissatisfied'],
        datasets: [
            {
                label: 'Service Satisfaction',
                data: [serviceSatisfactionRate?.satisfied, serviceSatisfactionRate?.neutral, serviceSatisfactionRate?.dissatisfied],
                backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384']
            }
        ]
    };

    const satisfactionComputation = (ratings) => {
        let satisfied = 0;
        let neutral = 0;
        let dissatisfied = 0;
        for(const item of ratings) {
            if(item >= 4) satisfied++;
            else if(item >= 2) neutral++;
            else if(item >= 0) dissatisfied++;
        }

        satisfied = satisfied / ratings.length * 100;
        neutral = neutral / ratings.length * 100;
        dissatisfied = dissatisfied / ratings.length * 100;

        setServiceSatisfactionRate({ satisfied, neutral, dissatisfied });
    } 

    const countDocuments = async () => {
        try {
            setLoading(true);

            const response = await getData('/api/dashboard');
            const countData = response?.data;
            const userCount = toNumber(countData?.users);
            const dishCount = toNumber(countData?.dishes);
            const drinkCount = toNumber(countData?.drinks);
            const venueCount = toNumber(countData?.venues);
            const reservationStatusesCount = countData?.reservations
            const setOfRatings = countData?.ratings;
            const monthlyReservation = countData?.months;
            const monthlyUserAccount = countData?.monthlyUserAccount;
            const venuePopularity = countData?.venuePopularity;

            setUsers(userCount);
            setDishes(dishCount);
            setDrinks(drinkCount);
            setVenues(venueCount);

            setReservations(reservationStatusesCount);
            satisfactionComputation(setOfRatings);
            setMonthlyComparison(monthlyReservation);
            setMonthlyAccount(monthlyUserAccount);
            setPopularVenues(venuePopularity);
        } catch(error) {
            console.log(error);
        }

        setLoading(false);
    }

    useEffect(() => countDocuments(), []);

    return (
        <section className="p-4 bg-neutral-100 min-h-screen">
            { loading && <Loading customStyle="size-full" /> }
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Reservations</h2>
                    <Bar data={reservationData} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Users</h2>
                    <AnimateNumber number={ users } size={ 40 } />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Venues</h2>
                    <AnimateNumber number={ venues } size={ 40 } />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Dishes</h2>
                    <AnimateNumber number={ dishes } size={ 40 } />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Drinks</h2>
                    <AnimateNumber number={ drinks } size={ 40 } />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Service Satisfaction Rate</h2>
                    <Doughnut data={satisfactionData} />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="font-semibold text-lg mb-2">Monthly Reservations Comparison</h2>
                    <Bar data={monthlyData} />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="font-semibold text-lg mb-2">User Growth Over Months</h2>
                    <Line data={userGrowthData} />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="font-semibold text-lg mb-2">Venue Popularity</h2>
                    <Bar data={venuePopularityData} />
                </div>
            </div>
        </section>
    );
}

const DashboardDumb = () => <></>

export default DashboardDumb;
