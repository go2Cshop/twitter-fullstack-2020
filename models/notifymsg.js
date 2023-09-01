'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class NotifyMsg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NotifyMsg.belongsTo(models.User, { foreignKey: "senderId" })
    }
  };
  NotifyMsg.init({
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    mainMsg: DataTypes.TEXT,
    titleMsg: DataTypes.TEXT,
    tweetId: DataTypes.INTEGER,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'NotifyMsg',
    tableName: 'NotifyMsgs'
    // underscored: true
  })
  return NotifyMsg
}