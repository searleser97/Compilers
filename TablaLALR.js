function lalr(){
    var _this = this;

    // _this.make_hash = require('object-hash');
    _this.rules = new Map();
    _this.terminals = new Set();
    _this.nonTerminals= new Set();
    _this.startingNonTerminal = "";
    _this.ruleNum = new Map();
    _this.numRule = new Map();
    _this.symbols = new Set();
    _this.appRS= new Map();
    _this.setsLALR=[];
    _this.idSetLALR=new Map();
    _this.lexer = null;

    _this.constructor = function(reglas,terminales,noTerminales,inicioGramatica, lexer){
        _this.rules = reglas;
        _this.terminals= terminales;
        _this.nonTerminals=noTerminales;
        _this.startingNonTerminal=inicioGramatica;
        _this.lexer = lexer;
    }

    _this.initialize = function(){
        _this.terminals.add('$');
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
        var aux = array.rule[pos1];     
        array.rule[pos1] = array.rule[pos2];
        array.rule[pos2] = aux;
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
                    column.set(rTerminal.terminal,"r"+_this.ruleNum.get(aux.toString()));
                }
            }
        }
    }

    _this.tablaLR1 = function(){
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
        ruleA.push((_this.rules).get(_this.startingNonTerminal)[0][0]);

        computeFirst.push(_this.returnRuleTerminal(ruleA,"$"));
        console.log("computeFirst");
        console.log(computeFirst);
        
        var mainSet = [];
        mainSet = _this.closure1(computeFirst);
        console.log("mainSet");
        console.log(mainSet)
        //console.log(mainSet);

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
                    if(nonRepeated.has(hashSet)){
                        if(_this.terminals.has(s))//Checar
                            tableValue += "d";
                        tableValue += nonRepeated.get(hashSet);
                        vertical.set(s, tableValue);                         
                    }
                    else{                                                   
                        contador += 1;                                        
                        nonRepeated.set(hashSet, contador);
                        stack.push(analisis);                                         
                        allSets.push(analisis);
                        if(_this.terminals.has(s))//Checar
                            tableValue += "d"; 
                        tableValue += contador;                                       
                        vertical.set(s, tableValue);
                    }
                }
                else{
                    vertical.set(s,"");
                }   

                
            }
            var idCurrent = "";
            idCurrent += nonRepeated.get(objectHash.sha1(mainSet));
            finalTable.set(idCurrent, new Map([...vertical]));
                      
        }

        _this.setsLALR = [...allSets];
        _this.idSetLALR = nonRepeated;

        _this.setReductions(allSets,nonRepeated,finalTable);
        return finalTable;
    }

    _this.identificaKernel = function(conjunto){
        var identificadoresParciales = [];
        var identicadorConjuntoKernel = "";
        for(var elemento of conjunto)
            identificadoresParciales.push(elemento.rule.toString());
        identificadoresParciales.sort();
        identicadorConjuntoKernel = identificadoresParciales.toString();
        return identicadorConjuntoKernel;
    }

    _this.reductionsLALR= function(stateElement,resultlr1){
        for(var edoConElementos of stateElement){
            for(var elemento of edoConElementos[1]){
                var arr_aux = [...elemento.rule];
                if(arr_aux[arr_aux.length - 1] === '.'){                
                    arr_aux.pop();                                      
                    var numReduccion = "r";                             
                    numReduccion += _this.ruleNum.get(arr_aux.toString());
                    var filaTabla = edoConElementos[0];
                    var colTabla = resultlr1.get("" + filaTabla);           

                    colTabla.set(elemento.terminal, numReduccion);          
                }
            }
        }
    }

    _this.tablaLALR= function(){
        var resultlr1 = _this.tablaLR1();

        var stateElement = new Map()
        var newStates = new Map();
        var unique = new Map();
        //var idKernel = "";
        
        for(var conjunto of _this.setsLALR){
            var idKernel = _this.identificaKernel(conjunto);
            var idSet = _this.idSetLALR.get(objectHash.sha1(conjunto)) + "";
            if(!unique.has(idKernel)){
                unique.set(idKernel, idSet);
                newStates.set(idSet, idSet);
                stateElement.set(idSet, conjunto);
            }else{
                var getKernel = unique.get(idKernel);
                newStates.set(idSet, getKernel);
                var aux_e = stateElement.get(getKernel);
                for(var e of conjunto){
                    aux_e.push(e);
                }
                resultlr1.delete(idSet + "");
            }
        }

        for(var row of resultlr1){
            for(var vertical of row[1]){
                if(vertical[1].length === 0){
                    continue;
                }else if(vertical[1][0] === "r"){

                    var aux_space = resultlr1.get(row[0]);
                    aux_space.set(vertical[0], "");

                }else if(vertical[1][0] === "d"){

                    var aux_space = resultlr1.get(row[0]);
                    var pastState="";
                    for(var s = 1; s < vertical[1].length; s++){
                        pastState = pastState + vertical[1][s] + "";
                    }
                    var nuevoDesplazamiento = "d" + newStates.get(pastState + "");

                    aux_space.set(vertical[0], nuevoDesplazamiento);
                }else{
                    var aux_space = resultlr1.get(row[0]);
                    var pastState = "";
                    var newState = "";
                    for(var s = 0; s < vertical[1].length; s++){
                        pastState += vertical[1][s] + "";
                    }
                    newState = newStates.get(pastState + "");
                    aux_space.set(vertical[0], newState);
                }
            }
        }

        //var gramaticaNumerada = numeraReglasGramatica(producciones);
        _this.reductionsLALR(stateElement,resultlr1); 
        return resultlr1;
    }

    _this.checkExpression = function(){
        var tablaResultado=_this.tablaLALR();
        var stack=[];
        stack.push('0');
        // var index =0;
        let nextToken = _this.lexer.getNextToken();
        while(true){
            console.log("Nuestra pila al iniciar es ");
            console.log(stack);
            console.log("NUEVA ITERACION");
            var e = stack[stack.length-1];
            console.log("Sacamos a "+e);
            // var c = expression[index];
            var c = TOKEN[nextToken.token];
            console.log("Analizamos al caracter "+c);
            var valor = tablaResultado.get(e).get(c);
            console.log("Nuestro valor obtenido es "+valor);
            if(valor === undefined){
                alert("ERROR");
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
                // index++;
                nextToken = _this.lexer.getNextToken();
            }
            else if(valor[0] === 'r'){
                if(valor[1] === '0'){
                    alert('Cadena valida');
                    break;
                }
                var aux_arr = valor.slice(1);
                var regla = _this.numRule.get(aux_arr);
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


