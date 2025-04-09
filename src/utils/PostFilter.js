class PostFilter {
    static filterBySearch(posts, query) {
        if (!query) return posts;
        return posts.filter(post => {
            const title = post.title || '';
            const summary = post.summary || '';
            return title.toLowerCase().includes(query.toLowerCase()) ||
                summary.toLowerCase().includes(query.toLowerCase());
        });
    }

    static filterByDate(posts, startDate, endDate) {
        return posts.filter(post => {
            const postDate = new Date(post.time);
            return (
                (!startDate || postDate >= new Date(startDate)) &&
                (!endDate || postDate <= new Date(endDate))
            );
        });
    }

    static filterByType(posts, type) {
        if (!type) return posts;
        return posts.filter(post => post.type === type);
    }

    static applyFilters(posts, query, start, end, type) {
        let result = this.filterBySearch(posts, query);
        result = this.filterByDate(result, start, end);
        result = this.filterByType(result, type);
        return result;
    }
    static filterByCluster(posts, clusterId) {
        if (clusterId === '' || clusterId === null || clusterId === undefined) return posts;
        return posts.filter(post => post.cluster_id === clusterId);
    }

    static applyFilters(posts, query, start, end, type, clusterId) {
        let result = this.filterBySearch(posts, query);
        result = this.filterByDate(result, start, end);
        result = this.filterByType(result, type);
        result = this.filterByCluster(result, clusterId);
        return result;
    }
}

export default PostFilter;
