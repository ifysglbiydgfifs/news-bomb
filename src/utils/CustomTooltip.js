import React from 'react';
import { FaHeart } from 'react-icons/fa';

export const CustomTooltip = ({ payload }) => {
    if (payload && payload.length > 0) {
        const post = payload[0].payload;
        const isFavorite = post.isFavorite;

        return (
            <div className="custom-tooltip p-3 bg-white border rounded-lg shadow-lg relative">
                <h4 className="text-lg font-semibold">{post.title}</h4>
                <p>{post.summary}</p>
                <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className={isFavorite ? 'text-red-500' : 'text-gray-500'}>
                        {isFavorite ? 'Added to favorites' : 'Not in favorites'}
                    </span>
                    <FaHeart className={`text-2xl ${isFavorite ? 'text-red-500' : 'text-gray-500'}`} />
                </div>
            </div>
        );
    }

    return null;
};