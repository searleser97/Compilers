function generateTableFromAFD(automata, fsm){
	var data = {};
	for (var key of automata.estados) {
		data[key.id] = {};
		var index = 0;
		var trans;
		var values;
		if (fsm[key.id] == undefined || fsm[key.id] == null) {
			trans = new Set(); 
			values = [[[]]];
		}else{
			trans = new Set(Object.keys(fsm[key.id]));
			values = Object.values(fsm[key.id]);
		}
		for (var c of automata.alfabeto){
			if (trans.has(c)) {
				data[key.id][c] = parseInt(values[index++][0][0]);
			}else{
				data[key.id][c] = null;
			}
		}
		data[key.id]["TOK"] = key.token;
	}
	// console.log(data);
	return data;
}

function generateAFDFromTable(json){
	var auxAutomata = new Automata();

  var aJson = Object.keys(json);
  var aStates = {};
  var aAceptados = {};
  var aAceptadosID = {};
  
  var aSymbols = Object.keys(json[aJson[aJson.length-1]]);
  for (var i = aJson.length - 1; i >= 0; i--) {
    aJson[i] = parseInt(aJson[i]);
    aStates[aJson[i]] = new Estado(json[aJson[i]]["TOK"] != -1);
    aStates[aJson[i]].token = json[aJson[i]]["TOK"];
    aStates[aJson[i]].id = aJson[i];
    if (json[aJson[i]]["TOK"] != -1) {
      aAceptados[aJson[i]] = aStates[aJson[i]];
      aAceptadosID[aJson[i]] = aStates[aJson[i]].id;
    }
  }
  // console.log(aStates);
  var aInicial = {};
  for (var i = aJson.length - 1; i >= 0; i--) {
    for (var j = aSymbols.length - 1; j >= 0; j--) {
      if ((aSymbols[j] != "TOK") && (json[aJson[i]][aSymbols[j]] != null)) {
        aStates[aJson[i]].addTrans(new Transicion(aSymbols[j], aStates[json[aJson[i]][aSymbols[j]]]));
        aInicial[aStates[json[aJson[i]][aSymbols[j]]].id] = true;
      }
    }
  }
  for(var key in aStates){
    if (!aInicial.hasOwnProperty(key)) {
        // console.log("Inicial = "+key);
        // console.log(aStates[key]);
        auxAutomata.inicial = aStates[key];
    }
  }
  // console.log(Object.values(aStates));
  // console.log(Object.values(aAceptados));
  // console.log(Object.values(aAceptadosID));
  // console.log(new Set(aSymbols));

  auxAutomata.estados = Object.values(aStates);
  auxAutomata.aceptados = Object.values(aAceptados);
  auxAutomata.aceptadosID = Object.values(aAceptadosID);
  auxAutomata.alfabeto = new Set(aSymbols);
  auxAutomata.afd = true;

  // console.log(auxAutomata);

	return auxAutomata;
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