import React, { useState, useEffect, useCallback } from 'react';
import Chart from '../utils/Chart';
import RouteMenu from '../components/RouteMenu';
import PostFilter from '../utils/PostFilter';
import DigestPopup from '../components/DigestPopup';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [digestPost, setDigestPost] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/posts')
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((post) => {
                    const minTime = post.news?.length
                        ? Math.min(...post.news.map(n => n.time))
                        : Date.now();
                    return {
                        ...post,
                        time: minTime,
                        link: Array.isArray(post.link) ? post.link : [],
                    };
                });
                setPosts(formatted);
                setFilteredPosts(formatted);
            })
            .catch(console.error);
    }, []);


    const handleSearch = useCallback((e) => {
        const value = e.target.value;
        setSearchQuery(value);
        const filtered = PostFilter.applyFilters(posts, value, startDate, endDate, selectedType);
        setFilteredPosts(filtered);
    }, [posts, startDate, endDate, selectedType]);

    const handleFilter = useCallback(() => {
        const filtered = PostFilter.applyFilters(posts, searchQuery, startDate, endDate, selectedType);
        setFilteredPosts(filtered);
    }, [posts, searchQuery, startDate, endDate, selectedType]);

    const handleTypeChange = (type) => {
        setSelectedType(type);
        const filtered = PostFilter.applyFilters(posts, searchQuery, startDate, endDate, type);
        setFilteredPosts(filtered);
    };

    const handleShowDigest = (post) => {
        setDigestPost(post);
    };

    const handleCloseDigest = () => {
        setDigestPost(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <Chart
                posts={filteredPosts}
                favorites={favorites}
                onShowDigest={handleShowDigest}
            />
            <RouteMenu
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                startDate={startDate}
                endDate={endDate}
                handleFilter={handleFilter}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleTypeChange={handleTypeChange}
                allTypes={[...new Set(posts.map(p => p.type))]}
                selectedType={selectedType}
            />
            {digestPost && <DigestPopup post={digestPost} onClose={handleCloseDigest} />}
        </div>
    );
};

export default Home;
