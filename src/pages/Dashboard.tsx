import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/NavBar';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <Navbar />
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Owner Dashboard</h2>
                <p className="mb-4 text-center">Welcome to your dashboard!</p>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </div>
        </>
    );
};

export default Dashboard;