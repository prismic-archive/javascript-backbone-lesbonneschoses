define([
  'jquery',
  'underscore',
  'backbone',
  'prismic',
  'prismic-helper',
  'prismic-configuration',
  'templates',
  'animations',
  'numeral',
  'catslider'
], 
function($, _, Backbone, Prismic, Helpers, Configuration, Templates, Animations, Numeral, xxx) {

  /** For a better organization, used by several pages **/
  var categories = {
    "Macaron": "Macarons",
    "Cupcake": "Cup Cakes",
    "Pie": "Little Pies"
  };

  var AppRouter = Backbone.Router.extend({

    /** Routes **/
    routes: {
      '(~:ref)'                        : 'home',
      'products(~:ref)'                : 'products',
      'products(~:ref)/:id/:slug'      : 'productDetail',

      // OAuth
      'signin'                         : 'signin',
      'auth_callback/#*data'           : 'authCallback'

    },

    /** Home page **/
    home: Helpers.prismicRoute(function(ctx) {

      Animations.loadPage('home', function(html) {

        // Query the `products` collection
        ctx.api.forms('products').ref(ctx.ref).submit(function(products) {

          // Query the `featured` collection
          ctx.api.forms('featured').ref(ctx.ref).submit(function(featured) {

            // Update the page using the `Home` template
            html(

              Templates.Home({
                categories: categories,
                products: products,
                featured: featured,
                numeral: Numeral,
                ctx: ctx
              }),

              // Initialize the caroussel
              function() {
                $('#home #caroussel').catslider();
              }
            );

          });
        });

      });

    }),

    /** Products list **/
    products: Helpers.prismicRoute(function(ctx) {

      Animations.loadPage('products', function(html) {

        // Query the `products` collection
        ctx.api.forms('products').ref(ctx.ref).submit(function(products) {
          
          // Update the page using the `Products` template
          html(

            Templates.Products({
              categories: categories,
              products: products,
              numeral: Numeral,
              ctx: ctx
            }),

            // Fix the catalog height for a better animation
            function() {
              $('#catalog').css('height', (Math.ceil($('#catalog ul li').size() / 5) + 1) * 200 + 170)
            }
          );

        });

      });

    }),

    /** Product detail **/
    productDetail: Helpers.prismicRoute(function(ctx, id, slug) {

      Animations.loadPage('product', function(html) {

        // Get the document by Id
        Helpers.getDocument(ctx, id, function(product) {

          if(product) {

            // Retrieve the related products
            Helpers.getDocuments(ctx,

              // Get all related product ids
              _.chain(product.getAll('product.related').map(function(link) {
                if(link.document.type == "product" && !link.isBroken) {
                  return link.document.id;
                }
              }).filter(function(link) { return link; })).value(), 

              // Then
              function(relatedProducts) {

                // Update the page using the `ProductDetail` template
                html(
                  Templates.ProductDetail({
                    categories: categories,
                    product: product,
                    relatedProducts: relatedProducts,
                    numeral: Numeral,
                    ctx: ctx
                  })
                );

              }

            );

          } else {


          }

        });

      });

    }),

    // -- OAUTH

    /** Sigin to preview changes **/
    signin: function() {

      // Retrieve the prismic API
      Helpers.getApiHome(function(Api) {
        document.location =
          Api.data.oauthInitiate + 
          '?response_type=token' +
          '&client_id=' + encodeURIComponent(Configuration['clientId']) +
          '&redirect_uri=' + encodeURIComponent(document.location.href.replace(/#.*/, '') + '#auth_callback/') +
          '&scope=' + encodeURIComponent('master+releases');
      });

    },

    /** OAuth callback **/
    authCallback: function(data) {
      var data = _.chain(data.split('&')).map(function(params) {
          var p = params.split('=');
          return [p[0], decodeURIComponent(p[1])];
        })
        .object()
        .value();

      Helpers.saveAccessTokenInSession(data['access_token']);
      
      // Reload
      document.location = document.location.href.replace(/#.*/, '')
    }

  });

  /** Preview toolbar **/
  var PreviewToolbar = Backbone.View.extend({

    events: {
      "change #selectRef select" :          "changeRef",
      "submit #signout" :                   "signout"
    },

    changeRef: function(e) {
      e.preventDefault();
      var newRef = this.$el.find('select').val();
      document.location = document.location.href.replace(/#.*/, '') + (newRef ? '#~' + newRef : '#');
      document.location.reload();
    },

    signout: function(e) {
      e.preventDefault();
      Helpers.saveAccessTokenInSession(null);
      document.location = document.location.href.replace(/#.*/, '');
    }

  })

  return {
    run: function() {

      var app = new AppRouter();

      /** Called on first route to init the layout **/
      Helpers.setupLayout(app, function(ctx) {

        $(document.body).html(
          Templates.MainLayout({
            ctx: ctx
          })
        );

        new PreviewToolbar({ el: $('#toolbar') });

      });

      return Backbone.history.start();
    }
  };

});