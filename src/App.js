import React, { useEffect, useState } from 'react';

function App() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Получаем данные о новостях с сервера
        fetch('http://localhost:3001/posts')
            .then((response) => response.json())
            .then((data) => setPosts(data));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Лента новостей */}
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">News Feed</h1>
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                            <p className="text-gray-700 mb-4">{post.summary}</p>
                            <div className="flex items-center justify-between text-gray-500">
                                <span>{post.time}</span>
                                <button className="text-blue-500 hover:underline">Read more</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Таймлайн справа */}
            <div className="w-full md:w-64 p-8 bg-gray-200 md:fixed right-0 top-0 md:h-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Timeline</h2>
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="flex items-center space-x-4">
                            <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                            <div className="text-gray-700">{post.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
