const fs = require('fs');

let ssData = null;
let people = null; 		//loadData();
let numData = 0;

function initData( session ) {
	ssData = session;

	if (!session) { // senza sessione x test
		people = loadData();
		numData = people.length;
		return numData;
	}
	if (!ssData.people){ // Load data
		ssData.init = true;
		ssData.people = loadData();
	} 
	people = ssData.people;
	numData = people.length;
	console.log("init data: " + numData);	
  
  return numData;
}
	
// Load data array
function loadData() {
  const data = require('./app-data.json');
  
  console.log("load data");
  return data;
}

// Save data array
function saveData(fileWrite) {
	const data = people;
	if (!fileWrite)
		fileWrite = 'app_data_save.json';
		
	if (data) {	
		let dataJson = JSON.stringify(data);
		fs.writeFileSync(fileWrite, dataJson);
	}
  console.log("save data:" + fileWrite);
  return;
}

// find a person by ID in array
function findPersonById(idPerson) {
  if (!people) return null;
  const result = people.find(x => x.id == idPerson);
  return result;
}

// find a person by Name in array
function findPersonByName(name) {
  if (!people) return null;
  const result = people.find(x => x.name == name);
  return result;
}

// get Data Person by ID
function getPerson(idPerson) {
	if (!people){ // Ricarico dati
		initData();
	} 
	const person = findPersonById(idPerson);

  return person;
}

function pageDataList(page_num, page_size) {
  // page numbers start with 1
  return people.slice((page_num - 1) * page_size, page_num * page_size);
}

exports.initData = initData;
exports.loadData = loadData;
exports.saveData = saveData;
exports.findPersonById = findPersonById;
exports.findPersonByName = findPersonByName;
exports.getPerson = getPerson;
exports.pageDataList = pageDataList;