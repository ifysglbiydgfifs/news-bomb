import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg p-4 fixed w-full z-10 top-0 left-0">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link to="/" className="hover:text-gray-200 transition duration-300">MyApp</Link>
                </div>
                <ul className="flex space-x-6">
                    <li><Link to="/" className="hover:text-gray-200 transition duration-300 text-lg">Home</Link></li>
                    <li><Link to="/favorites" className="hover:text-gray-200 transition duration-300 text-lg">Favorites</Link></li>
                    <li><Link to="/settings" className="hover:text-gray-200 transition duration-300 text-lg">Settings</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
