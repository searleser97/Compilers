function Transicion(simbolo, destino) {
	this.simbolo = simbolo;
	this.destino = destino;
	//funciones
}

function Estado(id, final) {
	_this = this;
	_this.id = id;
	_this.final = final;
	_this.transiciones = [{}];
	//funciones
	_this.addTrans = function (simbolo, destino) {
		_this.transiciones.push(new Transicion(simbolo, destino));
	}
}

function TransicionTotal(inicial, simbolo, final) {
	this.inicial = inicial;
	this.simbolo = simbolo;
	this.final = final;
}

var aristas = [{}];
var automatas = {};

function Automata() {
	//De alguna manera introducir la informacion o mandarla como parametros
	//this.inicial= inicial;
	//funciones
	var _this = this;
	_this.totalTransiciones = [];
	_this.estados = [];
	_this.aceptados = [];
	_this.inicial = {};
	_this.contador = 0;
	_this.alfabeto = new Set();



	_this.basico = function (simbolo) {
		var e1 = new Estado(_this.contador++, false);
		var e2 = new Estado(_this.contador++, true);
		e1.addTrans(simbolo, e2);
		_this.totalTransiciones.push(new TransicionTotal(e1, simbolo, e2));
		_this.inicial = e1;
		_this.estados.push(e1);
		_this.estados.push(e2);
		_this.alfabeto.add(simbolo);
		_this.aceptados.push(e2);
	}


	_this.mover = function (conjunto, s) {
		var r = {};
		for (var e in conjunto) {
			for (var t in e.transiciones) {
				if (t.simbolo === s)
					r.push(t.destino);
			}
		}
		return r;
	}


	_this.cerradura = function (conjunto) {
		var r = {};
		var stack = [];
		for (var e in conjunto) {
			stack.push(e);
		}
		while (stack.length != 0) {
			var e = stack.pop();
			if (!r.contains(e)) {
				r.push(e);
				for (t in e.transiciones) {
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


	_this.unirAlfabeto = function (alfa) {
		for (var c in alfa) {
			_this.alfabeto.push(c);
		}
	}
	/*
	_this.transformar = new function () {
		var E = [{}];//Arreglo que contiene conjuntos de estados del AFND despues de hacer las operaciones correspondientes
		var Ei = [{}];//Arreglo que contiene los nuevos nodos que seran creados para el AFD
		var en_cola = [];//Cola que nos ayuda a procesar todos los elementos de E
		var contador = 0;//Contador utilizado para saber la posicion de los nodos recien creados

		var nuevasTransiciones = []

		//Hacemos cerradura del nodo inicial
		E[contador] = _this.cerradura(_this.inicial);
		en_cola.push(E[contador]);//Se introduce un CONJUNTO a la cola

		//Se crea el nodo del nuevo AFD
		Ei[contador] = new Estado(contador, false);

		while (!en_cola.empty()) {

			var e = en_cola.pop();//Se saca el conjunto correspondiente
			var nodo_creado = Ei[E.find(e)];//El nodo que fue creado se encuentra mediante una busqueda
			//realizada en E con el conjunto que sacamos de la cola. El conjunto que se encuentra comparte
			//indice con el nodo creado con tal informacion.

			for (var c in _this.alfabeto) {//Por cada letra de nuestro alfabeto

				var res = cerradura(mover(e, c));//Se hace la operacion Ir_A
				var encontrar = E.find(res);//El find regresa una posicion del arreglo E si es que encuentra el elemento res en este mismo.
				//Si ya lo habiamos creado entonces solo agregamos la arista
				if (encontrar) {
					Ei[nodo_creado].addTrans(c, Ei[encontrar]);
					nuevasTransiciones.push(new TransicionTotal(Ei[nodo_creado], c, Ei[encontrar]));
				}
				else {
					//Si no lo teniamos, entonces se agrega el conjunto a E (aumentando el indice) y tambien se crea un estado en Ei.
					E[contador++] = res;
					Ei[contador] = new Estado(contador, false);
					Ei[nodo_creado].addTrans(c, Ei[encontrar]);//Se le agrega la transicion
					nuevasTransiciones.push(new TransicionTotal(Ei[nodo_creado], c, Ei[encontrar]));
					en_cola.push(E[contador]);//Se meta a la cola
				}

			}
		}
		//Creamos el nuevo AFD a devolver con sus inicializaciones correspondientes
		var resultado = new Automata();
		resultado.estados = Ei;
		resultado.inicial = Ei[0];
		resultado.alfabeto = _this.alfabeto;
		resultado.totalTransiciones = nuevasTransiciones;
		//Checar cuales son finales y agregarlos al conjunto del nuevo AFD
		var index = 0;
		for (var conjunto in E) {
			for (var e in conjunto) {
				if (_this.aceptados.contains(e)) {
					resultado.aceptados.push(Ei[index]);
					break;
				}
			}
			index++;
		}

		return resultado;
	}
*/
	this.unir = function (automata) {
		var nodo1 = new Estado(_this.cont++, false);
		var nodo2 = new Estado(_this.cont++, true);
		nodo1.addTrans(new Transicion(epsilon, _this.inicial));
		_this.totalTransiciones.push(new TransicionTotal(nodo1, epsilon, _this.inicial));
		//nodo1.addTrans(new Transicion(epsilon, automata.inicial));
		_this.totalTransiciones.push(new TransicionTotal(nodo1, epsilon, automata.inicial));
		for (var e in _this.aceptados) {
			e.addTrans(new Transicion(epsilon, nodo2));
			_this.totalTransiciones.push(new TransicionTotal(e, epsilon, nodo2));
			e.final = false;
		}
		for (var e in automata.aceptados) {
			e.addTrans(new Transicion(epsilon, nodo2));
			_this.totalTransiciones.push(new TransicionTotal(e, epsilon, nodo2));
			e.final = false;
		}
		_this.aceptados = [];
		_this.aceptados.push(nodo2);
		_this.inicial = nodo1;
		_this.unirAlfabeto(automata.alfabeto);//innecesario
		//alfabeto = {};
	}

	_this.concatenar = function (automata) {
		for (var e in _this.aceptados) {
			for (var t in automata.inicial.transiciones) {
				e.addTrans(t.simbolo, t.destino);
				_this.totalTransiciones.push(new TransicionTotal(e, t.simbolo, t.destino));
			}
			e.final = false;
		}
		_this.aceptados = [];
		for (var e in automata.aceptados) {
			_this.aceptados.push(e);
		}
		_this.unirAlfabeto(automata.alfabeto);
	}

	_this.cerraduraKleene = function () {
		var nodo1 = new Estado(_this.cont++, false);
		var nodo2 = new Estado(_this.cont++, true);
		nodo1.addTrans(new Transicion(epsilon, _this.inicial));
		_this.totalTransiciones.push(new TransicionTotal(nodo1, epsilon, _this.inicial));
		nodo1.addTrans(new Transicion(epsilon, nodo2));
		_this.totalTransiciones.push(new TransicionTotal(nodo1, epsilon, nodo2));
		for (var e in _this.aceptados) {
			e.final = false;
			e.addTrans(new Transicion(epsilon, _this.inicial));
			_this.totalTransiciones.push(new TransicionTotal(e, epsilon, _this.inicial));
			e.addTrans(new Transicion(epsilon, nodo2));
			_this.totalTransiciones.push(new TransicionTotal(e, epsilon, nodo2));
		}
		_this.inicial = nodo1;
		_this.aceptados = [];
		_this.aceptados.push(nodo2);
	}
}

function main() {
	var a1 = new Automata();
	a1.basico(s);
	var a2 = new Automata();
	a2.basico(s);
	automatas.push(a1);
	var conjunto = a1.mover();
	a1.unir(a2);
}
