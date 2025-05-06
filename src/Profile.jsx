import React, { Component } from 'react';
import './App.css';

class Profile extends Component {
  render() {
    const artist = this.props.artist || {
      name: '',
      followers: { total: 0 },
      images: [{ url: '' }],
      genres: [],
      popularity: 0
    };

    return (
      <div className="profile">
        <img
          alt="Profile"
          className="profile-img"
          src={artist.images[0]?.url || 'https://via.placeholder.com/300'}
        />

        <div className="profile-info">
          <div className="profile-name">{artist.name}</div>
          <div className="profile-f">{artist.followers.total.toLocaleString()} followers</div>
          <div className="profile-p">Popularity: {artist.popularity}</div>

          <div className="profile-g">Genres:&nbsp;
            {artist.genres.length > 0 ? (
              artist.genres.map((genre, index) => (
                <span key={index}>
                  {index < artist.genres.length - 1 ? `${genre}, ` : `and ${genre}`}
                </span>
              ))
            ) : (
              <span>None listed</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
