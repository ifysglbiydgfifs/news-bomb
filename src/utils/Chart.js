import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';

const Chart = ({ posts, spokenPosts, highlightedLines, favorites, onToggleFavorite }) => {
    const [hoveredPostId, setHoveredPostId] = useState(null);

    const entityMap = useMemo(() => {
        if (!posts || posts.length === 0) {
            return [];
        }
        return posts.map(entity => ({
            ...entity,
            isFavorite: favorites.some(favEntity => favEntity.id === entity.id),
        }));
    }, [posts, favorites]);

    const lines = useMemo(() => {
        return entityMap.reduce((acc, entity) => {
            const links = entity.link || [];
            links.forEach(targetId => {
                const targetEntity = entityMap.find(e => e.id === targetId);
                if (targetEntity) {
                    acc.push({ from: entity, to: targetEntity });
                }
            });
            return acc;
        }, []);
    }, [entityMap]);

    const lineColor = useMemo(() => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`, []);

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={entityMap} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={['auto', 'auto']}
                        tickFormatter={(time) =>
                            `${new Date(time).toLocaleDateString()} ${new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        }
                        label={{ value: "Дата и Время", position: "insideBottom", offset: -5 }}
                        ticks={entityMap.map(entity => entity.time)}
                    />
                    <YAxis hide={true} />
                    <Tooltip content={<CustomTooltip />} />

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

                    {entityMap.map((entity) => {
                        const isFavorite = favorites.some(favEntity => favEntity.id === entity.id);

                        return (
                            <Line
                                key={entity.id}
                                type="monotone"
                                data={[entity]}
                                dataKey="id"
                                stroke="transparent"
                                dot={{
                                    r: spokenPosts.has(entity.id) ? 10 : 5,
                                    fill: isFavorite ? 'gold' : lineColor,
                                    stroke: entity.id === hoveredPostId ? 'blue' : 'transparent',
                                    strokeWidth: 2,
                                    onMouseEnter: () => setHoveredPostId(entity.id),
                                    onMouseLeave: () => setHoveredPostId(null),
                                    onClick: () => onToggleFavorite(entity),
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