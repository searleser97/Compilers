//Production: Arreglo de strings
function CFG(){
	var _this=this;
	_this.terminals=new Set();//Arreglo de strings
	_this.nonTerminals = new Set();
	_this.rules = new Map();//Map<String,Array<production>>
	_this.firsts = new Map();//Mapa de conjuntos tal que Map<String,Set<String>>

	_this.union = function(a,b){
		for(var e of b){
			if(!a.has(e))
				a.add(e);
		}
		return a;
	}
	_this.getFirst = function(e){//String e
		var finalFirst = new Set();
		if(terminals.has(e) || e === "ep"){
			finalFirst.add(e);
			return finalFirst;
		}
		//rules.get(e) debe regresar un arreglo de producciones
		for(var production of rules.get(e)){
			var firstProd = new Set();//Sirve para sacar los first de la produccion en total
			var i =0;
			for(; i < production.length; i++){
				var c= production[i];
				var firstOfC = new Set();//Set de strings
				firstOfC= getFirst(c);
				if(!firstOfC.has("ep")){
					firstProd= union(firstOfC,firstProd);
					break;
				}
				if(i !== (production.length-1)){//Ultimo elemento de la produccion{
					firstOfC.delete("ep");
				}
				firstProd=union(firstOfC,firstProd);
			}
			i=0;
			finalFirst=union(finalFirst,firstProd);
		}
		return finalFirst;
	}

}