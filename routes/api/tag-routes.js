const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// GET all tag names and associated product and product tag
router.get('/', async (req, res) => {
   // find all products and include its associated Category and Tag data
  try {
    const tagData = await Tag.findAll({
      include: [ {model: Product, through: ProductTag}],
    })
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single tag
router.get('/:id', async (req, res) => {
  try {
    const getTag = await Tag.findByPk(req.params.id, {
      // JOIN with travellers, using the Trip through table
      include: [{ model: Product, through: ProductTag}]
    });

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
  try {
    const tagUpdate = await Tag.update({
      where: {
        id: req.params.id
    }
  });
  if (!tagUpdate) {
    res.status(404).json({ message: 'No tag data found with this id!' });
    return;
  }
  res.status(200).json(tagUpdate);
} catch (err) {
  res.status(500).json(err);
  }
});

// DELETE a tag by id value
router.delete('/:id', async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
