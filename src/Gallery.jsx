import React, { Component } from 'react';
import './App.css';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playingUrl: '',
      audio: null,
      playing: false
    };
  }

  playAudio(previewUrl) {
    // Check if previewUrl is available
    if (!previewUrl) {
      console.log("Preview URL not available");
      alert("Preview not available for this track.");
      return;
    }

    const { playing, playingUrl, audio } = this.state;

    if (!playing) {
      // No audio is playing, so start new audio
      const newAudio = new Audio(previewUrl);
      newAudio.play().catch((err) => {
        console.error('Error playing audio:', err);
        alert('Error playing audio. It might be blocked by CORS or unsupported format.');
      });

      this.setState({
        playingUrl: previewUrl,
        audio: newAudio,
        playing: true
      });
    } else {
      if (playingUrl === previewUrl) {
        // Same track is clicked, pause it
        audio.pause();
        this.setState({
          playingUrl: '',
          playing: false
        });
      } else {
        // Different track is clicked, stop current and play new one
        audio.pause();
        const newAudio = new Audio(previewUrl);
        newAudio.play().catch((err) => {
          console.error('Error playing audio:', err);
          alert('Error playing audio. It might be blocked by CORS or unsupported format.');
        });

        this.setState({
          playingUrl: previewUrl,
          audio: newAudio,
          playing: true
        });
      }
    }
  }

  render() {
    const { tracks } = this.props;
    console.log('tracks-array:', tracks);

    return (
      <div className="gallery-container">
        {tracks.map((track, k) => {
          const trackImg = track.album.images[0]?.url;
          return (
            <div key={k} className="track" onClick={() => this.playAudio(track.preview_url)}>
              <img src={trackImg} className="track-img" alt="track" />
              <div className="track-play">
                <div className="track-play-inner">
                  {this.state.playingUrl === track.preview_url ? (
                    <span>&#10073;&#10073;</span> // Pause icon
                  ) : (
                    <span>&#9655;</span> // Play icon
                  )}
                </div>
              </div>
              <p className="track-text">{track.name}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Gallery;
