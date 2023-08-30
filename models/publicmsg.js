'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PublicMsg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      PublicMsg.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }

  PublicMsg.init({
    UserId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  },{
      sequelize,
      modelName: 'PublicMsg',
      tableName: 'PublicMsgs',
      // underscored: true
    })
    return PublicMsg
  }
  