define([
  'jquery'
], function($) {

 var Helpers = {

    loadPage: function(id, htmlF) {
      if($('body > div.main').attr('id')) {
        return Helpers.scrollTop()
          .then(function() { 
            $('header nav a').removeClass('selected')
            return Helpers.fade()
          })
          .then(function() {
            htmlF(function(html, setup) {

              $('body > div.main').attr('data-to', id).delay(250).promise().then(
                function() {
                  $('body > div.main').attr('id', id).html(html).removeAttr('data-to')
                  // TODO $('header nav a[href="' + loaded.selected + '"]').addClass('selected')
                  if(setup) setup();
                  return html;
                }
              ).then(function() { 
                return Helpers.fade();
              });

            });

          })
          
      } else {
        htmlF(function(html, setup) {
          $('body > div.main').attr('id', id).html(html);
          if(setup) setup();
        });
      }
    },

    scrollTop: function() {
      return $(document.body).animate({scrollTop: 0}, Math.min(250, $(document.body).scrollTop())).promise()
    },

    fade: function() {
      var $el = $('body > div.main')
      return Helpers.defer(function() {
        return $el[$el.is('.fade') ? 'removeClass' : 'addClass']('fade').delay(250).promise()
      })
    },

    defer: function(f) {
      var p = $.Deferred()
      setTimeout(function() {
        f().then(function(x) { p.resolve(x) })
      },0)
      return p
    }

  };

  return Helpers;

});