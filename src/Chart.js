import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';

const Chart = ({ posts }) => {
    const postMap = posts.reduce((map, post) => {
        map[post.id] = post;
        return map;
    }, {});

    const lines = [];
    const pointColors = {};

    posts.forEach(post => {
        if (post.lineTo.length > 0) {
            post.lineTo.forEach(targetId => {
                const targetPost = postMap[targetId];
                if (targetPost) {
                    lines.push({
                        from: post,
                        to: targetPost,
                    });
                }
            });
        }
    });

    const getColorForPost = (postId) => {
        if (!pointColors[postId]) {
            pointColors[postId] = `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`;
        }
        return pointColors[postId];
    };

    return (
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
                <YAxis
                    type="number"
                    dataKey="id"
                    tick={false}
                    label={{ value: "", angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />

                {lines.map((line, index) => (
                    <Line
                        key={index}
                        type="monotone"
                        data={[
                            { time: line.from.time, id: line.from.id, title: line.from.title, summary: line.from.summary, timeText: line.from.time },
                            { time: line.to.time, id: line.to.id, title: line.to.title, summary: line.to.summary, timeText: line.to.time }
                        ]}
                        dataKey="id"
                        stroke={getColorForPost(line.from.id)}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                        isAnimationActive={false}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;
