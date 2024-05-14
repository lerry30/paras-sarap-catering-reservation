// 'use client';
// import Loading from '@/components/Loading';
// import { useState } from 'react';

// const Dashboard = () => {
//     const [ loading, setLoading ] = useState(false);

//     return (
//         <section className="w-full h-[calc(100vh-var(--nav-height))] flex justify-center gap-2 p-4">
//             { loading && <Loading customStyle="size-full" /> }
//             <h2 className="font-bold text-4xl text-neutral-400">Dashboard</h2>
//         </section>
//     );
// }

// export default Dashboard;

'use client';
import { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement
);

const Dashboard = () => {
    const [reservations, setReservations] = useState({ pending: 10, approved: 50, rejected: 5 });
    const [users, setUsers] = useState(150);
    const [venues, setVenues] = useState(20);
    const [dishes, setDishes] = useState(50);
    const [drinks, setDrinks] = useState(30);
    const [serviceSatisfactionRate, setServiceSatisfactionRate] = useState(85);
    const [monthlyComparison, setMonthlyComparison] = useState([30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140]);

    const reservationData = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [
            {
                label: 'Reservations',
                data: [reservations.pending, reservations.approved, reservations.rejected],
                backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#FFCE56', '#36A2EB', '#FF6384']
            }
        ]
    };

    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Reservations Comparison',
                data: monthlyComparison,
                backgroundColor: '#36A2EB'
            }
        ]
    };

    return (
        <section className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-4">Reservations</h2>
                    <Pie data={reservationData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-4">Users</h2>
                    <p className="text-4xl font-bold">{users}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-4">Venues</h2>
                    <p className="text-4xl font-bold">{venues}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-4">Dishes</h2>
                    <p className="text-4xl font-bold">{dishes}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-4">Drinks</h2>
                    <p className="text-4xl font-bold">{drinks}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-4">Service Satisfaction Rate</h2>
                    <p className="text-4xl font-bold">{serviceSatisfactionRate}%</p>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-semibold text-lg mb-4">Monthly Reservations Comparison</h2>
                    <Bar data={monthlyData} />
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
