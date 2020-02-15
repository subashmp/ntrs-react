const AppError = require('../utils/utils.AppError');
const { catchAsyncError } = require('../utils/utils.functions');
const { validateBeforeUpdate } = require('../utils/utils.db');
// wrappers return specific middlewares for different types of queries for resoure

/** *********************************************************************
 * createOne --> creates a resource document based on the model provided
 * args --> Model, config: {resourceName: String, options: {}}
 * */

exports.createOne = (Model, config) => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        [config.resourceName]: doc
      }
    });
  });
};

/** *********************************************************************
 * getAll --> returns all the docs for a resource based on the model
 * 						provided
 * args --> Model, config: {resourceName: String, options: {}}
 * */
exports.getAll = (Model, config) => {
  return catchAsyncError(async (req, res, next) => {
    const docs = await Model.find();
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        [config.resourceName]: docs
      }
    });
  });
};

/** *********************************************************************
 * getOne--> returns the document for a resource based on the model provided
 * args --> Model, config: {resourceName: String, options: {}}
 * */
exports.getOne = (Model, config) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);

    if (!doc)
      return next(
        new AppError(400),
        `${config.resourceName} with ${id} does not exist`
      );
    res.status(200).json({
      status: 'success',
      data: {
        [config.resourceName]: doc
      }
    });
  });
};

/** *********************************************************************
 * updateOne--> updates and returns the document for a resource based on the model
 * 						provided
 * args --> Model, config: {resourceName: String, options: {}}
 * */
exports.updateOne = (Model, config) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedDoc)
      return next(
        new AppError(400, `${config.resourceName} with ${id} does not exist`)
      );

    res.status(200).json({
      status: 'success',
      data: {
        [config.resourceName]: updatedDoc
      }
    });
  });
};

/** *********************************************************************
 * deleteOne--> deletes the document of a resource type based on the provided model
 * args --> Model, config: {resourceName: String, options: {}}
 * */
exports.deleteOne = (Model, config) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc)
      return next(
        new AppError(400, `${config.resourceName} with ${id} does not exist`)
      );
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};
