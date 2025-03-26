import React from 'react';

const RouteMenu = ({
                       searchQuery,
                       handleSearch,
                       startDate,
                       endDate,
                       handleFilter,
                       setStartDate,
                       setEndDate,
                       handleSpeakPosts,
                       isSpeaking,
                   }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-lg">
            <div className="flex flex-col sm:flex-row sm:space-x-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:space-x-4 items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search by title or description"
                        className="p-2 border rounded mb-4 sm:mb-0 lg:w-96 w-full"
                    />

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border rounded mb-4 sm:mb-0 w-full sm:w-40"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border rounded w-full sm:w-40"
                    />
                    <button
                        onClick={handleFilter}
                        className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto"
                    >
                        Filter
                    </button>
                </div>

                <button
                    onClick={handleSpeakPosts}
                    disabled={isSpeaking}
                    className={`p-2 rounded w-full sm:w-auto ${isSpeaking ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                >
                    {isSpeaking ? 'Speaking...' : 'Start Speaking'}
                </button>
            </div>
        </div>
    );
};

export default RouteMenu;
