import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './utils/CustomTooltip';

const Chart = ({ posts, spokenPosts, highlightedLines }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/favorites')
            .then((response) => response.json())
            .then((data) => {
                setFavorites(data);
            })
            .catch((error) => {
                console.error("Error fetching favorite posts:", error);
            });
    }, []);

    const toggleFavorite = (post) => {
        console.log('Toggling favorite for post:', post);
        const isFavorite = favorites.some(favPost => favPost.id === post.id);
        if (isFavorite) {
            setFavorites(favorites.filter(favPost => favPost.id !== post.id));
            fetch('http://localhost:3001/favorites', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: post.id }),
            })
                .then(response => {
                    if (!response.ok) {
                        console.error(`Failed to delete post with id ${post.id}`);
                    } else {
                        console.log(`Post with id ${post.id} successfully deleted`);
                    }
                })
                .catch((err) => console.error('Error removing from favorites:', err));
        } else {
            setFavorites([...favorites, post]);
            fetch('http://localhost:3001/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post),
            })
                .then(response => {
                    if (!response.ok) {
                        console.error('Failed to add post to favorites');
                    } else {
                        console.log('Post added to favorites');
                    }
                })
                .catch((err) => console.error('Error adding to favorites:', err));
        }
    };

    const postMap = posts.reduce((map, post) => {
        map[post.id] = post;
        return map;
    }, {});

    const lines = posts.reduce((acc, post) => {
        post.lineTo.forEach(targetId => {
            const targetPost = postMap[targetId];
            if (targetPost) {
                acc.push({ from: post, to: targetPost });
            }
        });
        return acc;
    }, []);

    const lineColor = useMemo(() => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`, []);

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={posts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={['auto', 'auto']}
                        tickFormatter={(time) =>
                            `${new Date(time).toLocaleDateString()} ${new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        }
                        label={{ value: "Дата и Время", position: "insideBottom", offset: -5 }}
                        ticks={posts.map(post => post.time)}
                    />
                    <YAxis hide={true} />
                    <Tooltip content={<CustomTooltip />}/>

                    {lines.map((line, index) => {
                        const isHighlighted = highlightedLines.has(`${line.from.id}-${line.to.id}`);
                        const lineData = [
                            { ...line.from, time: line.from.time, id: line.from.id },
                            { ...line.to, time: line.to.time, id: line.to.id }
                        ];

                        return (
                            <Line
                                key={index}
                                type="monotone"
                                data={lineData}
                                dataKey="id"
                                stroke={lineColor}
                                strokeWidth={isHighlighted ? 4 : 2}
                                dot={false}
                                activeDot={false}
                                isAnimationActive={false}
                            />
                        );
                    })}

                    {posts.map((post) => {
                        const isFavorite = favorites.some(favPost => favPost.id === post.id);
                        return (
                            <Line
                                key={post.id}
                                type="monotone"
                                data={[post]}
                                dataKey="id"
                                stroke="transparent"
                                dot={{
                                    r: spokenPosts.has(post.id) ? 10 : 5,
                                    fill: isFavorite ? 'gold' : lineColor,
                                    onClick: () => toggleFavorite(post)
                                }}
                                activeDot={true}
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;