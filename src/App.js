import React, { useEffect, useState } from 'react';
import Chart from './Chart';

function App() {
    const [posts, setPosts] = useState([]);
    const [firstPostTime, setFirstPostTime] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/posts')
            .then((response) => response.json())
            .then((data) => {
                const formattedPosts = data.map((post) => ({
                    ...post,
                    time: new Date(post.time).getTime(),
                }));
                setPosts(formattedPosts);
                if (formattedPosts.length > 0) {
                    setFirstPostTime(formattedPosts[0].time);
                }
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Новостная бомба</h1>
            <Chart posts={posts} firstPostTime={firstPostTime} />
        </div>
    );
}

export default App;
