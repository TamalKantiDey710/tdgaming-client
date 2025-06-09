import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditGame from '../EditGame';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../../api/VideoGamesApi', () => ({
  VideoGamesApi: {
    getById: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
}));

describe('EditGame Component', () => {
  const mockNavigate = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: '123' }),
    useNavigate: () => mockNavigate,
  }));

  const setup = (id?: string) => {
    return render(
      <MemoryRouter initialEntries={[id ? `/edit/${id}` : '/edit']}>
        <Routes>
          <Route path="/edit/:id" element={<EditGame />} />
          <Route path="/edit" element={<EditGame />} />
        </Routes>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders create mode UI if no ID', () => {
    setup();
    expect(screen.getByText(/create game/i)).toBeInTheDocument();
  });

  it('renders edit mode and fetches game if ID is present', async () => {
    const { VideoGamesApi } = require('../../api/VideoGamesApi');
    VideoGamesApi.getById.mockResolvedValue({ title: 'Zelda', price: 49.99 });

    setup('123');

    await waitFor(() => {
      expect(VideoGamesApi.getById).toHaveBeenCalledWith('123');
    });

    expect(screen.getByDisplayValue('Zelda')).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty', async () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText('Required')).toBeInTheDocument();
    expect(screen.getByText('Price is required')).toBeInTheDocument();
  });

  it('submits the form and calls create when no id', async () => {
    const { VideoGamesApi } = require('../../api/VideoGamesApi');

    setup();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'FIFA' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '59.99' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(VideoGamesApi.create).toHaveBeenCalledWith({
        title: 'FIFA',
        price: 59.99,
      });
    });
  });

  it('submits the form and calls update when id is present', async () => {
    const { VideoGamesApi } = require('../../api/VideoGamesApi');
    VideoGamesApi.getById.mockResolvedValue({ title: 'Mario', price: 39.99 });

    setup('123');

    await waitFor(() => {
      expect(VideoGamesApi.getById).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '49.99' },
    });

    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(VideoGamesApi.update).toHaveBeenCalledWith('123', {
        title: 'Mario',
        price: 49.99,
      });
    });
  });

  it('displays error if fetch fails', async () => {
    const { VideoGamesApi } = require('../../api/VideoGamesApi');
    VideoGamesApi.getById.mockRejectedValue(new Error('Game not found'));

    setup('999');

    expect(await screen.findByText('Game not found')).toBeInTheDocument();
  });
});
