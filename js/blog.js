define([
  'jquery',
  'underscore',
  'backbone',
  'prismic',
  'prismic-helper',
  'prismic-configuration',
  'animations',
  'toolbar',
  'templates',
  'moment'
], 
function($, _, Backbone, Prismic, Helpers, Configuration, Animations, PreviewToolbar, Templates, moment) {

  var BlogRouter = Backbone.Router.extend({

    /** Routes **/
    routes: {
      '(~:ref)'                         : 'posts',
      'categories(~:ref)/*category'     : 'posts',
      'posts(~:ref)/:id/:slug'          : 'postDetail',
    },

    /** Home page **/
    posts: Helpers.prismicRoute(function(ctx, category) {

      ctx.api.form('blog').ref(ctx.ref).query(category ? '[[:d = at(my.blog-post.category, "' + category + '")]]' : '').submit(function(posts) {

        $('.main').html(
          Templates.Posts({
            posts: posts,
            moment: moment,
            ctx: ctx
          })
        );

      });

    }),

    /** Post detail **/
    postDetail: Helpers.prismicRoute(function(ctx, id, slug) {

     Helpers.getDocument(ctx, id, function(post) {

       // Retrieve the related products
       Helpers.getDocuments(ctx,

         // Get all related product ids
         _.chain(post.getAll('blog-post.relatedproduct').map(function(link) {
           if(link.document.type == "product" && !link.isBroken) {
             return link.document.id;
           }
         }).filter(function(link) { return link; })).value(), 

         // Then
         function(relatedProducts) {

           // Retrieve the related posts
           Helpers.getDocuments(ctx,

             // Get all related product ids
             _.chain(post.getAll('blog-post.relatedpost').map(function(link) {
               if(link.document.type == "blog-post" && !link.isBroken) {
                 return link.document.id;
               }
             }).filter(function(link) { return link; })).value(), 

             // Then
             function(relatedPosts) {

               $('.main').html(
                 Templates.PostDetail({
                   post: post,
                   relatedProducts: relatedProducts,
                   relatedPosts: relatedPosts,
                   moment: moment,
                   ctx: ctx
                 })
               );            

             }

           );

         }

       );

     });

    })

  });

  return {
    run: function() {

      var blog = new BlogRouter();

      // -- Scroll on page change
      blog.on('route', Animations.scrollTop);

      /** Called on first route to init the layout **/
      Helpers.setupLayout(blog, function(ctx) {

        $(document.body).html(
          Templates.BlogLayout({
            ctx: ctx,
            categories: [
              "Announcements", 
              "Do it yourself", 
              "Behind the scenes"
            ]
          })
        );

        new PreviewToolbar({ el: $('#toolbar'), ctx: ctx });

      });

      return Backbone.history.start();
    }
  };

});