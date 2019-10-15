document.addEventListener('DOMContentLoaded', function() {
  const btnNext = document.createElement('button');
  const btnPrev = document.createElement('button');
  const player = document.getElementById('player');
  const video = document.querySelector('#player .tpVideo');
  const controller = $pdk.controller;
  let flagMove = true;

  const fadeButtons = function() {
    flagMove = !flagMove;
    btnNext.classList.toggle('fade');
    btnPrev.classList.toggle('fade');
  };

  btnNext.setAttribute('id', 'btnNext');
  btnPrev.setAttribute('id', 'btnPrev');
  video.append(btnPrev, btnNext);

  btnNext.addEventListener('click', function() {
    controller.next(true);
  });

  btnPrev.addEventListener('click', function() {
    controller.previous(true);
  });

  // Fix for chrome.
  window.addEventListener('resize', function() {
    const playerHeight = video.clientHeight;
    btnNext.style.height = playerHeight + 'px';
    btnPrev.style.height = playerHeight + 'px';
  });

  video.addEventListener('mousemove', function() {
    if (flagMove) {
      fadeButtons();

      setTimeout(() => {
        fadeButtons();
      }, 3000);
    }
  });

  player.addEventListener('touchstart', function(e) {
    if (document.querySelector('#player .tpPlayerView').classList.contains('tpPlaying')) {
      e.preventDefault();
      $pdk.controller.pause(true);
    }
  });
});
