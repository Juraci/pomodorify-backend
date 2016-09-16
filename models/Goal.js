export default (sequelize, DataType) => {
  return sequelize.define('goal', {
    description: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });
}
