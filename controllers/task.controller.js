const db = require('../models');
const Task = db.tasks;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const task = {
    name: req.body.name,
    status: req.body.status,
  };
  // status: public & unpublic
  Task.create(task)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Cannot create',
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  Task.findAll({
    where: condition,
    include: ['user'],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error 500',
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Task.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: 'Cannot find id ' + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error 500',
      });
    });
};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};

exports.deleteAll = (req, res) => {};

exports.findAllPublic = (req, res) => {};
