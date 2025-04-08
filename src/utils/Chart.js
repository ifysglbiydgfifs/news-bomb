import React, { useState, useMemo } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import EntityNewsPopup from '../components/EntityNewsPopup';

const Chart = ({ posts, onPointClick }) => {
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [hoveredEntityNews, setHoveredEntityNews] = useState(null);

    const entityMap = useMemo(() => posts, [posts]);

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

    const handlePointHover = (entity) => {
        setHoveredPostId(entity.visualId);
        setHoveredEntityNews({ entity, news: entity.news });
    };

    const handlePointLeave = () => {
        setHoveredPostId(null);
        setHoveredEntityNews(null);
    };

    const lineColor = useMemo(() => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`, []);

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={entityMap} margin={{ top: 5, right: 20, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={['auto', 'auto']}
                        tickFormatter={(time) => {
                            const date = new Date(time);
                            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                        }}
                        label={{ value: "Дата и Время", position: "insideBottom", offset: -5 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis dataKey="y" type="number" domain={['auto', 'auto']} hide={true} />
                    <Tooltip content={<CustomTooltip />} />

                    {lines.map((line, index) => {
                        const lineData = [
                            {
                                x: line.from.x,
                                y: line.from.y,
                                time: line.from.time,
                                name: line.from.name,
                                type: line.from.type
                            },
                            {
                                x: line.to.x,
                                y: line.to.y,
                                time: line.to.time,
                                name: line.to.name,
                                type: line.to.type
                            }
                        ];

                        return (
                            <Line
                                key={`line-${index}`}
                                type="linear"
                                data={lineData}
                                dataKey="y"
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
                            key={`point-${entity.visualId}`}
                            type="linear"
                            data={[entity]}
                            dataKey="y"
                            stroke="transparent"
                            dot={{
                                r: entity.visualId === hoveredPostId ? 10 : 5,
                                fill: lineColor,
                                stroke: entity.visualId === hoveredPostId ? 'blue' : 'transparent',
                                strokeWidth: 2,
                                onMouseEnter: () => handlePointHover(entity),
                                onMouseLeave: handlePointLeave,
                                onClick: () => onPointClick(entity),
                            }}
                            isAnimationActive={false}
                            activeDot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            {hoveredEntityNews && (
                <EntityNewsPopup entity={hoveredEntityNews.entity} news={hoveredEntityNews.news} />
            )}
        </div>
    );
};

export default Chart;
