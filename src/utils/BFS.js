let currentSpeech = null;

export const speakPosts = async (posts, setSpokenPosts, setHighlightedLines, setIsSpeaking) => {
    console.log('speakPosts called');

    const sortedPosts = [...posts].sort((a, b) => a.time - b.time); // Сортировка по времени
    const postMap = sortedPosts.reduce((map, post) => {
        map[post.id] = post;
        return map;
    }, {});

    const visited = new Set();
    const queue = [];

    if (sortedPosts.length > 0) {
        queue.push(sortedPosts[0]); // Начинаем с самого раннего поста
    }

    const speakPost = (post) => {
        return new Promise((resolve) => {
            console.log(`Speaking post: ${post.id}`);

            // Сразу перед началом озвучивания выделяем точку
            setSpokenPosts(prev => new Set([...prev, post.id]));

            const speech = new SpeechSynthesisUtterance(`${post.title}.`);
            speech.lang = 'ru-RU';

            speech.onend = () => {
                console.log(`Finished speaking post: ${post.id}`);
                resolve(post);
            };

            currentSpeech = speech;
            window.speechSynthesis.speak(speech);
        });
    };


    const processQueue = async () => {
        console.log('Processing queue...');
        while (queue.length > 0) {
            const currentPost = queue.shift();

            if (!visited.has(currentPost.id)) {
                await speakPost(currentPost);
                visited.add(currentPost.id);

                // Добавляем в spokenPosts только после завершения озвучки
                setSpokenPosts(prev => new Set([...prev, currentPost.id]));

                currentPost.link.forEach((targetId) => {
                    const targetPost = postMap[targetId];
                    if (targetPost && !visited.has(targetPost.id)) {
                        queue.push(targetPost);
                    }
                });
            }
        }

        console.log('Finished processing queue');
        setHighlightedLines(new Set());
        setSpokenPosts(new Set());
        setIsSpeaking(false);
    };

    await processQueue();
};

export const pauseSpeaking = () => {
    if (currentSpeech) {
        console.log('Pausing speech');
        window.speechSynthesis.pause();
    }
};

export const resumeSpeaking = () => {
    if (currentSpeech) {
        console.log('Resuming speech');
        window.speechSynthesis.resume();
    }
};

export const stopSpeaking = () => {
    if (currentSpeech) {
        window.speechSynthesis.cancel();
    }
};
export const highlightConnections = (posts, spokenPosts) => {
    const highlightedLines = new Set();
    posts.forEach((fromPost) => {
        if (Array.isArray(fromPost.link)) {
            fromPost.link.forEach((targetId) => {
                const toPost = posts.find((post) => post.id === targetId);
                // Теперь подсвечиваем только если оба поста озвучены
                if (spokenPosts.has(fromPost.id) && spokenPosts.has(toPost.id)) {
                    highlightedLines.add(`${fromPost.id}-${toPost.id}`);
                }
            });
        }
    });

    return highlightedLines;
};
