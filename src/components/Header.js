import React from 'react';

const Header = ({ searchQuery, handleSearch, startDate, endDate, handleFilter, setStartDate, setEndDate }) => {
    return (
        <header className="mb-4 flex flex-col sm:flex-row sm:space-x-4 items-center justify-center">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by title or description"
                className="p-2 border rounded mb-4 sm:mb-0 lg:w-96 w-full"
            />
            <div className="flex flex-col sm:flex-row sm:space-x-4 sm:w-auto w-full justify-center items-center">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded w-full sm:w-32"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded w-full sm:w-32"
                />
                <button
                    onClick={handleFilter}
                    className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto"
                >
                    Filter
                </button>
            </div>
        </header>
    );
};

export default Header;