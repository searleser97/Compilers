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
