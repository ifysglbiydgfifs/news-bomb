import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './utils/CustomTooltip';
import FavoriteService from './utils/FavoriteService';

const Chart = ({ posts, spokenPosts, highlightedLines }) => {
    const [favorites, setFavorites] = useState([]);
    const [hoveredPostId, setHoveredPostId] = useState(null); // Для отслеживания текущей наведенной точки

    useEffect(() => {
        FavoriteService.getFavorites().then(setFavorites).catch(console.error);
    }, []);

    const toggleFavorite = (post) => {
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

    const postMap = useMemo(() => {
        return posts.map(post => ({
            ...post,
            isFavorite: favorites.some(favPost => favPost.id === post.id),
        }));
    }, [posts, favorites]);

    const lines = useMemo(() => {
        return postMap.reduce((acc, post) => {
            post.lineTo.forEach(targetId => {
                const targetPost = postMap.find(p => p.id === targetId);
                if (targetPost) {
                    acc.push({ from: post, to: targetPost });
                }
            });
            return acc;
        }, []);
    }, [postMap]);

    const lineColor = useMemo(() => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`, []);

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={postMap} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={['auto', 'auto']}
                        tickFormatter={(time) =>
                            `${new Date(time).toLocaleDateString()} ${new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        }
                        label={{ value: "Дата и Время", position: "insideBottom", offset: -5 }}
                        ticks={postMap.map(post => post.time)}
                    />
                    <YAxis hide={true} />
                    <Tooltip content={<CustomTooltip />} />

                    {/* Рендеринг линий */}
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

                    {/* Рендеринг точек */}
                    {postMap.map((post) => {
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
                                    stroke: post.id === hoveredPostId ? 'blue' : 'transparent', // Синяя рамка вокруг текущей наведенной точки
                                    strokeWidth: 2,
                                    onMouseEnter: () => setHoveredPostId(post.id),  // Устанавливаем ID наведенной точки
                                    onMouseLeave: () => setHoveredPostId(null),    // Убираем ID, когда курсор уходит
                                    onClick: () => toggleFavorite(post),
                                }}
                                activeDot={false}
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
