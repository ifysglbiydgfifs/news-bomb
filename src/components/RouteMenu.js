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
                       handleStopSpeaking,
                       isSpeaking,
                       isPaused,
                   }) => {
    return (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white p-2 border-t shadow-lg rounded-lg">
            <div className="flex flex-col sm:flex-row sm:space-x-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:space-x-2 items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search"
                        className="p-1.5 border rounded-lg mb-2 sm:mb-0 lg:w-80 w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-1.5 border rounded-lg mb-2 sm:mb-0 w-auto sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-1.5 border rounded-lg w-auto sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        onClick={handleFilter}
                        className="p-1.5 bg-blue-500 text-white rounded-lg w-auto sm:w-auto hover:bg-blue-400 transition duration-300 text-sm"
                    >
                        Filter
                    </button>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handleSpeakPosts}
                        aria-label={isSpeaking ? (isPaused ? 'Resume speaking posts' : 'Pause speaking posts') : 'Start speaking posts'}
                        className={`p-1.5 rounded-lg w-auto sm:w-auto ${isSpeaking ? (isPaused ? 'bg-green-500' : 'bg-yellow-500') : 'bg-blue-500 text-white hover:bg-blue-400'} transition duration-300 text-sm`}
                    >
                        {isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Start Speaking'}
                    </button>
                    {isSpeaking && !isPaused && (
                        <button
                            onClick={handleStopSpeaking}
                            className="p-1.5 bg-red-500 text-white rounded-lg w-auto sm:w-auto hover:bg-red-400 transition duration-300 text-sm"
                        >
                            Stop
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteMenu;