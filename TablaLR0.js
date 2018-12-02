function mapeoRegla(LS, RS){//LS:string RS:Production(Array<string>)
	this.LS = LS;
	this.RS = RS;
}

function lr0(){
    var _this = this;

    _this.make_hash = require('object-hash');
    _this.rules = new Map();
    _this.terminals = new Set();
    _this.nonTerminals= new Set();
    _this.startingNonTerminal = "";
    _this.appRS= new Map();
    _this.ruleNum = new Map();
    _this.numRule = new Map();
    _this.symbols = new Set();

    _this.setRSApp=function(s){//String s
        var aux = [];
        for(var [left,right] of rules){
            for(var production of right){
                for(var e of production){
                    if(e === s){
                        aux.push(new mapeoRegla(left,production));
                    }
                }
            }
            
        }
        _this.appRS.set(s,aux);
    }

    _this.initialize = function(){
        symbols = [...terminals];
        for(var e of nonTerminals)
            symbols.add(e);

        for(var c of nonTerminals){
            setRSApp(c);
        }

        var cont = 0;
        for(var p of rules){
            for(var right of p[1]){
                var string = p[0] + "," + right.toString();
                _this.ruleNum.set(string, "" + cont);
                var regla = [];
                regla.push(p[0]);
                for(var i = 0; i < right.length; i++){
                    regla.push(right[i]);
                }
                _this.numRule.set("" + cont, [...regla]);
                cont++;
            }
        }
    }
    _this.union = function(a,b){
        for(var e of b){
            if(!a.has(e))
                a.add(e);
        }
        return a;
    }

    _this.getAppIndex = function(array,t){
        for(var i = 0; i < array.length; i++){
            if(array[i] === t){                    
                return i;
            }
        }
        return -1;
    }

    _this.swapElements = function(array,pos1,pos2){
        var aux = array[pos1];     
        array[pos1] = array[pos2];
        array[pos2] = aux;
        return array;
    }

    _this.First = function(cad, finalFirst){
        var firstElement = cad[0];
        if(_this.terminals.has(firstElement)){
            if(!finalFirst.has(firstElement))               
                finalFirst.add(firstElement);                       
            return;                         
        }
        else{ 
            if(firstElement === 'ep'){
                if(cad.length === 1){
                    if(!finalFirst.has(firstElement))           
                        finalFirst.add(firstElement);           
                }
                else{
                    var aux = [...cad];
                    aux.shift();                    
                    _this.First(aux, finalFirst);
                }
            }
            else{
                var rightSides = _this.rules.get(firstElement); 
                for(var rs of rightSides){  
                    var aux = [...cad];             
                    aux.shift();                        
                    _this.First(aux.concat(rs), finalFirst);             
                }
            }
        }
        return ;                                                   
    }

    _this.Follow = function(previousNonT, currentNonT, followTable)
    {
        var finalSet = new Set();
        if(previousNonT === currentNonT)                                                     
            return finalSet;                                                
        if(currentNonT === _this.startingNonTerminal)                            
            finalSet.add('$'); 
        var setFirst = new Set();
        var auxSet = new Set();    
        if(!followTable.has(currentNonT)){
            var appRightSide = _this.appRS.get(currentNonT);   

            for(var p of appRightSide){
                var leftSide = p.LS;                     
                var rightSide = p.RS;                                                 
                var index = _this.getAppIndex(rightSide,currentNonT);                            
                
                if(index === (rightSide.length - 1))         
                    auxSet = _this.Follow(currentNonT, leftSide, followTable);           
                else{
                    var s = [];
                    for(var j = index + 1; j < rightSide.length; j++)
                        s.push(rightSide[j]);
                    _this.First(s,setFirst);                        
                    if(setFirst.has('ep')){
                        setFirst.delete('ep');                         
                        auxSet = _this.Follow(currentNonT, leftSide, followTable); 
                    }
                }          
                finalSet = _this.union(finalSet, _this.union(auxSet, setFirst));        
            }
            followTable.set(currentNonT, finalSet);                        
            return finalSet;                                                
        }
        return followTable.get(currentNonT);                               
    }


    _this.closure = function(rulesSet){                            
        var stack = [];                                 
        var processed = new Set();                               

        for(var r of rulesSet){
            stack.push(r);                                             
            processed.add(_this.make_hash(r));                          
        }
        var final = [];
        while(stack.length > 0){                        

            var e = stack.pop();                 
            final.push(e);                     
            var indexDot = _this.getAppIndex(e,'.');                                   
            if(indexDot !== (e.length - 1)){
                var nextE = e[indexDot+1];   
                if(!_this.terminals.has(nextE)){                                                
                    var rightSides = _this.rules.get(nextE);
                    for(var rs of rightSides){                  
                        var newRule = [];                        
                        newRule.push(nextE);      
                        newRule.push(".");                       
                        newRule= newRule.concat(rs);
                        var new_hash = _this.make_hash(newRule);
                        if(!processed.has(new_hash)){    
                            stack.push(newRule);             
                            processed.add(new_hash);      
                        }  
                    }
                }
            }      
        }
        return final;
    }

    _this.move = function(rulesSet, s){
        var result = [];                                    
        for(var ruleItem of rulesSet){
            var indexDot = _this.getAppIndex(ruleItem,'.');                       
            if(indexDot !== (ruleItem.length -1)){
                var nextE = ruleItem[indexDot + 1];              
                if(nextE === s){            
                    var itemAux = [...ruleItem];
                    itemAux = _this.swapElements(itemAux,indexDot+1,indexDot);             
                    result.push(itemAux);              
                }
            }
        }
        return result;
    }

    _this.move_to = function(rulesSet, s){
        return _this.closure(_this.move(rulesSet, s));
    }


    _this.tablaLR = function(){
        _this.initialize();
        var finalTable = new Map();                                          
        var c = new Map();                                   

        var contador = 0;                                             
        var mainSet = [];                                                           
        var stack = [];                                                     
        var allSets = [];                                                   
        var idS = "";                                    
        var nonRepeated = new Map();                                

        var ruleWDot = [];                                        
        var computeFirst = [];                                        

        ruleWDot.push(_this.startingNonTerminal);                            
        ruleWDot.push(".");
        ruleWDot.push(_this.rules.get(_this.startingNonTerminal)[0][0]);
        
        computeFirst.push(ruleWDot);                            
        mainSet = _this.closure(computeFirst);    
       
        idS = _this.make_hash(mainSet);         
        nonRepeated.set(idS, contador);        

        stack.push(mainSet);                                                      
        allSets.push(mainSet);                                                    
        while(stack.length > 0){                                            
            mainSet = stack.pop();                                                    
            var Si = [];                                                
            
            c.clear();                                      

            for(var s of symbols){                               
                Si = _this.move_to(mainSet, s);                             
                
                if(Si.length === 0){                                      
                    idS = _this.make_hash(Si);
                    var cadena = "";                                        
                    if(_this.terminals.has(s)){
                            cadena += "d";                                  
                    }
                    if(nonRepeated.has(idS)){
                        cadena += nonRepeated.get(idS);
                        c.set(s, cadena);         
                    }
                    else{
                        contador += 1;                                        
                        nonRepeated.set(idS, contador);
                        stack.push(Si);                                       
                        allSets.push(Si);
                        cadena += contador;                                  
                        c.set(s, cadena);          
                    }
                }
            }
            var idCurrent = "";
            idCurrent += nonRepeated.get(_this.make_hash(mainSet));
            finalTable.set(idCurrent, new Map([...c]));        
        }


        for(var currentSet of allSets){                                             
            for(var rule of currentSet){                               
                var aux = [...rule];
                if(aux[aux.length - 1] === '.'){                
                    aux.pop();                                      
                    var redux = "r";                             
                    redux += _this.ruleNum.get(aux.toString());
                    var row = nonRepeated.get(_this.make_hash(currentSet));

                    var memo = new Map();                               
                    var terminalsFollow = _this.Follow('.', aux[0], memo);
                    var cTable = finalTable.get("" + row);           

                    for(var t of terminalsFollow){
                        cTable.set(t, redux);              
                    }
                }
            }
        }


        return finalTable;
    }
}
/*
_this.AnalizadorCadena(tablaLR0, cadena, producciones){
    var gramaticaNumerada = enumerate(producciones);
    var aceptada = true;
    var pila = [];
    
    pila.push('0');

    if(!tablaLR0.get(pila[pila.length - 1]).has(cadena[0])){
        return false;
    }else{
        var accion = tablaLR.get(pila[pila.length - 1].get(cadena[0]));
        while(accion !== 'r0')
        {
            if(accion[0] === ''){
                aceptada = false;
                break;
            }else if(accion[0] === 'd' ){
                pila.push(cadena.shift());
                pila.push(accion[1]);
            }else if(accion[0] === 'r'){

            }else{

            }

            if(!tablaLR0.get(pila[pila.length - 1]).has(cadena[0])){
                aceptada = false;
                break;
            }
            accion = tablaLR.get(pila[pila.length - 1].get(cadena[0]));
        }

    }

    return aceptada;
    
}
*/



