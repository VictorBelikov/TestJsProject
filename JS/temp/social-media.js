/**
 * @file
 * Behavior used to enable some social media libs.
 * syfy_social.module
 */

(function($, Drupal) {

  // Add some Facebook libs.
  if (typeof window.FB == 'undefined') {
    window.fbAsyncInit = function() {
      window.FB.init({                    // called after Drupal.behaviours via <script src="//connect.facebook.net/en_US/sdk.js" />
        xfbml: true,
        version: 'v2.3',
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      if (typeof fjs !== 'undefined' && typeof fjs.parentNode !== 'undefined') {
        fjs.parentNode.insertBefore(js, fjs);
      } else {
        d.head.appendChild(js);
      }
    }(document, 'script', 'facebook-jssdk'));
  }

  // Add some Twitter libs.
  // https://dev.twitter.com/web/javascript/loading
  if (typeof window.twttr == 'undefined') {
    window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = '//platform.twitter.com/widgets.js';
      if (typeof fjs !== 'undefined' && typeof fjs.parentNode !== 'undefined') {
        fjs.parentNode.insertBefore(js, fjs);
      } else {
        d.head.appendChild(js);
      }

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    }(document, 'script', 'twitter-wjs'));
  }

  Drupal.behaviors.SocialMedia = {
    _getPlaceholder: function($el) {
      // @TODO: move image src to config
      return '<img alt="&lt;--social-media--&gt;" class="pub_blog_post-social drupal-content" data-social-option="' + $el.data('socialOption') + '" data-social-value="' + $el.data('socialValue') + '" src="/sites/syfy/modules/custom/syfy_social/plugins/wysiwyg/social/images/social_loading.png" title="&lt;--social-media--&gt;" />';
    },
    _getWrapper: function($el) {
      return '<div class="social-media-processed" data-social-option="' + $el.data('socialOption') + '" data-social-value="' + $el.data('socialValue') + '"></div>';
    },

    attach: function(context, settings) {
      var self = this;

      /////////////////////////////////////////////
      // Act on facebook embeds, when lib ready. //
      /////////////////////////////////////////////

      // if ($('img[data-social-option=fb]:not(.social-media-processed)', context).length) {
      //   $('img[data-social-option=fb]:not(.social-media-processed)', context)
      //     .addClass('lazyload')
      //     .one('lazybeforeunveil', function(e) {
      //       $('img[data-social-option=fb].lazyload', context)
      //         .removeClass('lazyload')
      //         .addClass('lazyloaded')
      //         .each(function() {
      //           var $that = $(this);
      //           var $wrapper = $(self._getWrapper($that));
      //           $wrapper.append('<div class="fb-post" data-href="' + $(this).data('socialValue') + '"></div>');
      //           $that.replaceWith($wrapper);
      //         });
      //
      //       if (typeof window.FB !== 'undefined') {
      //         window.FB.init({
      //           xfbml: true,
      //           version: 'v2.3',
      //         });
      //       }
      //     });
      // }

      if ($('img[data-social-option=fb]:not(.social-media-processed)', context).length) {
        $('img[data-social-option=fb]:not(.social-media-processed)', context)
          .addClass('lazyload')
          .one('lazybeforeunveil', function(e) {
            var $that = $(this);
            $that.removeClass('lazyload').addClass('lazyloaded');

            var $wrapper = $(self._getWrapper($that));
            $wrapper.append('<div class="fb-post" data-href="' + $(this).data('socialValue') + '"></div>');
            $that.replaceWith($wrapper);

            if (typeof window.FB !== 'undefined') {
              window.FB.init({
                xfbml: true,
                version: 'v2.3',
              });
            }
          });
      }

      ////////////////////////////////////////////
      // Act on twitter embeds, when lib ready. //
      ////////////////////////////////////////////

      // if (typeof twttr !== 'undefined' && typeof twttr.ready === 'function') {
      //   twttr.ready(function(twttr) {
      //     if ($('img[data-social-option=tw]:not(.social-media-processed)', context).length) {
      //       $('img[data-social-option=tw]:not(.social-media-processed)', context)
      //         .addClass('lazyload')
      //         .one('lazybeforeunveil', function(e) {
      //           $('img[data-social-option=tw].lazyload', context)
      //             .removeClass('lazyload')
      //             .addClass('lazyloaded')
      //             .each(function() {
      //               var $that = $(this);
      //               var value = $(this).data('socialValue').match(/\w*$/)[0];
      //
      //               if (!value) {
      //                 return;
      //               }
      //
      //               var $wrapper = $(self._getWrapper($that));
      //               $that.replaceWith($wrapper);
      //
      //               twttr.widgets.createTweet(value, $wrapper[0], {
      //                 conversation: 'none', // or all
      //                 cards: 'visible', // or hidden
      //                 linkColor: '#cc0000', // default is blue
      //                 theme: 'light', // or dark
      //               });
      //             });
      //         });
      //     }
      //   });
      // }
      if (typeof twttr !== 'undefined' && typeof twttr.ready === 'function') {
        twttr.ready(function(twttr) {
          if ($('img[data-social-option=tw]:not(.social-media-processed)', context).length) {
            $('img[data-social-option=tw]:not(.social-media-processed)', context)
              .addClass('lazyload')
              .one('lazybeforeunveil', function(e) {
                var $that = $(this);
                $that.removeClass('lazyload').addClass('lazyloaded');

                var value = $(this).data('socialValue').match(/\w*$/)[0];
                if (!value) return;

                var $wrapper = $(self._getWrapper($that));
                $that.replaceWith($wrapper);

                twttr.widgets.createTweet(value, $wrapper[0], {
                  conversation: 'none', // or all
                  cards: 'visible', // or hidden
                  linkColor: '#cc0000', // default is blue
                  theme: 'light', // or dark
                });
              });
          }
        });
      }

      //////////////////////////////
      // Act on instagram embeds. //
      //////////////////////////////

      // if ($('img[data-social-option=in]:not(.social-media-processed)', context).length) {
      //   $('img[data-social-option=in]:not(.social-media-processed)', context)
      //     .addClass('lazyload')
      //     .one('lazybeforeunveil', function(e) {
      //       $('img[data-social-option=in].lazyload', context)
      //         .removeClass('lazyload')
      //         .addClass('lazyloaded')
      //         .each(function() {
      //           var $that = $(this);
      //           $.ajax({
      //             type: 'GET',
      //             url: 'https://api.instagram.com/oembed?url=' + encodeURIComponent($that.data('socialValue')),
      //             success: function(data) {
      //               var $wrapper = $(self._getWrapper($that));
      //               var $data = $(data.html);
      //               $wrapper.append($data);
      //               $that.replaceWith($wrapper);
      //
      //               // Add some Instagram libs.
      //               (function(d, s, id) {
      //                 var js, fjs = d.getElementsByTagName(s)[0];
      //                 if (js = d.getElementById(id)) {
      //                   js.parentNode.removeChild(js);
      //                 }
      //                 js = d.createElement(s);
      //                 js.id = id;
      //                 js.src = '//platform.instagram.com/en_US/embeds.js';
      //                 if (typeof fjs !== 'undefined' && typeof fjs.parentNode !== 'undefined') {
      //                   fjs.parentNode.insertBefore(js, fjs);
      //                 } else {
      //                   d.head.appendChild(js);
      //                 }
      //               }(document, 'script', 'instagram'));
      //             },
      //             error: function(data) {
      //               console.info('AJAX error', data);
      //             },
      //           });
      //         });
      //     });
      // }
      if ($('img[data-social-option=in]:not(.social-media-processed)', context).length) {
        $('img[data-social-option=in]:not(.social-media-processed)', context)
          .addClass('lazyload')
          .one('lazybeforeunveil', function(e) {
            var $that = $(this);
            $that.removeClass('lazyload').addClass('lazyloaded');

            $.ajax({
              type: 'GET',
              url: 'https://api.instagram.com/oembed?url=' + encodeURIComponent($that.data('socialValue')),
              success: function(data) {
                var $wrapper = $(self._getWrapper($that));
                var $data = $(data.html);
                $wrapper.append($data);
                $that.replaceWith($wrapper);

                // Add some Instagram libs.
                (function(d, s, id) {
                  var js = d.getElementById(id),
                    fjs = d.getElementsByTagName(s)[0];

                  if (js) {
                    js.parentNode.removeChild(js);
                  }
                  js = d.createElement(s);
                  js.id = id;
                  js.src = '//platform.instagram.com/en_US/embeds.js';
                  if (typeof fjs !== 'undefined' && typeof fjs.parentNode !== 'undefined') {
                    fjs.parentNode.insertBefore(js, fjs);
                  } else {
                    d.head.appendChild(js);
                  }
                }(document, 'script', 'instagram'));
              },
              error: function(data) {
                console.info('AJAX error', data);
              },
            });
          });
      }

      //////////////////////////
      // Act on reddit embeds.//
      //////////////////////////

      // if ($('img[data-social-option=re]:not(.social-media-processed)', context).length) {
      //   $('img[data-social-option=re]:not(.social-media-processed)', context)
      //     .addClass('lazyload')
      //     .one('lazybeforeunveil', function(e) {
      //       $('img[data-social-option=re].lazyload', context)
      //         .removeClass('lazyload')
      //         .addClass('lazyloaded')
      //         .each(function() {
      //           var $that = $(this);
      //           var value = $that.data('socialValue');
      //
      //           if (!value) return;
      //
      //           var $wrapper = $(self._getWrapper($that));
      //           $that.replaceWith($wrapper);
      //           $wrapper.append('<blockquote class="reddit-card"><a href="' + value + '"></blockquote><s' + 'cript async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></s' + 'cript>');
      //         });
      //     });
      // }

      if ($('img[data-social-option=re]:not(.social-media-processed)', context).length) {
        $('img[data-social-option=re]:not(.social-media-processed)', context)
          .addClass('lazyload')
          .one('lazybeforeunveil', function(e) {
            var $that = $(this);
            $that.removeClass('lazyload').addClass('lazyloaded');

            var value = $that.data('socialValue');
            if (!value) return;

            var $wrapper = $(self._getWrapper($that));
            $that.replaceWith($wrapper);
            $wrapper.append('<blockquote class="reddit-card"><a href="' + value + '"></blockquote><s' + 'cript async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></s' + 'cript>');
          });
      }

      //////////////////////////
      // Act on tumblr embeds.//
      //////////////////////////

      // if ($('img[data-social-option=tu]:not(.social-media-processed)', context).length) {
      //   $('img[data-social-option=tu]:not(.social-media-processed)', context)
      //     .addClass('lazyload')
      //     .one('lazybeforeunveil', function(e) {
      //       $('img[data-social-option=tu].lazyload', context)
      //         .removeClass('lazyload')
      //         .addClass('lazyloaded')
      //         .each(function() {
      //           var $that = $(this);
      //           $.ajax({
      //             type: 'GET',
      //             url: '//www.tumblr.com/oembed/1.0?url=' + encodeURIComponent($that.data('socialValue')),
      //             crossDomain: true,
      //             headers: {
      //               'Access-Control-Allow-Methods': 'GET, POST, PUT',
      //             },
      //             dataType: 'jsonp',
      //             success: function(data) {
      //               var $wrapper = $(self._getWrapper($that));
      //               if (data.response !== undefined) {
      //                 var $data = $(data.response.html);
      //                 $wrapper.append($data);
      //               }
      //               $that.replaceWith($wrapper);
      //             },
      //           });
      //         });
      //     });
      // }

      if ($('img[data-social-option=tu]:not(.social-media-processed)', context).length) {
        $('img[data-social-option=tu]:not(.social-media-processed)', context)
          .addClass('lazyload')
          .one('lazybeforeunveil', function(e) {
            var $that = $(this);
            $that.removeClass('lazyload').addClass('lazyloaded');

            $.ajax({
              type: 'GET',
              url: '//www.tumblr.com/oembed/1.0?url=' + encodeURIComponent($that.data('socialValue')),
              crossDomain: true,
              headers: {
                'Access-Control-Allow-Methods': 'GET, POST, PUT',
              },
              dataType: 'jsonp',
              success: function(data) {
                var $wrapper = $(self._getWrapper($that));
                if (data.response !== undefined) {
                  var $data = $(data.response.html);
                  $wrapper.append($data);
                }
                $that.replaceWith($wrapper);
              },
            });
          });
      }
    },

    detach: function(context) {
      var self = this;
      $('.social-media-processed:not(body)', context).each(function() {
        $(this).replaceWith(self._getPlaceholder($(this)));
      });
      $('#fb-root', context).remove();
    },
  };
})(jQuery, Drupal);
