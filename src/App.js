import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import PostFilter from './PostFilter';

function App() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/posts')
            .then((response) => response.json())
            .then((data) => {
                const formattedPosts = data.map((post) => ({
                    ...post,
                    time: new Date(post.time).getTime(),
                    lineTo: post.lineTo ? post.lineTo.split(',').map(Number) : [],
                }));
                setPosts(formattedPosts);
                setFilteredPosts(formattedPosts);
            });
    }, []);


    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = PostFilter.applyFilters(posts, e.target.value, startDate, endDate);
        setFilteredPosts(filtered);
    };

    const handleFilter = () => {
        const filtered = PostFilter.applyFilters(posts, searchQuery, startDate, endDate);
        setFilteredPosts(filtered);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-8 justify-center items-center">
            <h1 className="text-3xl font-bold text-center mb-6">Новостная бомба</h1>
            <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 items-center justify-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Поиск по названию или описанию"
                    className="p-2 border rounded mb-4 sm:mb-0 lg:w-96 w-full"
                />

                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:w-auto w-full justify-center items-center">
                    <div
                        className="flex mb-4 sm:mb-0 sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
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
                    </div>
                    <button
                        onClick={handleFilter}
                        className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto"
                    >
                        Фильтровать
                    </button>
                </div>
            </div>
            <Chart posts={filteredPosts} />
        </div>
    );
}

export default App;
