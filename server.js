'use strict';
const express = require('express');
const app = express();
const apiApp = require('./app');
const PORT = 3000;
const models = require('./models');

apiApp.setup(app);

models.sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`Open Data API Listening on ${PORT}`));
});
