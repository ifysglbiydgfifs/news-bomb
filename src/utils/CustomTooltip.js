import React from 'react';

export const CustomTooltip = ({ payload }) => {
    if (payload && payload.length > 0) {
        const post = payload[0].payload;
        const isFavorite = post.isFavorite; // Берем актуальный статус из данных поста

        return (
            <div className="custom-tooltip p-2 bg-white border rounded shadow">
                <h4 className="text-lg font-semibold">{post.title}</h4>
                <p>{post.summary}</p>
                <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
                <div className="flex justify-between items-center mt-2">
                    <span>{isFavorite ? 'Added to favorites' : 'Not in favorites'}</span>
                    <i className={`heart-icon ${isFavorite ? 'text-red-500' : 'text-gray-500'}`} />
                </div>
            </div>
        );
    }

    return null;
};
