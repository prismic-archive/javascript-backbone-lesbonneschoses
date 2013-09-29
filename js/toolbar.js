define(['backbone', 'prismic-helper'], function(Backbone, Helpers) {

  return Backbone.View.extend({

    events: {
      "change #selectRef select" :          "changeRef",
      "submit #signout" :                   "signout"
    },

    initialize: function(args) {
      if(args.ctx.oauth().hasPrivilegedAccess) {
        $(document.body).addClass('toolbar');
      }
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

});