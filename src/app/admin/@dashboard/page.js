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
import { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

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
                data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const venuePopularityData = {
        labels: ['Venue 1', 'Venue 2', 'Venue 3', 'Venue 4', 'Venue 5'],
        datasets: [
            {
                label: 'Venue Popularity',
                data: [20, 15, 30, 10, 25],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }
        ]
    };

    const satisfactionData = {
        labels: ['Satisfied', 'Neutral', 'Dissatisfied'],
        datasets: [
            {
                label: 'Service Satisfaction',
                data: [serviceSatisfactionRate, 100 - serviceSatisfactionRate - 5, 5],
                backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384']
            }
        ]
    };

    return (
        <section className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Reservations</h2>
                    <Bar data={reservationData} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Users</h2>
                    <p className="text-3xl font-bold">{users}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Venues</h2>
                    <p className="text-3xl font-bold">{venues}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Dishes</h2>
                    <p className="text-3xl font-bold">{dishes}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="font-semibold text-lg mb-2">Drinks</h2>
                    <p className="text-3xl font-bold">{drinks}</p>
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

export default Dashboard;
