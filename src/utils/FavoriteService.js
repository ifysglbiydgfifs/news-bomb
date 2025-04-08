class FavoriteService {
    static getFavorites() {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    static addFavorite(post) {
        return new Promise((resolve) => {
            resolve({ message: 'Post added to favorites' });
        });
    }

    static removeFavorite(postId) {
        return new Promise((resolve) => {
            resolve({ message: 'Post removed from favorites' });
        });
    }
}

export default FavoriteService;
