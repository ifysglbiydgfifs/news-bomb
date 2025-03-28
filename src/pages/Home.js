import React, { useState, useEffect, useCallback } from 'react';
import Chart from '../utils/Chart';
import RouteMenu from '../components/RouteMenu';
import PostFilter from '../utils/PostFilter';
import { speakPosts, pauseSpeaking, stopSpeaking, highlightConnections, resumeSpeaking } from '../utils/BFS';
import FavoriteService from '../utils/FavoriteService';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [spokenPosts, setSpokenPosts] = useState(new Set());
    const [highlightedLines, setHighlightedLines] = useState(new Set());
    const [favorites, setFavorites] = useState([]);

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
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });

        FavoriteService.getFavorites().then(setFavorites).catch(console.error);
    }, []);

    const handleSearch = useCallback((e) => {
        setSearchQuery(e.target.value);
        const filtered = PostFilter.applyFilters(posts, e.target.value, startDate, endDate);
        setFilteredPosts(filtered);
    }, [posts, startDate, endDate]);

    const handleFilter = useCallback(() => {
        const filtered = PostFilter.applyFilters(posts, searchQuery, startDate, endDate);
        setFilteredPosts(filtered);
    }, [posts, searchQuery, startDate, endDate]);

    const handleSpeakPosts = useCallback(() => {
        if (!isSpeaking && !isPaused) {
            setIsSpeaking(true);
            speakPosts(filteredPosts, setSpokenPosts, setHighlightedLines, setIsSpeaking);
        } else if (isSpeaking && !isPaused) {
            pauseSpeaking();
            setIsPaused(true);
        } else if (isPaused) {
            resumeSpeaking();
            setIsPaused(false);
        }
    }, [isSpeaking, filteredPosts, isPaused]);

    const handleStopSpeaking = useCallback(() => {
        if (isSpeaking) {
            stopSpeaking();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, [isSpeaking]);

    const handleToggleFavorite = (post) => {
        const isFavorite = favorites.some(favPost => favPost.id === post.id);
        if (isFavorite) {
            FavoriteService.removeFavorite(post.id).then(() => {
                setFavorites(favorites.filter(favPost => favPost.id !== post.id));
            }).catch(console.error);
        } else {
            FavoriteService.addFavorite(post).then(() => {
                setFavorites([...favorites, post]);
            }).catch(console.error);
        }
    };

    useEffect(() => {
        const highlighted = highlightConnections(filteredPosts, spokenPosts);
        setHighlightedLines(highlighted);
    }, [spokenPosts, filteredPosts]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <Chart
                posts={filteredPosts}
                spokenPosts={spokenPosts}
                highlightedLines={highlightedLines}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
            />
            <RouteMenu
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                startDate={startDate}
                endDate={endDate}
                handleFilter={handleFilter}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleSpeakPosts={handleSpeakPosts}
                handleStopSpeaking={handleStopSpeaking}
                isSpeaking={isSpeaking}
                isPaused={isPaused}
            />
        </div>
    );
};

export default Home;