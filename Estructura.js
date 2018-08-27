function Transicion(simbolo,destino){
	this.simbolo=simbolo;
	this.destino=destino;
	//funciones
}

function Estado(id,final) {
	this.id=id;
	this.final=final;
	this.transiciones=[{}];
	//funciones
	this.addTrans= function(simbolo,destino){
		transiciones.push(new Transicion(simbolo,destino));
	}
}

var aristas={[]};
var automatas={};

function Automata(){
	//De alguna manera introducir la informacion o mandarla como parametros
	//this.inicial= inicial;
	//funciones
	var estados=[];
	var aceptados=[];
	var inicial;
	var contador=0;
	var alfabeto={};
	this.basico = new function(simbolo){
		var nodo1=new Estado(this.cont++,false);
		var nodo2=new Estado(this.cont++,true);
		nodo1.addTrans(simbolo,nodo2);
		this.inicial = nodo1;
		this.estados.push(e1);
		this.estados.push(e2);
		this.alfabeto.push(simbolo);
		this.aceptados.push(e2);
	}
	this.mover= new function(e,s){
		var r={};
		for(var t in e.transiciones){
			if(t.simbolo == s)
				r.push(t.destino);
		}
		return r;
	}

	this.unirAlfabeto = new function(alfa){
		for (c in alfa){
			this.alfabeto.push(c);
		}
	}

	this.unir = new function(automata){
		var nodo1=new Estado(this.cont++,false);
		var nodo2=new Estado(this.cont++,true);
		e1.addTrans(new Transicion(epsilon,this.inicial));
		e1.addTrans(new Transicion(epsilon,automata.inicial));
		for(var e in this.aceptados){
			e.addTrans(new Transicion(epsilon,e2));
			e.final =false;
		}
		for(var e in automata.aceptados){
			e.addTrans(new Transicion(epsilon,e2));
			e.final =false;
		}
		this.aceptados=[];
		this.aceptados.push(e2);
		this.inicial=e1;
		unirAlfabeto(automata.alfabeto);//innecesario
		alfabeto = {};
	}
}

function main(){
	var a1=new Automata();
	a1.basico(s);
	var a2 = new Automata();
	a2.basico(s);
	automatas.push(a1);
	var conjunto=a1.mover();
	a1.unir(a2);
}