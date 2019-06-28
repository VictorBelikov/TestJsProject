(function($) {
  if ($('#op-experience').length) {
    console.log('An Wyng embedded widget was found!');

    // Хотим воспользоваться событием lazybeforeunveil из библиотекм lazysizes.js
    $('#op-experience').addClass('lazyload').one('lazybeforeunveil', function(e) {

      // First, kill lazyloading in other Wyng widgets.
      $('#op-experience.lazyload').removeClass('lazyload').addClass('lazyloaded');

      console.log("'lazybeforeunveil' triggered! An Wyng widget is in view.");

      if (!('wyng' in window)) {
        console.log('Wyng JS is not loaded. Loading Wyng JS.');
        // Wyng
        var script = document.createElement('script');
        script.async = 'async';
        script.src = 'https://s3.amazonaws.com/com.offerpop.experiences.prod.static/js/campaign.js';
        document.head.appendChild(script);
      }
    });
  }

  if ($('.opinary-widget-embed').length) {
    console.log('An Opinary embedded widget was found!');

    $('.opinary-widget-embed').addClass('lazyload').one('lazybeforeunveil', function(e) {

      // First, kill lazyloading in other Opinary widgets.
      $('.opinary-widget-embed.lazyload').removeClass('lazyload').addClass('lazyloaded');

      console.log("'lazybeforeunveil' triggered! An Opinary widget is in view.");

      if (!('Opinary' in window)) {
        console.log('Opinary JS is not loaded. Loading Opinary JS.');
        // Load Opinary JS. This will render all opinary tags on page.
        var script = document.createElement('script');
        script.async = 'async';
        script.src = '//widgets.opinary.com/embed.js';
        document.head.appendChild(script);
      }
    });
  }
})(jQuery);