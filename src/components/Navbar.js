import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto">
                <ul className="flex space-x-4">
                    <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                    <li><Link to="/favorites" className="hover:text-blue-400">Favorites</Link></li>
                    <li><Link to="/settings" className="hover:text-blue-400">Settings</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;