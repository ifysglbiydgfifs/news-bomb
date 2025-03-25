import React, { useState, useEffect } from 'react';
import Chart from '../Chart';
import Header from '../components/Header';
import PostFilter from '../PostFilter';


const Home = () => {
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
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <Header
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                startDate={startDate}
                endDate={endDate}
                handleFilter={handleFilter}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            />
            <Chart posts={filteredPosts} />
        </div>
    );
};

export default Home;