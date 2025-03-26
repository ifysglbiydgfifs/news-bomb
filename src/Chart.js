import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './utils/CustomTooltip';

const Chart = ({ posts, spokenPosts, highlightedLines }) => {
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

                    {posts.map((post) => (
                        <Line
                            key={post.id}
                            type="monotone"
                            data={[post]}
                            dataKey="id"
                            stroke="transparent"
                            dot={{ r: spokenPosts.has(post.id) ? 10 : 5, fill: lineColor }}
                            activeDot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
