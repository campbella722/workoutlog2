const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:78ec3f8353464c4d9f245c6c85f92814@localhost:5432/workoutlog2")

module.exports = sequelize;