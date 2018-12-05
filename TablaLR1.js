function lr1(){
    var _this = this;

    // _this.make_hash = require('object-hash');
    _this.rules = new Map();
    _this.terminals = new Set();
    _this.nonTerminals= new Set();
    _this.startingNonTerminal = "";
    _this.ruleNum = new Map();
    _this.numRule = new Map();
    _this.symbols = new Set();

    _this.constructor = function(reglas,terminales,noTerminales,inicioGramatica){
        _this.rules = reglas;
        _this.terminals= terminales;
        _this.nonTerminals=noTerminales;
        _this.startingNonTerminal=inicioGramatica;
    }

    _this.initialize = function(){
        for(var e of _this.terminals)
            _this.symbols.add(e);

        for(var e of _this.nonTerminals)
            _this.symbols.add(e);

        var cont = 0;
        for(var p of _this.rules){
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
    _this.returnRuleTerminal = function(r,t){
        var obj = {
            rule : r,
            terminal : t
        };
        return obj
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


    _this.move1 = function(rulesSetT, s){
        var result = [];                                    
        for(var ruleItemT of rulesSetT){
            var indexDot = _this.getAppIndex(ruleItemT.rule,'.');
            if(indexDot !== (ruleItemT.length -1)){
                var nextE = ruleItemT.rule[indexDot + 1];              
                if(nextE === s){            
                    var itemAux = JSON.parse(JSON.stringify(ruleItemT));
                    itemAux = _this.swapElements(itemAux,indexDot+1,indexDot);
                    result.push(itemAux);              
                }
            }
        }
        return result;
    }

    _this.closure1 = function(rulesSetT){                            
        var stack = [];                                 
        var processed = new Set();                               

        for(var r of rulesSetT){
            stack.push(r);
            var aux_string=r.rule.toString();
            aux_string= aux_string + ","+r.terminal;
            processed.add(aux_string);                          
        }

        var final = [];
        
        while(stack.length > 0){                        
            var e = stack.pop();                 
            final.push(e);                     
            var indexDot = _this.getAppIndex(e.rule,'.');    

            if(indexDot !== (e.rule.length - 1)){
                var nextE = e.rule[indexDot+1];

                if(!_this.terminals.has(nextE)){                                                
                    var rightSides = _this.rules.get(nextE);              
                    for(var rs of rightSides){                  
                        var newRule = [];                        
                        newRule.push(nextE);      
                        newRule.push(".");                       
                        newRule= newRule.concat(rs);
                        
                        if(newRule[2] === 'ep'){
                            newRule[1] = 'ep';
                            newRule[2] = '.';
                        }
                        
                        var auxFirst = []

                        for(var i = indexDot+2; i < e.rule.length; i++){
                            auxFirst.push(e.rule[i]);
                        }
                        auxFirst.push(e.terminal);        
                        
                        var firstResult= new Set();
                        _this.First(auxFirst, firstResult);

                        for(var t of firstResult){  
                            var aux_rule = [...newRule];
                            var aux_terminal = "";
                            aux_terminal+=t;
                            var hash_terminal = aux_rule.toString();
                            hash_terminal = hash_terminal+","+aux_terminal;
                            if(!processed.has(hash_terminal)){
                                stack.push(_this.returnRuleTerminal(aux_rule,aux_terminal));//CHECAR ESTA PARTE       
                                processed.add(hash_terminal);
                            }  

                        }
                    }
                }
            }      
        }
        return final;
    }

    _this.move_to1 = function(rulesSet, s){
        return _this.closure1(_this.move1(rulesSet, s));
    }

    _this.setReductions = function(allSets,nonRepeated,finalTable){
        for(var currentSet of allSets){                                             
            for(var rTerminal of currentSet){                               
                var aux = [...rTerminal.rule];
                if(aux[aux.length - 1] === '.'){
                    var row = nonRepeated.get(objectHash.sha1(currentSet));
                    var column = finalTable.get("" + row);               
                    aux.pop();                                      
                    column.set(rTerminal.terminal,"r"+ruleNum.get(aux.toString()));
                }
            }
        }
    }

    _this.tablaLR1 = function(importTable){
        _this.initialize();
        var finalTable = new Map();                                          
        var vertical = new Map();                                   

        var contador = 0;                                                                                                        
        var stack = [];                                                     
        var allSets = [];                                                                                       
        var nonRepeated = new Map();                                
        
        var ruleA = [];                                        
        var computeFirst = [];                                        

        ruleA.push(_this.startingNonTerminal);                            
        ruleA.push(".");
        ruleA.push(_this.rules.get(_this.startingNonTerminal)[0][0]);

        computeFirst.push(_this.returnRuleTerminal(ruleA,"$"));

        var mainSet = [];
        mainSet = _this.closure1(computeFirst);

        var hashSet="";
        hashSet = objectHash.sha1(mainSet);
       
        nonRepeated.set(hashSet, contador);        

        stack.push(mainSet);                                                      
        allSets.push(mainSet);                                                    
        while(stack.length > 0){
                                                       
            mainSet = stack.pop();
                                                    
            var analisis = [];                                                                                     
            vertical.clear();

            for(var s of _this.symbols){                               
                analisis = _this.move_to1(mainSet, s);                             

                if(analisis.length !== 0){                                      
                    var tableValue = "";
                    hashSet = objectHash.sha1(analisis);
                    if(_this.terminals.has(s))//Checar
                            tableValue += "d";

                    if(nonRepeated.has(hashSet)){
                                 
                        tableValue += nonRepeated.get(hashSet);
                        vertical.set(s, tableValue);                         
                    }
                    else{                                                   
                        contador += 1;                                        
                        nonRepeated.set(hashSet, contador);
                        stack.push(analisis);                                         
                        allSets.push(analisis); 
                        tableValue += contador;                                       
                        vertical.set(s, tableValue);
                    }
                }   

                
            }
            var idCurrent = "";
            idCurrent += nonRepeated.get(objectHash.sha1(mainSet));
            finalTable.set(idCurrent, new Map([...vertical]));
                      
        }

        if(importTable !== undefined)
            return {conjuntos: allSets, idsConjuntos: nonRepeated};

        _this.setReductions(allSets,nonRepeated,finalTable)
        return finalTable;
    }

    _this.checkExpression = function(expression){
        var tablaResultado=_this.tablaLR1();
        var stack=[];
        stack.push('0');
        var index =0;
        while(true){
            console.log("Nuestra pila al iniciar es ");
            console.log(stack);
            console.log("NUEVA ITERACION");
            var e = stack[stack.length-1];
            console.log("Sacamos a "+e);
            var c = expression[index];
            console.log("Analizamos al caracter "+c);
            var valor = tablaResultado.get(e).get(c);
            console.log("Nuestro valor obtenido es "+valor);
            if(valor === undefined){
                console.log("ERROR");
                break;
            }
            if(valor[0] === 'd'){
                //console.log("Metemos a "+c);
                stack.push(c);
                console.log("Metemos a "+c);
                var aux_val = valor.slice(1);
                stack.push(aux_val);
                console.log("Metemos a "+aux_val);
                //expression.shift();//Quitar primer elemento
                index++;
            }
            else if(valor[0] === 'r'){
                if(valor[1] === '0'){
                    console.log('Cadena valida');
                    break;
                }
                var regla = _this.numRule.get(valor[1]);
                console.log("Conseguimos a la regla");
                console.log(regla);
                
                var leftSide = regla[0];
                var tamano = 2*(regla.length-1);
                console.log("El tamano es "+tamano);
                console.log("Pila antes");
                console.log(stack);
                for(var i =0; i < tamano; i++){
                    stack.pop();
                }
                console.log("Pila despues");
                console.log(stack);

                var tope = stack[stack.length-1];
                console.log("Mi tope es "+tope);
                stack.push(leftSide);
                console.log("Meto abajo a "+leftSide);
                var adonde = tablaResultado.get(tope).get(leftSide);
                console.log("Metemos adonde con "+adonde);
                stack.push(adonde);
            }
        }
    }
}


