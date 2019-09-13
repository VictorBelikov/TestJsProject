$(document).ready(function() {
  const $btnNext = $('<button id="btnNext"></button>');
  const $btnPrev = $('<button id="btnPrev"></button>');
  const $player = $('#player .tpVideo');
  const controller = $pdk.controller;
  let flagMove = true;

  $player.append($btnPrev, $btnNext);

  $btnNext.click(function() {
    controller.next(true);
  });

  $btnPrev.click(function() {
    controller.previous(true);
  });

  $player.mousemove(function() {
    if (flagMove) {
      flagMove = false;
      $btnNext.fadeIn('slow');
      $btnPrev.fadeIn('slow');

      setTimeout(() => {
        flagMove = true;
        $btnNext.fadeOut('slow');
        $btnPrev.fadeOut('slow');
      }, 3000);
    }
  });
});
