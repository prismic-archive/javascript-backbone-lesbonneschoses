define([
  'text!../templates/main.html',
  'text!../templates/home.html',
  'text!../templates/products.html',
  'text!../templates/productDetail.html',
  'text!../templates/about.html',
  'text!../templates/stores.html',
  'text!../templates/storeDetail.html',
  'text!../templates/jobs.html',
  'text!../templates/jobDetail.html',
  'text!../templates/selectionDetail.html',
  'text!../templates/search.html',
  'text!../templates/not-found.html',
  'text!../templates/blog.html',
  'text!../templates/posts.html',
  'text!../templates/postDetail.html'
], function(MainLayout, Home, Products, ProductDetail, About, Stores, StoreDetail, Jobs, JobDetail, SelectionDetail, Search, NotFound, BlogLayout, Posts, PostDetail) {
  
  return {
    MainLayout:         _.template(MainLayout),
    Home:               _.template(Home),
    Products:           _.template(Products),
    ProductDetail:      _.template(ProductDetail),
    About:              _.template(About),
    Stores:             _.template(Stores),
    StoreDetail:        _.template(StoreDetail),
    Jobs:               _.template(Jobs),
    JobDetail:          _.template(JobDetail),
    SelectionDetail:    _.template(SelectionDetail),
    Search:             _.template(Search),
    NotFound:           _.template(NotFound),
    BlogLayout:         _.template(BlogLayout),
    Posts:              _.template(Posts),
    PostDetail:         _.template(PostDetail)
  };

});