import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-6 mt-0 shadow-lg">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm sm:text-base">&copy; 2025 <span className="font-semibold">News Bomb</span></p>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                    {/*<a href="#" className="hover:text-blue-400 transition duration-300">Privacy</a>
                    <a href="#" className="hover:text-blue-400 transition duration-300">Terms</a>
                    <a href="#" className="hover:text-blue-400 transition duration-300">Contact</a>*/}
                </div>
            </div>
        </footer>
    );
};

export default Footer;