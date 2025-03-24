import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './Tooltip';

const Chart = ({ posts }) => {
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
                <YAxis label={{ value: "Посты", angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="id"
                    stroke="#8884d8"
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;
