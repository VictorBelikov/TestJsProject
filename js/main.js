const iframe = document.getElementsByTagName('iframe')[0];
iframe.setAttribute('data-src', iframe.src);
iframe.classList.contains('').add('lazyload');
