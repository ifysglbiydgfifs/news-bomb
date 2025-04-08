import React, { useState, useMemo } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from 'recharts';
import { CustomTooltip } from './CustomTooltip';

const Chart = ({ posts, spokenPosts = new Set(), highlightedLines = new Set(), onShowDigest }) => {
    const [hoveredPostId, setHoveredPostId] = useState(null);

    const entityMap = useMemo(() => {
        return posts.map(entity => ({
            ...entity,
        }));
    }, [posts]);

    const lines = useMemo(() => {
        return entityMap.reduce((acc, entity) => {
            entity.link.forEach(targetId => {
                const targetEntity = entityMap.find(p => p.id === targetId);
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
                        tickFormatter={(time) => {
                            const date = new Date(time);
                            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                        }}
                        label={{ value: "Дата и Время", position: "insideBottom", offset: -5 }}
                        ticks={entityMap.map(entity => entity.time)}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />

                    {lines.map((line, index) => {
                        const lineData = [
                            { ...line.from, time: line.from.time, id: line.from.id },
                            { ...line.to, time: line.to.time, id: line.to.id }
                        ];

                        return (
                            <Line
                                key={`line-${index}`}
                                type="linear"
                                data={lineData}
                                dataKey="id"
                                stroke={lineColor}
                                strokeWidth={2}
                                dot={false}
                                activeDot={false}
                                isAnimationActive={false}
                                legendType="none"
                            />
                        );
                    })}

                    {entityMap.map((entity) => (
                        <Line
                            key={`point-${entity.id}`}
                            type="monotone"
                            data={[entity]}
                            dataKey="id"
                            stroke="transparent"
                            dot={{
                                r: entity.id === hoveredPostId ? 10 : 5,
                                fill: lineColor,
                                stroke: entity.id === hoveredPostId ? 'blue' : 'transparent',
                                strokeWidth: 2,
                                onMouseEnter: () => setHoveredPostId(entity.id),
                                onMouseLeave: () => setHoveredPostId(null),
                                onClick: () => onShowDigest(entity),
                            }}
                            activeDot={false}
                            isAnimationActive={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
