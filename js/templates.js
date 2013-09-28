define([
  'text!../templates/main.html',
  'text!../templates/home.html',
  'text!../templates/products.html',
  'text!../templates/productDetail.html'
], function(MainLayout, Home, Products, ProductDetail) {
  
  return {
    MainLayout:     _.template(MainLayout),
    Home:           _.template(Home),
    Products:       _.template(Products),
    ProductDetail:  _.template(ProductDetail)
  };

});