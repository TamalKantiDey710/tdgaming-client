import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList';
import EditGame from './components/EditGame';
//import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path="/edit/:id" element={<EditGame />} />
        <Route path="/edit" element={<EditGame />} />
      </Routes>
    </Router>
  );
}


