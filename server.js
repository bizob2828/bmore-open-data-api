'use strict';
const express = require('express');
const app = express();
const apiApp = require('./app');
const PORT = 3000;
const models = require('./models');

return models.sequelize
  .sync()
  .then(() => {
    apiApp.setup(app);
    // eslint-disable-next-line no-console
    app.listen(PORT, () => console.log(`Open Data API Listening on ${PORT}`));
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('cannot sync the db', err);
    process.exit(1);
  });
