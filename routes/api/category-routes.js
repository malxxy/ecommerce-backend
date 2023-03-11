const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET all categories
router.get('/', async (req, res) => {
  // find all categories 
  // be sure to include its associated Products
  const categoryData = await Category.findAll({
    include: [{ model: Product }],
  });
  return res.json(categoryData);
});

// GET a single category
router.get('/:id', async (req, res) => {
  const categoryIdData = await Category.findByPk(req.params.id, {
    include: [{ model: Product}]
  });
  return res.json(categoryIdData);
});

// CREATE a new category
router.post('/', async (req, res) => {
  const categoryPost = await Category.create(req.body);
  return res.json(categoryPost);
});

// UPDATE a single category
router.put('/:id', async (req, res) => {
  const categoryUpdate = await Category.update({
    category_name: req.body.category_name,
  },
  {
    where: {
      id: req.params.id
    }
  });
  return res.json(categoryUpdate);
});

// DELETE a category
router.delete('/:id', async (req, res) => {
  const categoryDestroy = await Category.destroy({
    category_name: req.body.category_name,
  },
  {
    where: {
      id: req.params.id
    }
  });
  return res.json(categoryDestroy);
});

module.exports = router;
