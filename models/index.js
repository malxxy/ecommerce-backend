// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE', // When category is deleted, delete all the products
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'product_id',
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  foreignKey: 'product_id',
  // through table
  through: ProductTag,
});

// Tags belongToMany Products (through ProductTag)
Product.belongsToMany(ProductTag, {
  foreignKey: 'tag_id',
  through: ProductTag,
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
