const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { name: "Ankit Gupta", title: "Cloud Engineer Portfolio" });
});

app.listen(8080, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:8080`);
});

