import React from 'react';

export const CustomTooltip = ({ payload }) => {
    if (payload && payload.length > 0) {
        const post = payload[0].payload;

        return (
            <div className="custom-tooltip p-3 bg-white border rounded-lg shadow-lg relative">
                <h4 className="text-lg font-semibold">{post.title}</h4>
                <p>{post.summary}</p>
                <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Type: {post.type}</p>
            </div>
        );
    }

    return null;
};