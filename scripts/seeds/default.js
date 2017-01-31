const app = require('../../build/app').default;

const Task = app.datasource.models.Task;
const Goal = app.datasource.models.Goal;
const User = app.datasource.models.User;

app.datasource.sequelize.sync().then(() => {
  Task.destroy({ where: {} })
    .then(() => Goal.destroy({ where: {} }))
    .then(() => User.destroy({ where: {} }))
    .then(() => User.create({ email: 'sample@example.com', password: 'pass123' }))
    .then(user1 => Goal.create({ userId: user1.id, description: 'Learn Ember' }))
    .then(goal1 => Task.create({ goalId: goal1.id, description: 'Read Rock and Roll with Ember.js' }))
    .catch(err => console.log('default seed script error\n:', err));
});
