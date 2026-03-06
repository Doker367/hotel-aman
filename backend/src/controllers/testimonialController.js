/* ============================================================
   Testimonials Controller
   ============================================================ */

const Testimonial = require('../models/Testimonial');

exports.getAllTestimonials = async (req, res, next) => {
  try {
    const { featured } = req.query;
    const testimonials = await Testimonial.findAll({
      featured: featured === 'true' ? true : undefined
    });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (err) {
    next(err);
  }
};
