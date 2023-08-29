'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscribeship = sequelize.define('Subscribeship', {
    subscriberId: DataTypes.INTEGER,
    subscribingId: DataTypes.INTEGER
  }, {});
  Subscribeship.associate = function(models) {
    // associations can be defined here
  };
  return Subscribeship;
};