//Production: Arreglo de strings

function mapeoRegla(LS, RS){//LS:string RS:Production(Array<string>)
	this.LS = LS;
	this.RS = RS;
}

function CFG(){
	var _this=this;
	_this.terminals=new Set();//Arreglo de strings
	_this.nonTerminals = new Set();
	_this.rules = new Map();//Map<String,Array<production>>
	_this.firsts = new Map();//Mapa de conjuntos tal que Map<String,Set<String>>
	_this.appRS= new Map();//Right Side Appearances

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
		var res= new Set();
		var aux = new Set();

		var rightSideApp = _this.appRS.get(s);//Regresa un arreglo de objeto mapeoRegla(String,production)
		
		for(var app of rightSideApp){
			var RHS= app.RS;//Debe de regresar una production
			var i =0;
			for(; i < RHS.length;i++){//Pasamos por cada char para ver que tipo de production es
				var c = RHS[i];
				//HAY QUE PARAR EL CICLO CUANDO LO ENCUENTRA
				if(c === s){// Lo encontramos
					if(i === RHS.length-1){//Ya no tiene nada por delante
						res=_this.union(res,_this.getFollow(app.LS));
					}
					else{//Hay un elemento adelante
						aux= _this.first(RHS[i+1]);
						res= _this.union(res,aux);
						if(aux.has("ep")){
							res.delete("ep");
							res= _this.union(_this.getFollow(app.LS));
						}
					}
					break;
				}
			}
		}
		return res;
	}
}