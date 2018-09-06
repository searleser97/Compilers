/*===================================================================
=========             VARIABLES GLOBALES                =============
===================================================================*/

// Variable para llevar el id de los estados.
var contador = 0;
var contAutom = 0;



/*===================================================================
=========                 TRANSICIÓN                    =============
===================================================================*/
// Transición que formará parte de los estados, indica con qué símbolo se irá al estado.
function Transicion(simbolo, destino) {

	/*------------------------------------------------
	****************     VARIABLES    ****************
	------------------------------------------------*/
	this.simbolo = simbolo;
	this.destino = destino;
}



/*===================================================================
=========                   ESTADO                      =============
===================================================================*/
// Estado que inicializaremos indicando si es o no final.
function Estado(final) {
	var _this = this;

	/*------------------------------------------------
	****************     VARIABLES    ****************
	------------------------------------------------*/
	_this.id = contador++;
	_this.final = final;
	_this.transiciones = [];

	/*------------------------------------------------
	****************    , MÉTODOS     ****************
	------------------------------------------------*/
	_this.addTrans = function (transicion) {
		_this.transiciones.push(transicion);
	}
}

function TransicionTotal(inicial, simbolo, final) {
	this.inicial = inicial;
	this.simbolo = simbolo;
	this.final = final;
}



