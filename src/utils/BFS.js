let currentSpeech = null;

export const speakPosts = async (posts, setSpokenPosts, setHighlightedLines, setIsSpeaking) => {
    console.log('speakPosts called');
    const postMap = posts.reduce((map, post) => {
        map[post.id] = post;
        return map;
    }, {});

    const visited = new Set();
    const queue = [];

    if (posts.length > 0) {
        queue.push(posts[0]);
    }

    const speakPost = (post) => {
        return new Promise((resolve) => {
            console.log(`Speaking post: ${post.id}`);
            const speech = new SpeechSynthesisUtterance(`${post.title}. ${post.summary}`);
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
            console.log('Processing post:', currentPost.id);

            if (!visited.has(currentPost.id)) {
                await speakPost(currentPost);
                visited.add(currentPost.id);

                setSpokenPosts(prev => new Set([...prev, currentPost.id]));

                currentPost.lineTo.forEach((targetId) => {
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
        fromPost.lineTo.forEach((targetId) => {
            const toPost = posts.find((post) => post.id === targetId);
            if (spokenPosts.has(fromPost.id) && spokenPosts.has(toPost.id)) {
                highlightedLines.add(`${fromPost.id}-${toPost.id}`);
            }
        });
    });

    return highlightedLines;
};