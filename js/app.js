define([
  'jquery',
  'underscore',
  'backbone',
  'prismic',
  'prismic-helper',
  'prismic-configuration',
  'toolbar',
  'templates',
  'animations',
  'numeral',
  'catslider'
], 
function($, _, Backbone, Prismic, Helpers, Configuration, PreviewToolbar, Templates, Animations, numeral, xxx) {

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
      'about(~:ref)'                   : 'about',
      'stores(~:ref)'                  : 'stores',
      'stores(~:ref)/:id/:slug'        : 'storeDetail',
      'jobs(~:ref)'                    : 'jobs',
      'jobs(~:ref)/:id/:slug'          : 'jobDetail',
      'selections(~:ref)/:id/:slug'    : 'selectionDetail',
      'flavours(~:ref)/*flavour'       : 'productsByFlavour',
      'search(~:ref)(/*query)'         : 'search',
      'not-found(~:ref)'               : 'notFound',

      // OAuth
      'signin'                         : 'signin',
      'auth_callback/#*data'           : 'authCallback'

    },

    /** Home page **/
    home: Helpers.prismicRoute(function(ctx) {

      Animations.loadPage('home', function(html) {

        // Query the `products` collection
        ctx.api.form('products').ref(ctx.ref).submit(function(products) {

          // Query the `featured` collection
          ctx.api.form('featured').ref(ctx.ref).submit(function(featured) {

            // Update the page using the `Home` template
            html(

              Templates.Home({
                categories: categories,
                products: products,
                featured: featured,
                numeral: numeral,
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
        ctx.api.form('products').ref(ctx.ref).submit(function(products) {
          
          // Update the page using the `Products` template
          html(

            Templates.Products({
              categories: categories,
              products: products,
              numeral: numeral,
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
                    numeral: numeral,
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

    /** About **/
    about: Helpers.prismicRoute(function(ctx) {

      Animations.loadPage('about', function(html) {

        // Get the bookmarked document
        Helpers.getBookmark(ctx, 'about', function(page) {

          // Update the page using the `About` template
          html(
            Templates.About({
              page: page,
              ctx: ctx
            })
          );

        });

      });

    }),

    /** Stores **/
    stores: Helpers.prismicRoute(function(ctx) {

      Animations.loadPage('stores', function(html) {

        // Get the bookmarked document
        Helpers.getBookmark(ctx, 'stores', function(page) {

          ctx.api.form('stores').ref(ctx.ref).submit(function(stores) {

            // Update the page using the `Stores` template
            html(
              Templates.Stores({
                page: page,
                stores: stores,
                ctx: ctx
              })
            );

          });

        });

      });

    }),

    /** Store detail **/
    storeDetail: Helpers.prismicRoute(function(ctx, id, slug) {

      Animations.loadPage('store', function(html) {

        // Get the document by Id
        Helpers.getDocument(ctx, id, function(store) {

          // Update the page using the `StoreDetail` template
          html(
            Templates.StoreDetail({
              store: store,
              ctx: ctx
            }),

            // Display Google map
            function() {
              var address = $('#store p.address').text();

              if(address) {
                new google.maps.Geocoder().geocode({'address': address}, function(results, status) {
                  if(results && results[0]) {

                    var location = results[0].geometry.location

                    var mapOptions = {
                      center: location,
                      zoom: 16,
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                    }

                    var map = new google.maps.Map(
                      document.getElementById("map-canvas"),
                      mapOptions
                    )

                    map.setOptions({styles: [
                      {
                        "featureType": "poi",
                        "stylers": [
                          { "saturation": -100 },
                          { "visibility": "off" }
                        ]
                      },{
                        "stylers": [
                          { "saturation": -100 }
                        ]
                      }
                    ]})

                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        title: 'Les Bonnes Choses'
                    })
                  }
                })
              }
            }
          );

        });

      }, '#stores');

    }),

    /** Jobs **/
    jobs: Helpers.prismicRoute(function(ctx) {

      Animations.loadPage('jobs', function(html) {

        // Get the bookmarked document
        Helpers.getBookmark(ctx, 'jobs', function(page) {

          ctx.api.form('jobs').ref(ctx.ref).submit(function(jobs) {

            // Update the page using the `Jobs` template
            html(
              Templates.Jobs({
                page: page,
                jobs: jobs,
                ctx: ctx
              })
            );

          });

        });

      });

    }),

    /** Job detail **/
    jobDetail: Helpers.prismicRoute(function(ctx, id, slug) {

      Animations.loadPage('job', function(html) {

        // Get the bookmarked document
        Helpers.getBookmark(ctx, 'jobs', function(page) {

          // Get the document by Id
          Helpers.getDocument(ctx, id, function(job) {

            // Update the page using the `JobDetail` template
            html(
              Templates.JobDetail({
                page: page,
                job: job,
                ctx: ctx
              })
            );

          });

        });

      }, '#jobs');

    }),

    /** Select detail **/
    selectionDetail: Helpers.prismicRoute(function(ctx, id, slug) {

      Animations.loadPage('selection', function(html) {

        // Get the document by Id
        Helpers.getDocument(ctx, id, function(selection) {

          if(selection) {

            // Retrieve the related products
            Helpers.getDocuments(ctx,

              // Get all related product ids
              _.chain(selection.getAll('selection.product').map(function(link) {
                if(link.document.type == "product" && !link.isBroken) {
                  return link.document.id;
                }
              }).filter(function(link) { return link; })).value(), 

              // Then
              function(products) {

                // Update the page using the `SelectionDetail` template
                html(
                  Templates.SelectionDetail({
                    categories: categories,
                    selection: selection,
                    products: products,
                    numeral: numeral,
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

    /** Products by flavour **/
    productsByFlavour: Helpers.prismicRoute(function(ctx, flavour) {

      var flavours = {
        "Chocolate"    : "All our pastries for the chocolate lovers",
        "Lemon/lime"   : "All our pastries with the sweet bitterness of lemon and lime",
        "Berries"      : "All our pastries with strawberry, raspberry, or any kind of berries",
        "Pistachio"    : "All our pastries with a salty taste of pistachio nuts",
        "Soft fruit"   : "All our pastries with various soft fruit",
        "Vanilla"      : "All our pastries for the vanilla addicts",
        "Caramel"      : "All our pastries with the pure sweetness of caramel",
        "Spice"        : "All our pastries with a spicy after-taste"
      };

      Animations.loadPage('products', function(html) {

        // Query the `products` collection
        ctx.api.form('everything').query('[[:d = at(my.product.flavour, "' + flavour + '")]]').ref(ctx.ref).submit(function(products) {

          // Update the page using the `Products` template
          html(

            Templates.Products({
              categories: categories,
              products: products,
              numeral: numeral,
              title: flavours[flavour],
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

    /** Search **/
    search: Helpers.prismicRoute(function(ctx, query) {

      var self = this,
          handleSearchForm = function() {

        $('#search form').submit(function(e) {
          e.preventDefault();
          var query = $('input[name=query]', this).val();
          self.navigate('search' + ctx.maybeRefParam + '/' + query, { trigger: true });
        });

        if(!query) $('#search form input[name=query]').focus();
      };

      Animations.loadPage('search', function(html) {

        if(query) {

          // Search products
          ctx.api.form('everything').query('[[:d = any(document.type, ["product", "selection"])][:d = fulltext(document, "' + query + '")]]').ref(ctx.ref).submit(function(products) {

            // Search others
            ctx.api.form('everything').query('[[:d = any(document.type, ["article", "blog-post", "job-offer", "store"])][:d = fulltext(document, "' + query + '")]]').ref(ctx.ref).submit(function(others) {

              // Update the page using the `Search` template
              html(

                Templates.Search({
                  query: query,
                  products: products,
                  others: others,
                  ctx: ctx
                }),

                handleSearchForm
              );

            });

          });

        } else {

          // Update the page using the `Search` template
          html(

            Templates.Search({
              query: '',
              ctx: ctx
            }),

            handleSearchForm
          );

        }

      });

    }),

    /** Page not found **/
    notFound: Helpers.prismicRoute(function(ctx) {

      Animations.loadPage('not-found', function(html) {

        // Page not found
        html(
          Templates.NotFound({
            ctx: ctx
          })
        );

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

        new PreviewToolbar({ el: $('#toolbar'), ctx: ctx });

      });

      return Backbone.history.start();
    }
  };

});