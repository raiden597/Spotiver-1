import React, { useState, useEffect } from 'react';
import './App.css';
import { Form, InputGroup, Button, Spinner, Alert } from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';

// Debounce helper function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const App = () => {
  const [query, setQuery] = useState('');
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = process.env.REACT_APP_SPOTIFY_TOKEN;

  // Use debounced query to avoid frequent API calls while typing
  const debouncedQuery = useDebounce(query, 500);

  const search = async () => {
    if (!debouncedQuery) return;

    setLoading(true);
    setError('');

    const BASE_URL = 'https://api.spotify.com/v1/search?';
    const FETCH_URL = `${BASE_URL}q=${encodeURIComponent(debouncedQuery)}&type=artist&limit=1`;
    const ALBUM_URL = 'https://api.spotify.com/v1/artists/';

    try {
      const artistRes = await fetch(FETCH_URL, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      });

      if (!artistRes.ok) {
        throw new Error('Failed to fetch artist data.');
      }

      const artistJson = await artistRes.json();
      const foundArtist = artistJson.artists.items[0];

      if (!foundArtist) {
        setError('No artist found matching your search.');
        setArtist(null);
        setTracks([]);
        return;
      }

      setArtist(foundArtist);

      const tracksRes = await fetch(`${ALBUM_URL}${foundArtist.id}/top-tracks?country=US`, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      });

      if (!tracksRes.ok) {
        throw new Error('Failed to fetch tracks.');
      }

      const tracksJson = await tracksRes.json();

      setTracks(tracksJson.tracks);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search whenever debouncedQuery changes
  useEffect(() => {
    search();
  }, [debouncedQuery]);

  return (
    <div className="App">
      <h1 className="App-t">Spotiver</h1>

      <Form>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search for an Artist..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && search()}
          />
          <InputGroup.Append>
            <Button onClick={search} variant="outline-info">
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>

      {loading && <Spinner animation="border" className="mt-3" />}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {artist && (
        <>
          <Profile artist={artist} />
          {tracks.length > 0 ? (
            <Gallery tracks={tracks} />
          ) : (
            <Alert variant="info" className="mt-3">No tracks available for this artist.</Alert>
          )}
        </>
      )}
    </div>
  );
};

export default App;
