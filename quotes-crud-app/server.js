console.log('Starting server script...');



const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const path = require('path');

const app = express();
dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Model
const Quote = require('./models/Quote');

// ROUTES

// Home Redirect
app.get('/', (req, res) => {
  res.redirect('/quotes');
});

// INDEX – Show all quotes
app.get('/quotes', async (req, res) => {
  const quotes = await Quote.find();
  res.render('quotes/index', { quotes });
});

// NEW – Show form to add a new quote
app.get('/quotes/new', (req, res) => {
  res.render('quotes/new');
});

// CREATE – Add new quote to DB
app.post('/quotes', async (req, res) => {
  await Quote.create(req.body);
  res.redirect('/quotes');
});

// SHOW – Show one quote
app.get('/quotes/:id', async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  res.render('quotes/show', { quote });
});

// EDIT – Show edit form
app.get('/quotes/:id/edit', async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  res.render('quotes/edit', { quote });
});

// UPDATE – Handle quote update
app.put('/quotes/:id', async (req, res) => {
  await Quote.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/quotes/${req.params.id}`);
});

// DELETE – Delete quote
app.delete('/quotes/:id', async (req, res) => {
  await Quote.findByIdAndDelete(req.params.id);
  res.redirect('/quotes');
});

app.get('/test', (req, res) => {
  res.send('Express is working!');
});


// NEW route – Show form
app.get('/quotes/new', (req, res) => {
  res.render('quotes/new');
});

// CREATE route – Add new quote to DB
app.post('/quotes', async (req, res) => {
  await Quote.create(req.body);
  res.redirect('/quotes');
});


 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});



console.log('Reached end of server.js script');
