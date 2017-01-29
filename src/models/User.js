export default (sequelize, DataType) => {
  const User = sequelize.define('user', {
    email: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
    /*{
      classMethods: {
        associate: (models) => {
          User.hasMany(models.Goal, { as: 'goals' });
        },
      },
    },*/
  );

  return User;
};
