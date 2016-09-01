const express = require('express');
const path = require('path');

const app = express();

app.set('port', 3000);

app.use('/', express.static(path.join(__dirname, '/..', '/client/dist')));

app.get('*', (req, res) => {
  if (!path.extname(req.path)) {
    res.sendFile('index.html', {root: __dirname + '/../client/dist'});
  }
  else {
    res.status(404).end();
  }
});

app.listen(app.get('port'), () => {
  console.log('Node app running on port', app.get('port'));
});