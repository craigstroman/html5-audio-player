export default class Player {
  constructor(audio, playerButtons, progressBar, playListRows, trackInfoBox) {
    this.audio = audio;
    this.playerButtons = playerButtons;
    this.largeToggleBtn = playerButtons.largeToggleBtn;
    this.nextTrackBtn = playerButtons.nextTrackBtn;
    this.previousTrackBtn = playerButtons.previousTrackBtn;
    this.smallToggleBtn = playerButtons.smallToggleBtn;
    this.progressBar = progressBar;
    this.playListRows = playListRows;
    this.trackInfoBox = trackInfoBox;
    this.playAhead = false;
    this.progressCounter = 0;
    this.trackLoaded = false;
    this.currentTrack = 0;
    this.isAudioPlaying = false;
    this.offSet = 0;
  }

  initPlayer() {
    const playListRowsCount = this.playListRows.length;

    for (let i = 0; i < playListRowsCount; i = i + 1) {
      //Small toggle button clicked
      this.smallToggleBtn[i].addEventListener('click', (e) => {
        e.preventDefault();
        const selectedTrack = parseInt(this.parentNode.getAttribute('data-track-row'));

        if (selectedTrack !== this.currentTrack) {
          this.currentTrack = 0;
          this.trackLoaded = false;
        }

        if (this.trackLoaded === false) {
          this.currentTrack = selectedTrack;
          this.setTrack();
        } else {
          this.resetPlayStatus();
          this.playback();
        }
      });

      const playListLink = this.playListRows[i].children[2].children[0];

      //Playlist link clicked.
      playListLink.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          const selectedTrack = parseInt(playListLink.parentNode.parentNode.getAttribute('data-track-row'));

          if (selectedTrack !== this.currentTrack) {
            this.currentTrack = 0;
            this.trackLoaded = false;
          }

          this.currentTrack = selectedTrack;
          this.isAudioPlaying = true;
          this.setTrack();
          this.resetPlayStatus();
          this.playback();
        },
        false,
      );
    }

    // Large toggle button clicked
    this.largeToggleBtn.addEventListener('click', (e) => {
      if (this.trackLoaded === false) {
        this.currentTrack = 1;
        this.setTrack();
      } else {
        this.playback();
      }
    });

    // Next track button clicked
    this.nextTrackBtn.addEventListener('click', (e) => {
      if (this.nextTrackBtn.disabled !== true) {
        this.playListRows.forEach((el) => {
          el.classList.remove('active');
        });
        this.currentTrack++;
        this.setTrack();
        this.resetPlayStatus();
        this.playback();
      }
    });

    // Previous button clicked
    this.previousTrackBtn.addEventListener('click', (e) => {
      if (this.previousTrackBtn.disabled !== true) {
        this.currentTrack = this.currentTrack > 1 ? this.currentTrack - 1 : 0;
        this.trackLoaded = false;
        this.setTrack();
        this.resetPlayStatus();
        this.playback();
      }
    });

    this.audio.addEventListener(
      'timeupdate',
      () => {
        this.trackTimeChanged();
      },
      false,
    );

    //Audio error.
    this.audio.addEventListener(
      'error',
      (e) => {
        const { target } = e;
        const { error } = target;
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            alert('You aborted the video playback.');
            break;
          case error.MEDIA_ERR_NETWORK:
            alert('A network error caused the audio download to fail.');
            break;
          case error.MEDIA_ERR_DECODE:
            alert(
              'The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.',
            );
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            alert(
              'The video audio not be loaded, either because the server or network failed or because the format is not supported.',
            );
            break;
          default:
            alert('An unknown error occurred.');
            break;
        }
        this.trackLoaded = false;
        this.resetPlayStatus();
      },
      false,
    );

    document.addEventListener(
      'keyup',
      (e) => {
        if (e.code === '32') {
          if (this.trackLoaded === false) {
            this.currentTrack = 1;
            this.setTrack();
          } else {
            this.playback();
          }
        }
      },
      false,
    );

    this.progressBar.addEventListener('click', (e) => this.moveProgressIndicator(e));

    //Audio track has ended playing.
    this.audio.addEventListener(
      'ended',
      (e) => {
        this.trackHasEnded();
      },
      false,
    );
  }

  playback() {
    if (!this.isAudioPlaying) {
      this.audio.play();
      this.isAudioPlaying = true;
      this.updatePlayStatus();
    } else {
      this.audio.pause();
      this.isAudioPlaying = false;
      this.updatePlayStatus();
    }
  }

  updatePlayStatus() {
    if (this.isAudioPlaying) {
      this.largeToggleBtn.children[0].className = 'large-pause-icon';
      this.smallToggleBtn[this.currentTrack - 1].children[0].className = 'small-pause-icon';
      this.progressBar.style = 'cursor: pointer';
    } else {
      this.largeToggleBtn.children[0].className = 'large-play-icon';
      this.smallToggleBtn[this.currentTrack - 1].children[0].className = 'small-play-icon';
      this.progressBar.style = 'cursor: default';
    }

    if (this.currentTrack > 1) {
      this.previousTrackBtn.disabled = false;
    } else {
      this.previousTrackBtn.disabled = true;
    }
  }

  resetPlayStatus() {
    const smallToggleBtn = this.smallToggleBtn;
    const smallToggleBtnLength = smallToggleBtn.length;

    this.largeToggleBtn.children[0].className = 'large-play-icon';

    for (let i = 0; i < smallToggleBtnLength; i = i + 1) {
      if (smallToggleBtn[i].children[0].className === 'small-pause-icon') {
        smallToggleBtn[i].children[0].className = 'small-play-icon';
      }
    }
  }

  setTrack() {
    const audioTrack = this.audio.children[this.currentTrack - 1];

    const songURL = audioTrack.src;

    this.audio.setAttribute('src', songURL);
    this.audio.load();
    this.trackLoaded = true;
    this.trackInfoBox.style.visibility = 'visible';

    this.setTrackTitle();

    this.setActiveItem();

    this.playback();
  }

  setTrackTitle() {
    const trackTitleBox = document.querySelector('.player .info-box .track-info-box .track-title-text');
    const track = this.playListRows[this.currentTrack - 1].children[2];
    const trackTitle = track.outerText;

    this.playListRows.forEach((el) => {
      el.classList.remove('active');
    });

    this.playListRows[this.currentTrack - 1].classList.add('active');

    if (trackTitleBox) {
      trackTitleBox.innerHTML = '';

      trackTitleBox.innerHTML = trackTitle;
    }

    document.title = trackTitle;
  }

  setActiveItem() {
    const playListRowsLength = this.playListRows.length;

    for (let i = 0; i < playListRowsLength; i = i + 1) {
      this.playListRows[i].children[2].className = 'track-title';
    }

    this.playListRows[this.currentTrack].children[2].className = 'track-title active-track';
  }

  trackTimeChanged() {
    const currentTimeBox = document.querySelector(
      '.player .info-box .track-info-box .audio-time .current-time',
    );
    const durationBox = document.querySelector('.player .info-box .track-info-box .audio-time .duration');
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration;
    const trackCurrentTime = this.trackTime(currentTime);
    const trackDuration = this.trackTime(duration);

    if (currentTimeBox) {
      currentTimeBox.innerHTML = '';
      currentTimeBox.innerHTML = trackCurrentTime;
    }

    if (durationBox) {
      durationBox.innerHTML = '';
      durationBox.innerHTML = trackDuration;
    }

    this.updateProgressIndicator();
  }

  trackTime(seconds) {
    let min = 0;
    let sec = seconds >= 1 ? Math.floor(seconds) : 0;
    let time = '';

    min = Math.floor(sec / 60);

    sec = Math.floor(sec % 60);

    if (min >= 10) {
      time = min + ':' + sec;
    } else {
      time = '0' + min + ':' + sec;
    }

    if (sec >= 10) {
      time = min + ':' + sec;
    } else {
      time = min + ':0' + sec;
    }

    return time;
  }

  updateProgressIndicator() {
    let currentTime = parseFloat(this.audio.currentTime);
    let duration = parseFloat(this.audio.duration);
    let result = currentTime / duration;

    if (!isNaN(result) && this.isAudioPlaying) {
      this.progressBar.value = result;
    }
  }

  moveProgressIndicator(e) {
    let percent = e.offsetX / this.progressBar.offsetWidth;
    let duration = this.audio.duration;
    let newAudioTime = percent * duration;
    let progressBarResult = percent / 100;

    if (!isNaN(newAudioTime) && this.isAudioPlaying) {
      this.audio.currentTime = newAudioTime;
    }

    if (!isNaN(progressBarResult) && this.isAudioPlaying) {
      this.progressBar.value = progressBarResult;
    }
  }

  trackHasEnded() {
    this.currentTrack;
    this.currentTrack = this.currentTrack === this.playListRows.length ? 1 : this.currentTrack + 1;
    this.trackLoaded = false;

    this.resetPlayStatus();

    this.setTrack();
  }
}
