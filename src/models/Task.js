export default (sequelize, DataType) => {
  const Task = sequelize.define('task', {
    description: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  },
    {
      classMethods: {
        associate: (models) => {
          console.log('aossicating Task');
          Task.belongsTo(models.Goal);
        }
      }
    }
  );

  return Task;
}
