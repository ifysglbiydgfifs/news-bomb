import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LikedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        const posts = JSON.parse(localStorage.getItem('savedPosts')) || [];
        setSavedPosts(posts);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <h2 className="text-xl font-bold">Сохраненные посты</h2>
            <div>
                {savedPosts.length === 0 ? (
                    <p>У вас нет сохраненных постов.</p>
                ) : (
                    <ul>
                        {savedPosts.map(post => (
                            <li key={post.id} className="mb-4">
                                <h3>{post.title}</h3>
                                <p>{post.summary}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Link to="/" className="text-blue-500">Назад к постам</Link>
        </div>
    );
};

export default LikedPosts;
