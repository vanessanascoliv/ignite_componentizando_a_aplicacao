import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from './services/api';

interface MovieProps {
    imdbID: string;
    Title: string;
    Poster: string;
    Ratings: Array<{
      Source: string;
      Value: string;
    }>;
    Runtime: string;
  }
  
  interface GenreResponseProps {
    id: number;
    name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
    title: string;
  }
  interface MoviesProviderProps{
    children: ReactNode
  }

  interface MoviesContextData{
    genres:GenreResponseProps[];
    selectedGenre:GenreResponseProps
    selectedGenreId:number;
    handleClickButton:(id:number) => void;
    movies:MovieProps[]

  }

const MoviesContext = createContext({} as MoviesContextData )



export function MoviesProvider ({children}:MoviesProviderProps){
   
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);


  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []); 
  
  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);
  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
      <MoviesContext.Provider value = {{
          genres,
          selectedGenre,
          selectedGenreId,
          handleClickButton,
          movies

      }}>
          {children}
      </MoviesContext.Provider>
  )
}

export function useMovies(){
    const context = useContext(MoviesContext);

    return context
}