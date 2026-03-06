/* ============================================================
   Gallery Controller
   ============================================================ */

const Gallery = require('../models/Gallery');

exports.getAllImages = async (req, res, next) => {
  try {
    const { category } = req.query;
    const images = await Gallery.findAll({ category });
    const categories = await Gallery.getCategories();

    res.json({
      success: true,
      count: images.length,
      categories,
      data: images
    });
  } catch (err) {
    next(err);
  }
};
