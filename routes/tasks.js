module.exports = (app) => {
  const taskController = require('../controllers/task.controller');
  var router = require('express').Router();
  router.post('/', taskController.create);

  // Get all
  router.get('/', taskController.findAll);
  // Get by id
  router.get('/:id', taskController.findOne);

  app.use('/api/tasks', router);
};
