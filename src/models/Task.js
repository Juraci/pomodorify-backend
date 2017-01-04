export default (sequelize, DataType) => {
  return sequelize.define('task', {
    description: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });
}
