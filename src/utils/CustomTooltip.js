import React from 'react';

export const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const post = payload[0].payload;

        return (
            <div className="p-4 bg-white shadow-md rounded-lg">
                <h4 className="text-lg font-bold text-gray-800">{post.title}</h4>
                <p className="text-sm text-gray-600">{post.summary}</p>
                <p className="text-xs text-gray-500">
                    {new Date(post.time).toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};
