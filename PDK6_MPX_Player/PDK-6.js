document.addEventListener('DOMContentLoaded', function() {
  const btnNext = document.createElement('button');
  const btnPrev = document.createElement('button');
  const player = document.querySelector('#player .tpVideo');
  const controller = $pdk.controller;
  let flagMove = true;

  const fadeButtons = function() {
    flagMove = !flagMove;
    btnNext.classList.toggle('fade');
    btnPrev.classList.toggle('fade');
  };

  const overButtons = function() {
    btnNext.classList.toggle('over');
    btnPrev.classList.toggle('over');
  };

  btnNext.setAttribute('id', 'btnNext');
  btnPrev.setAttribute('id', 'btnPrev');
  player.append(btnPrev, btnNext);

  btnNext.addEventListener('click', function() {
    controller.next(true);
  });

  btnPrev.addEventListener('click', function() {
    controller.previous(true);
  });

  btnNext.addEventListener('mouseover', overButtons);
  btnNext.addEventListener('mouseleave', overButtons);
  btnPrev.addEventListener('mouseover', overButtons);
  btnPrev.addEventListener('mouseleave', overButtons);

  player.addEventListener('mousemove', function() {
    if (flagMove) {
      fadeButtons();

      setTimeout(() => {
        fadeButtons();
      }, 3000);
    }
  });
});
