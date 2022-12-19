
'use strict';

const url = require('url');
const querystring = require('querystring');

const express = require('express')
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json()); // Parse JSON bodies (as sent by API clients)

var session = require('express-session');
app.use(
    session({
        secret: 'secret',
		resave: true,
		saveUninitialized: true
    })
);

const appData = require("./app-data");  // Gestione dati applicazione

const user = {
    firstName: 'Someone',
    //lastName: 'Pacini',
}

let debug = 0;
const port = 3000
app.set('view engine', 'ejs')

const pageSize = 5;  	// Number elemnts for page
let numData = 0;

app.get('/', (req, res) => { // Root

	numData = appData.initData(req.session);
	console.log("home: " + numData);
	
    res.render('pages/index', {
        user
    })
})

app.get('/list', (req, res) => { // Lista personaggi
	
	numData = appData.initData(req.session);
	if (!numData) {
		res.redirect('/');
		return;
	}

	const pageMax = Math.ceil(numData / pageSize);
	const pageNum = getQueryPage(req, pageSize, numData);
	
	const maxItem = numData; 
	let numItem = pageNum * pageSize;
	numItem = (numItem > maxItem) ? maxItem : numItem;
	
	const pageList = appData.pageDataList(pageNum, pageSize);
	
    res.render('pages/list_person', {
		msgErr: null,
        people: pageList,
		numItem: numItem,
		maxItem: maxItem,
		pageNum: pageNum,
		pageMax: pageMax
    })
})

app.get('/info', (req, res) => { // Info personaggio
	
	numData = appData.initData(req.session);
	if (!numData) {
		res.redirect('/');
		return;
	}
	const url_parts = url.parse(req.url, true);
    const query = url_parts.query;

	const person = appData.getPerson(query.id);
	
	console.log("info id: " + query.id);
	
	if (debug) console.log(person);
	
    res.render('pages/info_person', {
        person: person
    })
})

app.get('/about', (req, res) => { // Pagina abount
	
    res.render('pages/about_page', {
        msg: "",
		versione: "versione 1.0"
    })
})


app.get('/data', (req, res) => { // Visualizzazione dati completi

	numData = appData.initData(req.session);
	if (!numData) {
		res.redirect('/');
		return;
	}
	
	const pageSize = 25;
	const pageNum = getQueryPage(req, pageSize, numData);
	
	const pageMax = Math.ceil(numData / pageSize);
	const maxItem = numData;	
	let numItem = pageNum * pageSize;
	numItem = (numItem > maxItem) ? maxItem : numItem;
	
	const pageList = appData.pageDataList(pageNum, pageSize);
	
    res.render('pages/list_data', {
		msgErr: null,
        people: pageList,
		pageNum: pageNum,
		pageMax: pageMax
    })
})

app.get('/save', (req, res) => { // Memorizzazione file dati
	
	appData.saveData();
	
	res.redirect('/');
	return;
	
})


// Unit TESTING file datai
app.get('/test', (req, res) => {
	
	numData = appData.initData(req.session);
	if (!numData) {
		res.redirect('/');
		return;
	}
	
	const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
	const idTest = query.id;
	
    res.render('pages/test_page', {
		idTest: idTest
    })
	
	return;
	
})

// Invio test
app.post('/test', (req, res) => {

	const data = req.body;
	console.log(req.body);

	const id = data.id;
	const name = data.name;

	const OK = " -- OK --"
	const ERR = "** ERR **"
	let res1 = null, res2 = null;
	let p1 = null, p2  = null;
	
	if (id){ // from id => Name
		p1 = appData.findPersonById(id);
		p2 = appData.findPersonByName(p1.name);
		console.log("Test 1A: id => name" );
		console.log("Person1: id = " + p1.id + " => name = " + p1.name);
		console.log("Person2: name = " + p1.name + " => id = " + p2.id);

		res1 = (p1.id == p2.id) ? OK : ERR;
		console.log(" Result " + res1);
	}
	
	if (name){ //  Name => ID
		p1 = appData.findPersonByName(name);
		p2 = appData.findPersonById(p1.id);

		console.log("Test 1B: name =>  id" );
		console.log("Person1: name = " + p1.name + " => id = " + p1.id);
		console.log("Person2: id = " + p1.id + " => name = " + p2.name);

		res2 = (p1.id == p2.id) ? OK : ERR;
		console.log(" Result " + res2);
	}
    res.send('Test id=' + p1.id + "  name=" + p1.name + "<br> result " + res1 + res2 );
});


// Insert a new person
app.post('/add', (req, res) => {
    const person = req.body;

    console.log(person);
  //  people.push(person);

    res.send('Person is added to the database');
});


app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})

// return QueryPage request from url
function getQueryPage(req, pageSize, maxItem) {
	
	const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
	let pageNum = parseInt(query.page); 

	const pageMax = Math.ceil(maxItem / pageSize);
	
	if (!(pageNum) || pageNum == 0) pageNum = 1;
	if (pageNum < 0) pageNum = pageMax;
		
	if (pageNum * pageSize > maxItem) 
		pageNum = pageMax;
  
  return pageNum;
}





