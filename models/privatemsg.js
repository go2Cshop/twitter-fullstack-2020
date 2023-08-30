"use strict";
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PrivateMsg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PrivateMsg.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      });
      PrivateMsg.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
      });
    }
  }

  PrivateMsg.init(
    {
      text: DataTypes.STRING,
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PrivateMsg",
      tableName: "PrivateMsgs",
      // underscored: true
    }
  );
  return PrivateMsg;
};