const express = require('express');
const app = express();

app.get('/api/*', (req, res) => {
  res.send('pong');
});

app.use(express.static('dist'));

app.get('/*', (req, res) =>
  res.sendFile('./dist/index.html', { root: __dirname })
);

app.listen(1234, () => {
  console.log('Listening on port :1234');
});
