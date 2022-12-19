
const appData = require('./app-data')

test('Test App1: search id => name => id', () => {

	const numData = appData.initData();
	let numOk = 0;
	let numTest = 0;
	for(let id = 1; id <numData; id++){
		const p1 = appData.findPersonById(id);
		
		if (p1) {
			numTest++;
			var p2 = appData.findPersonByName(p1.name);
			if (p1.id == p2.id) numOk++;
		}
	}
	console.log("num test: " + numTest);
    expect(numOk).toBe(numTest);
  });