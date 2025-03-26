export const speakPosts = async (posts, setSpokenPosts, setHighlightedLines) => {
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
            const speech = new SpeechSynthesisUtterance(`${post.title}. ${post.summary}`);
            speech.lang = 'en-US';

            speech.onend = () => {
                resolve(post);
            };

            window.speechSynthesis.speak(speech);
        });
    };

    const processQueue = async () => {
        while (queue.length > 0) {
            const currentPost = queue.shift();

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

        setHighlightedLines(new Set());
    };

    await processQueue();
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
