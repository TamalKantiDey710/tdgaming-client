
import config from '../config';
import { VideoGame } from '../interfaces/VideoGame';

const API_URL = `${config.apiBaseUrl}/api/videogames`;

export const VideoGamesApi = {
    async getAll(): Promise<VideoGame[]> { //TODO: Add Filter
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch video games');
      return response.json();
    },
    async create(game: VideoGame): Promise<void>{  // TODO: return some response
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(game),
          });
          if (!response.ok) throw new Error('Failed to create game');
    },
    async getById(id: string): Promise<VideoGame> {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch video game');
        return response.json();
    },
    async update(id: string, game: VideoGame): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(game),
        });
        if (!response.ok) throw new Error('Failed to update game');
    }
};