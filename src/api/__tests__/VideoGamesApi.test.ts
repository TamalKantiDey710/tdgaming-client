import { VideoGamesApi } from '../VideoGamesApi';

global.fetch = jest.fn();

describe('VideoGamesApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches all games', async () => {
    const mockData = [{ id: '1', title: 'Game A', genre: 'Action', price: 10 }];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await VideoGamesApi.getAll();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/videogames'));
  });

  it('throws on failed fetch', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    await expect(VideoGamesApi.getAll()).rejects.toThrow('Failed to fetch video games');
  });
});
