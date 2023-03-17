const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }],
    })
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single product
router.get('/:id', async (req, res) => {
  const productGet = await Product.findOne({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
  },
    {
      where: {
        id: req.params.id
      }
    });
  return res.json(productGet);
});

// CREATE a new product  --> /api/products
router.post('/', (req, res) => {
  console.log("Body: ", req.body)
  console.log("tags: ", req.body.tagIds)

  Product.create(req.body)
    .then((product) => {
      console.log("DB Product: ", product)
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    /*  if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.dataValues.id,
            tag_id,
          };
        });
        console.log("Product Tags: ", productTagIdArr)
        return ProductTag.bulkCreate(productTagIdArr);
      }
      */
      // if no product tags, just respond
      /*if(!req.body.tagIds) {
        console.log("No tag Ids found...");
        res.status(200).json(product);
      } else {
        
        return productTagIdArr
      }
      */
      // if(req.body.tagIds.length == 0) {}
      const productData = product.dataValues;
      console.log("datavalues",productData);
      res.status(200).json(productData);
    })
  //  .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE a single product
router.put('/:id', (req, res) => {
  console.log("Parameters: ", req.params)

  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then( async(product) => {
      console.log("Product: ", product)
      // find all associated tags from ProductTag
      const tags = await  ProductTag.findAll({ where: { product_id: req.params.id } });
      console.log("Prod Tags: ", tags);
      const tagData = tags[0].dataValues.product_id;
      console.log("tagData", tagData)
      return tagData;
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// DELETE a single product
router.delete('/:id', async (req, res) => {
  try {
    const productDelete = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productDelete) {
      res.status(404).json({ message: 'No product with this id in the database!' });
      return;
    }
    res.status(200).json(productDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
