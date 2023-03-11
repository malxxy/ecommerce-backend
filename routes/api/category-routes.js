const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
router.get('/', async (req, res) => {
  // find all categories
  const categoryData = await Category.findAll();
  return res.json(categoryData);
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  const categoryIdData = await Category.findByPk(req.params.id);
  return res.json(categoryIdData);
});

router.post('/', async (req, res) => {
  const categoryPost = await Category.create(req.body);
  return res.json(categoryPost);
});

router.put('/:id', async (req, res) => {
  const categoryUpdate = await Category.update({
    category_name: req.body.category_name,
  },
  {
    where: {
      id: req.body.id
    }
  });
  return res.json(categoryUpdate);
});

router.delete('/:id', async (req, res) => {
  const categoryDestroy = await Category.destroy({
    category_name: req.body.category_name,
  },
  {
    where: {
      id: req.body.id
    }
  });
  return res.json(categoryDestroy);
});

module.exports = router;