/*===================================================================
=========                  AUTOMATA                     =============
===================================================================*/
function Automata() {
	var _this = this;

	/*------------------------------------------------
	****************     VARIABLES    ****************
	------------------------------------------------*/
	_this.estados = [];
	_this.aceptados = [];
	_this.aceptadosID = []; // Usado para graficar
	_this.inicial = null;
	_this.alfabeto = new Set();
	_this.idAutomata = contAutom++;

	/*------------------------------------------------
	****************    , MÉTODOS     ****************
	------------------------------------------------*/

	// Función que unirá dos alfabetos
	_this.unirAlfabeto = function (alfa) {
		for (var c of alfa) {
			_this.alfabeto.add(c);
		}
	}

	// Función que recorrerá todos los estados del autómata y añadirá las transiciones a un arreglo.
	_this.getAristas = function () {
		var aristas = [];
		for (var e of _this.estados) {
			for (var t of e.transiciones) {
				var aux = t.destino;
				aristas.push(new TransicionTotal(e.id, t.simbolo.toString(), aux.id));
			}
		}
		return aristas;
	}

	/*------------------------------------------------
	****************  MÉTODOS GRÁFICO  ***************
	------------------------------------------------*/

	// Parecido a la inicialización, creamos un autómata con un sólo símbolo.
	_this.basico = function (simbolo) {
		var nodo1 = new Estado(false);
		var nodo2 = new Estado(true);
		nodo1.addTrans(new Transicion(simbolo, nodo2));
		_this.inicial = nodo1;
		_this.estados.push(nodo1);
		_this.estados.push(nodo2);
		_this.alfabeto.add(simbolo);
		_this.aceptados.push(nodo2);
		_this.aceptadosID.push(nodo2.id);
	}

	// Función que unirá dos autómatas que será la operación a|b
	this.unir = function (automata) {
		var nodo1 = new Estado(false);
		var nodo2 = new Estado(true);
		nodo1.addTrans(new Transicion(epsilon, _this.inicial));
		nodo1.addTrans(new Transicion(epsilon, automata.inicial));
		for (var e of _this.aceptados) {
			e.addTrans(new Transicion(epsilon, nodo2));
			e.final = false;
		}
		for (var e of automata.aceptados) {
			e.addTrans(new Transicion(epsilon, nodo2));
			e.final = false;
		}
		_this.estados.push(nodo1);
		_this.estados.push(nodo2);
		for (var f of automata.estados) {
			_this.estados.push(f);
		}
		_this.aceptados = [];
		_this.aceptados.push(nodo2);
		_this.aceptadosID = [];
		_this.aceptadosID.push(nodo2.id);
		_this.inicial = nodo1;
		_this.unirAlfabeto(automata.alfabeto);

		automatas[automata.idAutomata] = null;
	}

	// Última función que pidió el profesor, une los autómatas pero sin converger los estados finales
	this.superUnir = function () {
		var nodo1 = new Estado(false);
		nodo1.addTrans(new Transicion(epsilon, _this.inicial));
		console.log(_this.idAutomata);

		for (var automata of automatas){
			if (automata !== null) {
				console.log(automata.idAutomata);
				if (automata.idAutomata !== _this.idAutomata) {
					console.log(2);
					nodo1.addTrans(new Transicion(epsilon, automata.inicial));
					//automata.inicial = false;
					for (var e of automata.aceptados) 
						_this.aceptadosID.push(e.id);{
						_this.aceptados.push(e);
					}
					console.log(3);
					for (var f of automata.estados) {
						_this.estados.push(f);
					}
					console.log(4);
					_this.unirAlfabeto(automata.alfabeto);
					automatas[automata.idAutomata] = null;
				}
			}
		}
		
		_this.estados.push(nodo1);
		_this.inicial = false;
		_this.inicial = nodo1;
	}

	// Función que concatena dos autómatas como la operación ab
	_this.concatenar = function (automata) {
		for (var e of _this.aceptados) {
			for (var t of automata.inicial.transiciones) {
				var aux = t.destino;
				e.addTrans(new Transicion(t.simbolo, aux));
			}
			e.final = false;
		}
		_this.aceptados = [];
		_this.aceptadosID = [];
		for (var f of automata.aceptados) {
			_this.aceptados.push(f);
			_this.aceptadosID.push(f.id)
		}
		for (var f of automata.estados) {
			if (f.id !== automata.inicial.id) {
				_this.estados.push(f);
			}
		}
		_this.unirAlfabeto(automata.alfabeto);

		automatas[automata.idAutomata] = null;
	}

	// Función que nos permite añadir la operación a*
	_this.cerraduraKleene = function () {
		var nodo1 = new Estado(false);
		var nodo2 = new Estado(true);
		nodo1.addTrans(new Transicion(epsilon, _this.inicial));
		nodo1.addTrans(new Transicion(epsilon, nodo2));
		for (var e of _this.aceptados) {
			e.final = false;
			e.addTrans(new Transicion(epsilon, _this.inicial));
			e.addTrans(new Transicion(epsilon, nodo2));
		}
		_this.estados.push(nodo1);
		_this.estados.push(nodo2);
		_this.inicial = nodo1;
		_this.aceptados = [];
		_this.aceptados.push(nodo2);
		_this.aceptadosID = [];
		_this.aceptadosID.push(nodo2.id);
	}

	// Función que nos permite añadir la operación a+
	_this.cerraduraPositiva = function () {
		var nodo1 = new Estado(false);
		var nodo2 = new Estado(true);
		nodo1.addTrans(new Transicion(epsilon, _this.inicial));
		for (var e of _this.aceptados) {
			e.final = false;
			e.addTrans(new Transicion(epsilon, _this.inicial));
			e.addTrans(new Transicion(epsilon, nodo2));
		}
		_this.estados.push(nodo1);
		_this.estados.push(nodo2);
		_this.inicial = nodo1;
		_this.aceptados = [];
		_this.aceptados.push(nodo2);
		_this.aceptadosID = [];
		_this.aceptadosID.push(nodo2.id);
	}

	// Función que nos permite añadir la operación a?
	_this.cerraduraInterrogacion = function () {
		var nodo1 = new Estado(false);
		var nodo2 = new Estado(true);
		nodo1.addTrans(new Transicion(epsilon, _this.inicial));
		nodo1.addTrans(new Transicion(epsilon, nodo2));
		for (var e of _this.aceptados) {
			e.final = false;
			e.addTrans(new Transicion(epsilon, nodo2));
		}
		_this.estados.push(nodo1);
		_this.estados.push(nodo2);
		_this.inicial = nodo1;
		_this.aceptados = [];
		_this.aceptados.push(nodo2);
		_this.aceptadosID = [];
		_this.aceptadosID.push(nodo2.id);
	}

	/*------------------------------------------------
	********  MÉTODOS CONVERSIÓN AFN -> AFD  *********
	------------------------------------------------*/

	// Función que a partir de un conjunto de nodos y un símbolo, 
	// nos regresa el conjunto de posibles nodos a donde podemos movernos
	_this.mover = function (conjunto, s) {
		var r = new Set();
		for (var e of conjunto) {
			for (var t of e.transiciones) {
				if (t.simbolo === s)
					r.add(t.destino);
			}
		}
		return r;
	}

	// Función que realiza la cerradura epsilon (C_/e)
	_this.cerradura = function (conjunto) {
		var r = new Set();
		//var chec = new Set();
		var stack = [];
		for (var e of conjunto) {
			stack.push(e);
		}
		while (stack.length !== 0) {
			var e = stack.shift();
			if (!r.has(e)) {
				r.add(e);
				//check.add(e);
				for (t of e.transiciones) {
					if (t.simbolo === epsilon)
						stack.push(t.destino);
				}
			}
		}
		return r;
	}

	/*
	_this.Ir_A = new function (estado, simbolo) {
		var e = {};
		e.push(estado);
		return _this.cerradura(_this.mover(e, simbolo));
	}*/

	_this.findIndex=function(E,conjunto){
		var index=-1;
		//var bandera = false;
		if(!conjunto.size)
			return index;
		for (var i = E.length - 1; i >= 0; i--) {
			//if(E[i].size === conjunto.size){
			var bandera = true;
			for (var elemento of conjunto){
				//console.log(elemento);
				if(!E[i].has(elemento)){
					bandera = false;
					break;
				}
			}
			if(bandera){
				index = i;
				break;
			}
			//}
		}
		return index;
	}

	_this.findAccepted=function(e){
		var index=-1;
		var bandera = false;
		for (var i = _this.aceptados.length - 1; i >= 0; i--) {
			if(_this.aceptados[i] === e)
				index = i;
		}
		return index;
	}

	

	_this.transformar = function () {
		var E = [{}];//Arreglo que contiene conjuntos de estados del AFND despues de hacer las operaciones correspondientes
		var Ei = [{}];//Arreglo que contiene los nuevos nodos que seran creados para el AFD
		var en_cola = [];//Cola que nos ayuda a procesar todos los elementos de E
		var contador = 0;//Contador utilizado para saber la posicion de los nodos recien creados

		var nuevasTransiciones = []

		var auxiliar = new Set();
		auxiliar.add(_this.inicial);
		console.log("Agregamos al inicial que es ");
		console.log(_this.inicial);
		//Hacemos cerradura del nodo inicial
		E[contador] = _this.cerradura(auxiliar);
		en_cola.push(E[contador]);//Se introduce un CONJUNTO a la cola
		console.log("La primera cerradura da ");
		for(var iterator of E[contador]){
			console.log(iterator);
		}
		//Se crea el nodo del nuevo AFD
		Ei[contador] = new Estado(false);
		var analizados =0;
		while (analizados < en_cola.length) {
			var e = new Set();
			e = en_cola[analizados];//Se saca el conjunto correspondiente
			
			var nodo_creado = _this.findIndex(E,e);//El nodo que fue creado se encuentra mediante una busqueda
			//realizada en E con el conjunto que sacamos de la cola. El conjunto que se encuentra comparte
			//indice con el nodo creado con tal informacion.
			console.log("Sacamos a ");
			console.log(e);
			console.log("en el indice ");
			console.log(nodo_creado);
			for (var c of _this.alfabeto) {//Por cada letra de nuestro alfabeto
				var res_mover =_this.mover(e, c);
				console.log("Nuestro resultado del mover con la letra "+c+" es");
				for(var it of res_mover){
					console.log(it);
				}
				var res = _this.cerradura(res_mover);//Se hace la operacion Ir_A
				console.log("Nuestro res es de ");
				console.log(res);
				var contar=0;
				for(var it of res){
					console.log(it);
					contar++;
				}
				console.log("El contar es de ");
				console.log(res.size);
				//var encontrar=-1;
				//if(res.size){
				var encontrar = _this.findIndex(E,res);//El find regresa una posicion del arreglo E si es que encuentra el elemento res en este mismo.
					//Si ya lo habiamos creado entonces solo agregamos la arista
				//}				
				console.log("El encontrar es de ");
				console.log(encontrar);
				if (encontrar >= 0) {
					Ei[nodo_creado].addTrans(new Transicion(c, Ei[encontrar]));
					//nuevasTransiciones.push(new TransicionTotal(Ei[nodo_creado], c, Ei[encontrar]));
				}
				else if(contar >0){
					//Si no lo teniamos, entonces se agrega el conjunto a E (aumentando el indice) y tambien se crea un estado en Ei.
					contador++;
					E[contador] = res;
					Ei[contador] = new Estado(false);
					Ei[nodo_creado].addTrans(new Transicion(c, Ei[contador]));//Se le agrega la transicion
					//nuevasTransiciones.push(new TransicionTotal(Ei[nodo_creado], c, Ei[encontrar]));
					en_cola.push(E[contador]);//Se meta a la cola
					console.log("Agregamos a la cola a");
					console.log(E[contador]);
				}

			}
			analizados++;
		}
		//Creamos el nuevo AFD a devolver con sus inicializaciones correspondientes
		var resultado = new Automata();
		resultado.estados = Ei;
		resultado.inicial = Ei[0];
		resultado.alfabeto = _this.alfabeto;
		//resultado.totalTransiciones = nuevasTranssiciones;
		//Checar cuales son finales y agregarlos al conjunto del nuevo AFD
		var index = 0;
		for (var conjunto of E) {
			for (var e of conjunto) {
				if (_this.findAccepted(e) >=0) {
					resultado.aceptados.push(Ei[index]);
					resultado.aceptadosID.push(Ei[index].id);
					console.log(Ei[index]);
					break;
				}
			}
			index++;
		}
		return resultado;
	}
	
}
