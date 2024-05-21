import { Player } from './player/player';

const audio = document.getElementById('audio');

const playerButtons = {
  nextTrackBtn: document.querySelector('.next-track-btn'),
  largeToggleBtn: document.querySelector('.large-toggle-btn'),
  previousTrackBtn: document.querySelector('.previous-track-btn'),
  smallToggleBtn: document.querySelectorAll('button.small-toggle-btn'),
};

const progressBar = document.querySelector('.progress-bar');

const playListRows = document.querySelectorAll('div.play-list-row');

const trackInfoBox = document.querySelector('.track-info-box');

const player = new Player(audio, playerButtons, progressBar, playListRows, trackInfoBox);

player.initPlayer();
