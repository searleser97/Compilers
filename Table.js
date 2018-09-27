function generateTable(automata, fsm){
	var data = {};
	for (var key in fsm) {
		data[key] = {};
		var index = 0;
		var trans = new Set(Object.keys(fsm[key]));
		var values = Object.values(fsm[key]);
		for (var c of automata.alfabeto){
			if (trans.has(c)) {
				data[key][c] = values[index++][0][0];
			}else{
				data[key][c] = null;
			}
		}
	}
	return data;
}

function showTable(tableData) {

	var body = document.getElementById('bdtable');

	var table = document.createElement('table');
	table.style.width  = '100%';
	table.id = "table";


	var tableHead = document.createElement('thead');

	var alfabeto = Object.keys(tableData[Object.keys(tableData)[0]]);
	var tr = tableHead.insertRow();
	var h1 = document.createElement('h1');
	h1.appendChild(document.createTextNode(' '));
	var th = document.createElement('th');
	th.appendChild(h1);
	tr.appendChild(th);
	for (var c of alfabeto){
		var h1 = document.createElement('h1');
		h1.appendChild(document.createTextNode(c));
		var th = document.createElement('th');
		th.appendChild(h1);
		tr.appendChild(th);
	}
	table.appendChild(tableHead);


	var tableBody = document.createElement('tbody');

	var key = Object.keys(tableData);
	index = 0;
	Object.values(tableData).forEach(function(rowData) {

		var row = document.createElement('tr');

		var td = row.insertCell();
		td.appendChild(document.createTextNode(key[index++]));

		Object.values(rowData).forEach(function(cellData) {
			var cell = document.createElement('td');
			if (cellData == null) {
				cell.appendChild(document.createTextNode(' '));
			}else{
				cell.appendChild(document.createTextNode(cellData));
			}
			row.appendChild(cell);
		});

		tableBody.appendChild(row);
	});

	table.appendChild(tableBody);
	body.appendChild(table);
}

function dropTable(){
	var etiqueta = document.getElementById("table");
	etiqueta.parentNode.removeChild(etiqueta);
}