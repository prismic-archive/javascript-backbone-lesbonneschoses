define(function() {
  
  /** Prismic Configuration **/
  return {

    apiEndpoint: 'https://lesbonneschoses.prismic.io/api',

    // -- Access token if the Master is not open
    // accessToken: 'xxxxxx',

    // OAuth
    clientId: 'UgOwo9_mqQEGd6gl',
    clientSecret: '3e88a047c8cdc13d0042a7a7e612db9e',

    // -- Links resolution rules
    linkResolver: function(ctx, doc, isBroken) {

      if(doc.id == ctx.api.bookmarks['about']) {
        return '#about' + ctx.maybeRefParam;
      }

      if(doc.id == ctx.api.bookmarks['jobs']) {
        return '#jobs' + ctx.maybeRefParam;
      }

      if(doc.id == ctx.api.bookmarks['stores']) {
        return '#stores' + ctx.maybeRefParam;
      }

      if(doc.type == 'store' && !isBroken) {
        return '#stores' + ctx.maybeRefParam + '/' + doc.id + '/' + doc.slug;
      }

      if(doc.type == 'product' && !isBroken) {
        return '#products' + ctx.maybeRefParam + '/' + doc.id + '/' + doc.slug;
      }

      if(doc.type == 'job-offer' && !isBroken) {
        return '#jobs' + ctx.maybeRefParam + '/' + doc.id + '/' + doc.slug;
      }

      if(doc.type == 'blog-post' && !isBroken) {
        return '/blog.html#posts' + ctx.maybeRefParam + '/' + doc.id + '/' + doc.slug;
      }

      return '#not-found';
    }

  };

});