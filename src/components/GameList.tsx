import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {VideoGamesApi} from  '../api/VideoGamesApi';
import {VideoGame} from '../interfaces/VideoGame';
import ListGroup from 'react-bootstrap/ListGroup';

export default function GameList() {
  const [games, setGames] = useState<VideoGame[]>([]);
  const [error,setError] = useState<string|null>(null);

  useEffect(() => {
    const loadGames = async () => {
        try {
          const data = await VideoGamesApi.getAll();
          setGames(data);
          setError(null);
        } catch (err: any) {
          setError(err.message || 'API Error');
        }
      };

      loadGames();
  }, []);

  return (
    <div className="container">
      <h2>Video Game Catalogue</h2>
      <ListGroup>
        {games.map((game: any) => (
          <ListGroup.Item key={game.id}>
            <div className="row">
                <div className="col-md-6">{game.title} - ${game.price}</div>
                <div className="col-md-6"><Link to={`/edit/${game.id}`}>Edit</Link></div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Link to="/edit">Create New Game</Link>
    </div>
  );
}
