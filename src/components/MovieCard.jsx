import React from 'react'

const MovieCard = ({ movie }) => {
  const { title, vote_average, poster_path, release_date, original_language, id } = movie; //This is the new way which is called declustering 
  // In this we dont have to write movie.title or movie.release_date again and again we can just write the name and it will work.


  return (
    <div className='movie-card'>
        <img src = {poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}></img>
        
        <div className="mt-4">
            <h3>{title}</h3>

            <div className="content">
                <div className="rating">
                    <img src = "star.svg" ></img>
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>

                <span>&#8226;</span>
                <p className='lang' >{original_language}</p>

                <span>&#8226;</span>

                <p className='year'>{release_date  ?  release_date.split('-')[0]: 'N/A'}</p>
            </div>
        </div>
    </div>
  );
};

export default MovieCard