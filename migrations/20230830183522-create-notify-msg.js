'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifyMsgs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      receiverId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      senderId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      titleMsg: {
        type: Sequelize.TEXT
      },
      mainMsg: {
        type: Sequelize.TEXT
      },
      tweetId: {
        type: Sequelize.INTEGER
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notifyMsgs');
  }
};