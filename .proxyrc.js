const fetch = require('node-fetch');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    if (req.url.startsWith('/api/')) {
      fetch('https://api.dclimate.net/apiv2/' + req.url.slice(5))
        .then((response) => response.json())
        .then((json) => res.end(JSON.stringify(json)));
      return;
    } else return next();
  });
};
