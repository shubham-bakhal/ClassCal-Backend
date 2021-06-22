module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Teacher',
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING(64),
      is: /^[0-9a-f]{64}$/i,
      validate: {
        min: 23,
      },
    },
  });

  return User;
};
