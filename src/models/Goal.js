export default (sequelize, DataType) => {
  const Goal = sequelize.define('goal', {
    description: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
    {
      classMethods: {
        associate: (models) => {
          Goal.hasMany(models.Task, { as: 'tasks' });
        },
      },
    },
  );

  return Goal;
};
