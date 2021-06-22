module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    Teacher: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Batch: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Note: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Teacher',
      validate: {
        notEmpty: true,
      },
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
    from: { type: DataTypes.DATE, },
    to: { type: DataTypes.DATE, }
  });

  return Event;
};

// FOR DURATION
// const range = [
// new Date(Date.UTC(2016, 0, 1)),
// new Date(Date.UTC(2016, 1, 1))
// ];
