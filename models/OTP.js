
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.INTEGER,
      validate: {
        min: 6,
        max: 6,
      },
    },
    OTPExpires: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  });

  return OTP;
};
