import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getByName, getGames } from '../../redux/actions';
import React from 'react';
import './home.css';
import Navbar from '../../components/NavBar/navbar';
import Cards from '../../components/Cards/cards';
import { useState } from 'react';
import { getGenres } from '../../redux/actions';

function Home() {
  const dispatch = useDispatch();
  const allGames = useSelector((state) => state.allGames);
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const genres = useSelector((state) => state.genres);

 
  const [filters, setFilters] = useState({
    genre: '',
    source: '',
    sortBy: '',
    order: 'asc',
  });
// filtro con el back

function handleChange(e) {
   e.preventDefault();
   setSearchString(e.target.value);
  }

  function handleSubmit(e){
e.preventDefault();
dispatch(getByName(searchString));
  }


  // function loadMoreGames() {   //////////// aca podria ponerlo si no quisiera limitar el paginado de 100
  //   setCurrentPage((prevPage) => prevPage + 1);
  //   dispatch(getGames(currentPage + 1));
  // }
  function handleLoadMore() {
    if (currentPage < 5) {
      setCurrentPage((prevPage) => prevPage + 1);
      dispatch(getGames(currentPage + 1));
    }
  }

  function handleLoadPrevious() {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      dispatch(getGames(currentPage - 1));
    }
  }

  function updateGameGenres(gameId, genres) {
    const updatedGames = allGames.map((game) => {
      if (game.id === gameId || game.gameId === gameId) {
        return {
          ...game,
          genres: genres,
        };
      }
      return game;
    });    
  }
  
  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  }
  function filterByGenre(games) {
    if (!filters.genre) return games;
    return games.filter((game) => {
      if (game.genres) {
        return game.genres.some((genre) => genre.name === filters.genre || genre === filters.genre);
      }
      return false;
    });
  }
  function normalizeGames(games) {
    return games.map((game) => {
      if (game.hasOwnProperty('createdAt')) {
        return {
          ...game,
          source: 'db',
        };
      } else {
        return {
          ...game,
          source: 'api',
        };
      }
    });
  }
  
  function filterBySource(games) {
    if (!filters.source) return games;
    return games.filter((game) => game.source === filters.source);
  }
  
  function sortGames(games) {
    if (!filters.sortBy) return games;
    const field = filters.sortBy === 'alphabetical' ? 'name' : 'rating';
    const order = filters.order === 'asc' ? 1 : -1;
    return games.sort((a, b) => {
      if (a[field] < b[field]) {
        return -1 * order;
      }
      if (a[field] > b[field]) {
        return 1 * order;
      }
      return 0;
    });
  }
  
///////////// los false los uso para poder decirle al redux que no fuerce una nueva busqueda
  useEffect(() => {
    dispatch(getGames(1, false)); 
  }, [dispatch]);

  useEffect(() => {
    dispatch(getGenres(false));  
  }, [dispatch]);

  const filteredAndSortedGames = sortGames(filterBySource(filterByGenre(normalizeGames(allGames))));
  console.log('Filtered and sorted games:', filteredAndSortedGames);


  return (
    <div className="home">
      <h2 className="home-title">VideoGames Realm</h2>
      <form>
      <label htmlFor="genre">Genre: </label>
      <select name="genre" id="genre" value={filters.genre} onChange={handleFilterChange}>
  <option value="">Genre</option>
  {genres.map((genre) => (
    <option key={genre.id} value={genre.name}>
      {genre.name}
    </option>
        ))}
      </select>

      <label htmlFor="source">Source: </label>
      <select name="source" id="source" value={filters.source} onChange={handleFilterChange}>
        <option value="">Source</option>
        <option value="api">API</option>
        <option value="db">Database</option>
      </select>

      <label htmlFor="sortBy">Sort by: </label>
      <select name="sortBy" id="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
        <option value="">Alph/Rating</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="rating">Rating</option>
      </select>

      <label htmlFor="order">Order: </label>
      <select name="order" id="order" value={filters.order} onChange={handleFilterChange}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </form>
      <div className="pagination-buttons">
        {currentPage > 1 && (
          <button className="load-previous" onClick={handleLoadPrevious}>
            Previous page
          </button>
        )}
        {currentPage < 5 && (
          <button className="load-more" onClick={handleLoadMore}>
            Load more games
          </button>
        )}
      </div>
      <Navbar handleChange={handleChange} handleSubmit={handleSubmit} />
      <Cards allGames={filteredAndSortedGames} updateGameGenres={updateGameGenres} />
    </div>
  );

  
}

export default Home;