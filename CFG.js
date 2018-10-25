//Production: Arreglo de strings
function mapeoRegla(LS, RS){//LS:string RS:Production(Array<string>)
	this.LS = LS;
	this.RS = RS;
}

function CFG(){
	var _this=this;

	_this.terminals=new Set();//Arreglo de strings
	_this.nonTerminals = new Set();
	_this.startingNonTerminal;
	_this.rules = new Map();//Map<String,Array<production>>
	_this.firsts = new Map();//Mapa de conjuntos tal que Map<String,Set<String>>
	_this.appRS= new Map();//Right Side Appearances
	_this.follows= new Map();//Mapa de conjuntos tal que Map<String,Set<String>>
	_this.tablaLL = new Map()//Sera un mapa de mapas.
	//En las columnas van los terminales y el $. En las filas van todos (No terminales y terminales)
	//Adentro de la tabla habra una produccion.
	//Primer mapa son filas.
	//Segundo mapa son columnas.
	//El valor del segundo mapa sera una produccion

	_this.setSNT = function(s){
		_this.startingNonTerminal = s;
	}

	_this.union = function(a,b){
		for(var e of b){
			if(!a.has(e))
				a.add(e);
		}
		return a;
	}
	_this.getFirst = function(e){//String e
		var finalFirst = new Set();
		if( _this.terminals.has(e) || e === "ep"){
			finalFirst.add(e);
			return finalFirst;
		}
		//rules.get(e) debe regresar un arreglo de producciones
		for(var production of _this.rules.get(e)){
			var firstProd = new Set();//Sirve para sacar los first de la produccion en total
			var i =0;
			for(; i < production.length; i++){
				var c= production[i];
				var firstOfC = new Set();//Set de strings
				firstOfC= getFirst(c);
				if(!firstOfC.has("ep")){
					firstProd= _this.union(firstOfC,firstProd);
					break;
				}
				if(i !== (production.length-1)){//Ultimo elemento de la produccion{
					firstOfC.delete("ep");
				}
				firstProd=_this.union(firstOfC,firstProd);
			}
			i=0;
			finalFirst=_this.union(finalFirst,firstProd);
		}
		return finalFirst;
	}

	_this.setFirsts = function(){
		for(var c of _this.terminals)
			_this.firsts.set(c,_this.getFirst(c));
		for(var c of _this.nonTerminals)
			_this.firsts.set(c,_this.getFirst(c));
		var auxi = new Set();
		auxi.add("ep");
		_this.firsts.set("ep",auxi);
	}
	//Set Right Side Appearances
	_this.setRSApp = function(s){//String s
		var aux = [];
		for(var [left,right] of _this.rules){
			for(var production of right){
				for(var e of production){
					if(e === s){
						aux.push(new mapeoRegla(left,production));
					}
				}
			}
			
		}
		if(aux.length !== 0)
			_this.appRS.set(s,aux);
	}

	_this.getFollow = function(s){//String s
		var followSet= new Set();
		var aux = new Set();

		if(s === _this.startingNonTerminal)
			followSet.add("$");

		var rightSideApp = _this.appRS.get(s);//Regresa un arreglo de objeto mapeoRegla(String,production)
		
		for(var app of rightSideApp){
			var RHS= app.RS;//Debe de regresar una production
			var i =0;
			for(; i < RHS.length;i++){//Pasamos por cada char para ver que tipo de production es
				var c = RHS[i];
				//HAY QUE PARAR EL CICLO CUANDO LO ENCUENTRA
				if(c === s){// Lo encontramos
					if(i === RHS.length-1){//Ya no tiene nada por delante
						if(app.LS !== c)
							followSet=_this.union(followSet,_this.getFollow(app.LS));
					}
					else{//Hay un elemento adelante
						aux= _this.firsts.get(RHS[i+1]);
						followSet= _this.union(followSet,aux);
						if(aux.has("ep")){
							followSet.delete("ep");
							followSet= _this.union(followSet,_this.getFollow(app.LS));
						}
					}
					break;
				}
			}
		}
		return followSet;
	}

	_this.setFollows = function(){
		//Gotta set RSApp before getting the follows
		for(var c of _this.nonTerminals)
			_this.setRSApp(c);
		//Setting follows for every non terminal
		for(var c of _this.nonTerminals)
			_this.follows.set(c,_this.getFollow(c));
	}
	_this.setPreValues= function(){
		var aux1 = new Map();
		aux1.set("$",["aceptar"]);
		_this.tablaLL.set("$",aux1);

		for(var c of terminals){
			var aux2 = new Map();
			aux2.set(c,["pop"]);
			_this.tablaLL.set(c,aux2);
		}
	}

	_this.fillTable = function(){
		_this.setPreValues();
		for(var [leftSide,rightSide] of _this.rules){
			var auxMap = new Map();
			for(var p of rightSide){//P es una prod
				console.log("Sacamos a la produccion");
				console.log(p);
				console.log("Hacemos el first de "+ p[0]);

				var firstF= _this.firsts.get(p[0]);
				console.log(firstF);

				if(firstF.has("ep")){
					console.log("Hay un epsilom malvado, se calcula follow");
					firstF = _this.follows.get(leftSide);
					console.log("Lo cambiamos y ahora es ");
					console.log(firstF);
				}
				
				for(var e of firstF){//Por cada elemento del first
					//var auxMap = new Map();
					//A cada elemento lo mapeamos con la produccion
					auxMap.set(e,p);
					console.log("El map chico nos queda ");
					console.log(e+ "-> ");
					console.log(auxMap.get(e));
					//A la tabla en el valor de la izquierda lo mapeamos con el auxMap	
				}	
			}
			_this.tablaLL.set(leftSide,auxMap);
			console.log("El map grande nos queda ");
			console.log(leftSide+"->");
			console.log(_this.tablaLL.get(leftSide));
		}
	}

	_this.tableLL= function(){
		_this.fillTable();
	}
}