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
            const scrollPosition = window.scrollY + window.innerHeight; // Позиция прокрутки (с учетом всей видимой области)

            let foundActivePost = false;

            // Проверяем каждый пост на видимость
            postsRef.current.forEach((postElement, index) => {
                const rect = postElement.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (!foundActivePost) {
                        setActivePostId(posts[index].id); // Устанавливаем первый видимый пост как активный
                        foundActivePost = true;
                    }
                }
            });

            // Если все посты находятся вне области видимости, сбрасываем активность
            if (!foundActivePost) {
                setActivePostId(null);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [posts]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Лента новостей с таймлайном справа */}
            <div className="flex-1 p-8 relative flex">
                {/* Лента новостей и таймлайн в одном контейнере */}
                <div className="flex-1 space-y-6 mx-auto w-full max-w-4xl"> {/* Центрируем посты */}
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            ref={(el) => (postsRef.current[index] = el)} // Сохраняем рефы для постов
                            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-between ${
                                activePostId === post.id ? 'border-l-4 border-blue-600' : ''
                            }`}
                        >
                            {/* Контент поста */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                                <p className="text-gray-700 mb-4">{post.summary}</p>
                            </div>

                            {/* Время, выровненное справа */}
                            <div
                                className={`flex-shrink-0 ml-4 text-sm text-gray-500 p-2 rounded-lg transition-all duration-300 ease-in-out ${
                                    activePostId === post.id ? 'bg-blue-600 text-white' : 'bg-gray-300'
                                }`}
                            >
                                {new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
