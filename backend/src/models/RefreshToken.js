const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')
const User = require('./User')

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  underscored: true,
})

// Associations
User.hasMany(RefreshToken, { foreignKey: 'user_id', onDelete: 'CASCADE' })
RefreshToken.belongsTo(User, { foreignKey: 'user_id' })

module.exports = RefreshToken
