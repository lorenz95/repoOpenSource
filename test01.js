const axios = require('axios');

axios.get('http://localhost:3000/info?id=11').then(resp => {
	 console.log(resp.data.search('Nome 11'));
});

const appData = require('./app-data');
const numData = appData.initData();
axios.get('http://localhost:3000/list').then(resp => {
	console.log('resp = ' + resp.data);
	console.log('numData ' + numData);
});