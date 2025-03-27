import React, { useState, useEffect } from 'react';
import FavoriteService from '../utils/FavoriteService';

const FavoritePosts = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        FavoriteService.getFavorites()
            .then(setFavorites)
            .catch(() => setError('Error fetching favorite posts'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading favorites...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((post) => (
                        <div key={post.id} className="p-4 bg-white shadow-lg rounded-lg">
                            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                            <p className="text-sm">{post.summary}</p>
                            <p className="text-xs text-gray-500">{new Date(post.time).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-700">No favorite posts yet</p>
            )}
        </div>
    );
};

export default FavoritePosts;