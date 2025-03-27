import React, { useState, useEffect, useCallback } from 'react';
import Chart from '../Chart';
import RouteMenu from '../components/RouteMenu';
import PostFilter from '../utils/PostFilter';
import { speakPosts, pauseSpeaking, stopSpeaking, highlightConnections, resumeSpeaking } from '../utils/BFS';

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
        console.log('handleSpeakPosts called, isSpeaking:', isSpeaking, 'isPaused:', isPaused);

        if (!isSpeaking && !isPaused) {
            console.log('Starting to speak posts...');
            setIsSpeaking(true);
            speakPosts(filteredPosts, setSpokenPosts, setHighlightedLines, setIsSpeaking);
        } else if (isSpeaking && !isPaused) {
            console.log('Pausing speech...');
            pauseSpeaking();
            setIsPaused(true);
        } else if (isPaused) {
            console.log('Resuming speech...');
            resumeSpeaking();
            setIsPaused(false);
        }
    }, [isSpeaking, filteredPosts, isPaused]);

    const handleStopSpeaking = useCallback(() => {
        if (isSpeaking) {
            console.log('Stopping speech...');
            stopSpeaking();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, [isSpeaking]);

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

