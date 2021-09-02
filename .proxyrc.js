module.exports = function (app) {
  app.use(async (req, res, next) => {
    if (req.url.startsWith('/api/')) {
      import('node-fetch').then((fetch) =>
        fetch('https://api.dclimate.net/apiv2/' + req.url.slice(5))
          .then((response) => response.json())
          .then((json) => res.end(JSON.stringify(json)))
      );
      return;
    } else return next();
  });
};
