export default (sequelize, DataType) => {
  const Task = sequelize.define('task', {
    description: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pomodoros: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
    {
      classMethods: {
        associate: (models) => {
          Task.belongsTo(models.Goal);
        },
      },
    },
  );

  return Task;
};
