module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    TeacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Batch: {
      type: DataTypes.ENUM(['Comp 1', 'Comp 2', 'Comp 3', 'Mech 1', 'Mech 2', 'Mech 3']),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Note: {
      type: DataTypes.STRING,
    },

    from: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
    to: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
  });

  return Event;
};

// FOR DURATION
// const range = [
// new Date(Date.UTC(2016, 0, 1)),
// new Date(Date.UTC(2016, 1, 1))
// ];
