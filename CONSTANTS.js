// Símbolo que usaremos como epsilon
var epsilon = '\\e';
// Símbolo que usaremos como espacio
var spaceSymbol = '\\s';
// Fin de cadena
var EOF = '\0';

// Valor de los Tokens esperados
var Token_FIN = 0;

var Tokens_Aritmetico = {
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

var Tokens_Regex = {
	OR : 10,
	CONC : 20,
	CERRPOS : 30,
	CERREST : 40,
	CERRINT : 50,
	PAR_I : 60,
	PAR_D : 70,
	SIMB : 80
};

var Tokens_Grammar = {
	P_Y_C : 10,
	FLECHA : 20,
	OR : 30,
	SIMB : 40
};

var Token_ERROR = 1000;
