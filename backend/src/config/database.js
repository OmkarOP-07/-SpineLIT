const { Sequelize } = require('sequelize')
const path = require('path')

const dbPath = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace('sqlite:', '')
  : path.join(__dirname, '..', '..', 'spinelit.db')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
})

module.exports = { sequelize }
