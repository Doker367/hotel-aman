/* ============================================================
   Services Controller
   ============================================================ */

const Service = require('../models/Service');

exports.getAllServices = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const services = await Service.findAll({
      category,
      featured: featured === 'true' ? true : undefined
    });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (err) {
    next(err);
  }
};

exports.getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findBySlug(req.params.slug);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};
