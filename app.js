const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'test',
  database: 'fazztrack'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM produk',
    (error, results) => {
      console.log(results);
      res.render('hello.ejs');
    }
  );
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM produk',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO produk (nama_produk,keterangan,harga,jumlah) VALUES (?,?,?,?)',
    [req.body.itemName,req.body.itemDescription,req.body.itemPrice,req.body.itemCount],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.post('/delete/:nama_produk', (req, res) => {
  connection.query(
    'DELETE FROM produk WHERE nama_produk = ?',
    [req.params.nama_produk],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:nama_produk', (req, res) => {
  connection.query(
    'SELECT * FROM produk WHERE nama_produk = ?',
    [req.params.nama_produk],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:nama_produk', (req, res) => {
  connection.query(
    'UPDATE produk SET keterangan = ? , harga = ? , jumlah = ? WHERE nama_produk = ?',
    [req.body.itemDescription, req.body.itemPrice,req.body.itemCount, req.params.nama_produk],
    (error, results) => {
      res.redirect('/index');
    }
  );
});


app.listen(3000);