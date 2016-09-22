import express from 'express';

const router = express.Router();

export default (datasource) => {
  router.route('/')
    .get((req, res) => {
      datasource.models.Goal.findAll()
        .then((goals) => {
          let goalsObj = { data: [] };
          goals.forEach((goal) => {
            goalsObj.data.push(
              {
                type: 'goals',
                id: goal.id,
                attributes: {
                  description: goal.description
                }
              }
            );
          });
          res.status(200).json(goalsObj);
        })
        .catch((err) => {
          res.sendStatus(404);
        });
    });

  return router;
};
