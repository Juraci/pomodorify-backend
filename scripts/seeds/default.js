const app = require('../../build/app').default;

const Goal = app.datasource.models.Goal;
const Task = app.datasource.models.Task;

app.datasource.sequelize.sync().then(() => {
  Task.destroy({ where: {} })
    .then(() => Goal.destroy({ where: {} }))
    .then(() => Goal.create({ description: 'Learn Ember' }))
    .then(goal1 => Task.create({ goalId: goal1.id, description: 'Read Rock and Roll with Ember.js' }))
    .catch(err => console.log('default seed script error\n:', err));
});
