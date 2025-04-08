import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Chart from '../utils/Chart';
import RouteMenu from '../components/RouteMenu';
import PostFilter from '../utils/PostFilter';
import DigestPopup from '../components/DigestPopup';
import SpeakingService from "../utils/SpeakingService";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [digestPost, setDigestPost] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);


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
                        visualId: uuidv4(),
                        x: minTime,
                        y: Math.random() * 100,
                    };
                });
                setPosts(formatted);
                setFilteredPosts(formatted);
            })
            .catch(console.error);
    }, []);

    const handleShowDigest = (post) => {
        fetch(`http://localhost:3001/digest`)
            .then((res) => res.json())
            .then((data) => {
                const digest = data.find(d => d.type === post.type);
                setDigestPost(digest);
            })
            .catch(console.error);
    };

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

    const handlePointClick = (entity) => {
        handleShowDigest(entity);
    };

    const handleCloseDigest = () => {
        SpeakingService.cancel(); // ⬅️ Останавливаем озвучку при закрытии окна
        setDigestPost(null);
    };

    useEffect(() => {
        window.speechSynthesis.getVoices(); // Прогреваем голосовой список
    }, []);


    const handleSpeak = () => {
        if (!digestPost) return;
        SpeakingService.speakDigest(digestPost);
    };

    const handlePause = () => {
        SpeakingService.pause();
        setIsPaused(true);
    };

    const handleResume = () => {
        SpeakingService.resume();
        setIsPaused(false);
    };

    const handleStopSpeaking = () => {
        SpeakingService.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <Chart
                posts={filteredPosts}
                favorites={favorites}
                onPointClick={handlePointClick}
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
            {digestPost && (
                <DigestPopup
                    content={digestPost.content}
                    summary={digestPost.summary}
                    onClose={handleCloseDigest}
                    onSpeak={handleSpeak}
                    onPause={handlePause}
                    onResume={handleResume}
                    onStop={handleStopSpeaking}
                    isSpeaking={isSpeaking}
                    isPaused={isPaused}
                />
            )}
        </div>
    );
};

export default Home;
