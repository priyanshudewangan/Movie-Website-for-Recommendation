import React, { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/spinner.jsx';
import MovieCard  from './components/MovieCard.jsx';
import { useDebounce  }   from 'react-use';
import { updateSearchCount } from './adppwrite.js';


const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization : `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [movieList, setMovieList] = useState([])

  const [isLoading, setisLoading] = useState(false)
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('')

  useDebounce(()=> setdebouncedSearchTerm(searchTerm), 500, [searchTerm]) // Debounce meaning taking some time while you write the terms you want to search and then it will find the movie 

  const fetchMovies = async(query = '') => {

    setisLoading(true);
    setErrorMessage('');


    try{
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` // this ensures that the search term is safe to send as URL
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('failed to fetch movies');
      }

      const data = await response.json();

      if(data.response === 'false'){
        setErrorMessage(data.error || 'failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || [] )

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
    }
    catch(error){
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');

    }finally {
      setisLoading(false);
    }
  }

  useEffect(()=> {
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src = './hero.png' alt = "Hero Banner"></img>
            <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
          </header>

          <section className='all-movies'>
            <h2 className='mt-[20px]'>Movie List</h2>
            {isLoading ? (
              <Spinner/>
            ): errorMessage? (<p className='text-red-500'>{errorMessage}</p>

            ): (
                <ul>
                {movieList.map(movie => (
                  <MovieCard key = {movie.id} movie={movie}/>
                ))}
            </ul>)
          }
          </section>
          

      
      
        </div>
      </div>
    </main>
  )
}

export default App