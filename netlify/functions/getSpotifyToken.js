// Use dynamic import for node-fetch
let fetch;
let FormData;
let Blob;

const loadDependencies = async () => {
  fetch = (await import('node-fetch')).default;
  FormData = (await import('formdata-polyfill')).FormData;
  Blob = (await import('fetch-blob')).Blob;
};

exports.handler = async function(event, context) {
  await loadDependencies(); // Ensure dependencies are loaded first
  
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: data.error_description || 'Failed to get token' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ access_token: data.access_token }),
  };
};
