class FavoriteService {
    static async getFavorites() {
        const response = await fetch('http://localhost:3001/favorites');
        if (!response.ok) {
            throw new Error('Error fetching favorites');
        }
        return await response.json();
    }

    static async addFavorite(post) {
        const response = await fetch('http://localhost:3001/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });
        if (!response.ok) {
            throw new Error('Error adding favorite');
        }
    }

    static async removeFavorite(id) {
        const response = await fetch('http://localhost:3001/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error('Error removing favorite');
        }
    }
}

export default FavoriteService;
