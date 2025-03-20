import React, { useEffect, useState, useRef } from 'react';

function App() {
    const [posts, setPosts] = useState([]);
    const [activePostId, setActivePostId] = useState(null);
    const postsRef = useRef([]); // Ссылки на посты для отслеживания их высоты

    useEffect(() => {
        fetch('http://localhost:3001/posts')
            .then((response) => response.json())
            .then((data) => setPosts(data));
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2; // Позиция прокрутки

            // Определяем активный пост на основе текущей прокрутки
            postsRef.current.forEach((postElement, index) => {
                const rect = postElement.getBoundingClientRect();
                if (rect.top <= scrollPosition && rect.bottom >= scrollPosition) {
                    setActivePostId(posts[index].id); // Устанавливаем активный пост
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [posts]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Лента новостей и таймлайн в одном контейнере */}
            <div className="flex-1 p-8 relative flex">
                {/* Лента новостей */}
                <div className="flex-1 space-y-6 pr-16">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            ref={(el) => (postsRef.current[index] = el)} // Сохраняем рефы для постов
                            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${
                                activePostId === post.id ? 'border-l-4 border-blue-600' : ''
                            }`}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                            <p className="text-gray-700 mb-4">{post.summary}</p>
                            <div className="flex items-center justify-between text-gray-500">
                                {/* Преобразуем время в читаемый формат */}
                                <span>{new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <button className="text-blue-500 hover:underline">Read more</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Таймлайн справа от ленты */}
                <div
                    className="absolute right-0 top-0 w-16 flex flex-col justify-start items-center space-y-4 py-8"
                >
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className={`transition-all duration-300 ease-in-out w-full text-center ${
                                activePostId === post.id ? 'bg-blue-600 text-white' : 'bg-gray-300'
                            }`}
                            style={{
                                height: postsRef.current[index]?.offsetHeight || 'auto', // Используем высоту поста
                            }}
                        >
                            {/* Преобразуем время в читаемый формат */}
                            <span className="text-sm">
                                {new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
