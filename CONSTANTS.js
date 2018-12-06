// Símbolo que usaremos como epsilon
const epsilon = '\\e';
// Símbolo que usaremos como espacio
const spaceSymbol = '\\s';
// Fin de cadena
const EOF = '\0';

// Valor de los Tokens esperados
const Token_FIN = 0;

const Tokens_Aritmetico = {
	MAS : 10,
	MENOS : 20,
	PROD : 30,
	DIV : 40,
	PAR_I : 50,
	PAR_D : 60,
	NUM : 70,
	POT : 80,
	SIN : 90,
	COS : 100,
	TAN : 110,
	EXP : 120,
	LN : 130,
	LOG : 140,
	VAR : 150
};

const Tokens_Regex = {
	OR : 10,
	CONC : 20,
	CERRPOS : 30,
	CERREST : 40,
	CERRINT : 50,
	PAR_I : 60,
	PAR_D : 70,
	SIMB : 80
};

const Tokens_Grammar = {
	P_Y_C : 10,
	FLECHA : 20,
	OR : 30,
	SIMB : 40
};

const Token_ERROR = 1000;

const TOKEN = {
	0 : "$",
	10 : "+",
	20 : "-",
	30 : "*",
	40 : "/",
	50 : "(",
	60 : ")",
	70 : "num",
	80 : "^",
	90 : "sin",
	100 : "cos",
	110 : "tan",
	120 : "e",
	130 : "ln",
	140 : "log",
	150 : "var"
}

function createTable2(obj) {
  console.log('AAAA', obj);
  var keysArr = [...obj.keys()].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  maxx = 0;
  var subkeys;
  for (key of keysArr) {
    subkeys = [...(obj.get(key).keys())].sort();
    row = [];
    row.push(key);
    for (subkey of subkeys) {
      row.push(obj.get(key).get(subkey));
    }
    tablaDeTablas.push(row);
  }
  console.log(tablaDeTablas);
  debugger;
  var table = $('<table style="margin-top: 50px;" class="table"></table>');
  row = $('<tr><td>-</td></tr>');
  for (var j = 0; j < subkeys.length; j++) {
    var rowData = $('<td></td>').text(subkeys[j]);
    row.append(rowData);
  }
  table.append(row);
  for (var i = 0; i < tablaDeTablas.length; i++) {
    row = $('<tr><td>' + i + '</td></tr>');
    for (var j = 0; j < tablaDeTablas[i].length; j++) {
      var rowData = $('<td></td>').text(tablaDeTablas[i][j]);
      row.append(rowData);
    }
    table.append(row);
  }

  if ($('table').length) {
    $("#someContainer tr:first").after(row);
  }
  else {
    $('#someContainer').append(table);
  }
}