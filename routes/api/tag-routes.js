const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// GET all tag names and associated product and product tag
router.get('/', (req, res) => {
   Tag.findAll({
    include: [
      {
        model: Product,
        through: ProductTag,
      },
    ],
   })
   .then((tags) => res.status(200).json(tags))
   .catch((err) => res.status(500).json(err));
});

// GET a single tag
router.get('/:id', async (req, res) => {
  try {
    const getTag = await Tag.findOne(
      { id: req.params.id },
      {
        include: [{ model: Product, through: ProductTag}]
      }
    );

  if (!getTag) {
    res.status(404).json({ message: 'No tag data found with this id!' });
    return;
  }
  res.status(200).json(getTag);
} catch (err) {
  res.status(500).json(err);
  }
});

// CREATE a new tag
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE a tag name by id value
router.put('/:id', async (req, res) => {
  const tagUpdate = await Product.update({
    tag_name: req.body.tag_name,
  },
  {
    where: {
      id: req.params.id
    }
  });
  return res.json(tagUpdate);
});

// DELETE a tag by id value
router.delete('/:id', async (req, res) => {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tag) {
      res.status(404).json({ message: 'No tag data found with this id!' });
      return;
    } 
    res.status(200).json(tag);
});

module.exports = router;
