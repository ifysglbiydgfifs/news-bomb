class PostFilter {
    static filterBySearch(posts, searchQuery) {
        if (!searchQuery) return posts;
        return posts.filter((post) => {
            return (
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.summary.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }

    static filterByDate(posts, startDate, endDate) {
        return posts.filter((post) => {
            const postDate = new Date(post.time);
            return (
                (startDate ? postDate >= new Date(startDate) : true) &&
                (endDate ? postDate <= new Date(endDate) : true)
            );
        });
    }

    static applyFilters(posts, searchQuery, startDate, endDate) {
        let filteredPosts = this.filterBySearch(posts, searchQuery);
        filteredPosts = this.filterByDate(filteredPosts, startDate, endDate);
        return filteredPosts;
    }
}

export default PostFilter;
