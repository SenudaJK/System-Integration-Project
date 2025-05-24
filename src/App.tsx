import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerRegistration from './pages/OwnerRegistration';
import './App.css';
import OrderPage from "./pages/OrderPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<OwnerRegistration />} />
                <Route path="/orders" element={<OrderPage />} />
            </Routes>
        </Router>
    );
}

export default App;