require.config({

  paths: {
    jquery: 'vendor/jquery-2.0.3.min',
    underscore: 'vendor/underscore-1.5.2.min',
    backbone: 'vendor/backbone-1.0.0.min',
    prismic: 'vendor/prismic.io-1.0.4.min',
    text: 'vendor/text-0.27.0.min',
    modernizr: 'vendor/modernizr-2.6.2.min',
    catslider: 'vendor/catslider',
    numeral: 'vendor/numeral-1.4.5.min',
    moment: 'vendor/moment-2.2.1.min'
  },

  shim: {
    catslider: {
      deps : ['modernizr']
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    prismic: {
      exports: 'Prismic'
    }
  }

});

require(['app', 'blog'], function(App, Blog) {
  if(document.location.pathname.indexOf('blog') > 0) {
    Blog.run();
  } else {
    App.run();
  }
});