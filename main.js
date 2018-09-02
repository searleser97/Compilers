/*===================================================================
=========                 AUTÓMATAS                     =============
===================================================================*/

// Autómata 1
var a1 = new Automata();
a1.basico('+');
var a2 = new Automata();
a2.basico('-');
a1.unir(a2);
a1.cerraduraInterrogacion();
var a3 = new Automata();
a3.basico('D');
a3.cerraduraPositiva();
a1.concatenar(a3);



// Autómata 2
var a4 = new Automata();
a4.basico('+');
var a5 = new Automata();
a5.basico('-');
a4.unir(a5);
a4.cerraduraInterrogacion();
var a6 = new Automata();
a6.basico('D');
a6.cerraduraPositiva();
a4.concatenar(a6);
var a7 = new Automata();
a7.basico('.');
a4.concatenar(a7);
var a7 = new Automata();
a7.basico('D');
a7.cerraduraPositiva();
a4.concatenar(a7);
var a8 = new Automata();
a8.basico('E');
var a9 = new Automata();
a9.basico('e');
a8.unir(a9);
var a10 = new Automata();
a10.basico('+');
var a11 = new Automata();
a11.basico('-');
a10.unir(a11);
a10.cerraduraInterrogacion();
a8.concatenar(a10);
var a12 = new Automata();
a12.basico('D');
a12.cerraduraPositiva();
a8.concatenar(a12);
a8.cerraduraInterrogacion();
a4.concatenar(a8);



// Autómata 3
var a13 = new Automata();
a13.basico('L');
var a14 = new Automata();
a14.basico('L');
var a15 = new Automata();
a15.basico('D');
a14.unir(a15);
a14.cerraduraPositiva();
a13.concatenar(a14);



// Autómata 4
var a16 = new Automata();
a16.basico('S');
var a17 = new Automata();
a17.basico('T');
a16.unir(a17);
a16.cerraduraPositiva();

a16.transformar();

// Elegir el autómata a dibujar
createFSMDiagram(a16);


/*===================================================================
=========        VARIABLES INICIALIZACIÓN WEB           =============
===================================================================*/
/*
var inn = '' +
    'A 0 A\n' +
    'A 1 A\n' +
    'A 0 B\n' +
    'A 1 C\n' +
    'B 0 D\n' +
    'C 1 D\n' +
    'D 0 D\n' +
    'D 1 D';
*/
/*
var file = '' +
    '00\n' +
    '000\n' +
    '01\n' +
    '1101\n' +
    '10101\n' +
    '0\n' +
    '11\n' +
    '1\n' +
    '10\n' +
    '110';
*/

/*===================================================================
=========             VARIABLES GLOBALES                =============
===================================================================*/
//var acceptedStatesStr = 'D';
//document.getElementById('linesToEval').value = file;
//document.getElementById('fsm').value = inn;
//document.getElementById('acStates').value = acceptedStatesStr;
//document.getElementById('startPoint').value = 'A';
// global variables needed
//var lineNumber = 0;
//var acceptedOrRejected = [];
//var way = [];
//var symbolPos = 0;
//var symbolsToPrint = [];
//var lineSpan;
//var nMaxlineNumberDigits;
//var lineIsPending;
//var output = document.getElementById('output');
//var output = "Hola";
//var stringOrChar = 2;
//var stacks = [];
//var actualStatesWithItsStacks = [];

/*===================================================================
=========              VARIABLES DIBUJO                 =============
===================================================================*/
var isPDA = false;
var isStartPoint = {};
var fsm = {};
var nodesIds = {};
var color = 'blue';
var acceptedStates = {}
var nodes = [];
var edges = [{}];
var startPoints;
var lines;
var interval;
var interval2;


/*===================================================================
=========               FUNCIÓN DIBUJAR                 =============
===================================================================*/
function createFSMDiagram(automata) {
    
    // Muestra alfabeto en consola para verificar
    for (let item of automata.alfabeto){
        console.log(item + ' ');
    }

    clearInterval(interval);
    fsm = {};
    nodesIds = {};
    acceptedStates = {}
    nodes = [];
    var edges = [{}];
    isStartPoint = {};

    // Tomamos el ID del estado inicial
    startPoints = [automata.inicial.id]; 

    // Tomamos los IDs de los estados finales del autómata
    var acceptedStatesArr = automata.aceptadosID; 

    // Pintamos estados finales
    for (var i in acceptedStatesArr)
        acceptedStates[acceptedStatesArr[i]] = true;

    // Pintamos estados iniciales
    for (st in startPoints)
        isStartPoint[startPoints[st]] = true;

    var fromTo = {};
    // var lines = (document.getElementById('fsm').value).split('\n');

    // Recorremos todas las transiciones del autómata
    for (var trans of automata.getAristas()) {
        // var line = lines[i];
        // var values = line.split(' ');

        // Tomamos el punto de partida
        var from = String(trans.inicial);

        // Símbolo de la transición
        var symbol = String(trans.simbolo);

        // Destino de la arista
        var to = String(trans.final);

        /*------------------------------------------------
		****************     NO MOVER     ****************
		------------------------------------------------*/
        if (nodesIds[from] === undefined) {
            var background = 'white';
            if (isStartPoint[from])
                background = 'lightgreen';
            if (acceptedStates[from])
                nodes.push({
                    id: from,
                    label: from,
                    color: {
                        background: background,
                        border: 'black'
                    },
                    borderWidth: 8,
                    // physics: false,
                    value: 5
                });
            else
                nodes.push({
                    id: from,
                    label: from,
                    color: {
                        background: background,
                        border: 'black'
                    },
                    // physics: false,
                    value: 5
                });
            nodesIds[from] = true;
        }
        if (nodesIds[to] === undefined) {
            var background = 'white';
            if (isStartPoint[to])
                background = 'lightgreen';
            if (acceptedStates[to])
                nodes.push({
                    id: to,
                    label: to,
                    color: {
                        background: background,
                        border: 'black'
                    },
                    borderWidth: 8,
                    // physics: false,
                    value: 5
                });
            else
                nodes.push({
                    id: to,
                    label: to,
                    color: {
                        background: background,
                        border: 'black'
                    },
                    // physics: false,
                    value: 5
                });
            nodesIds[to] = true;
        }
        if (fromTo[from] === undefined)
            fromTo[from] = {};
        if ((typeof fsm[from]) != 'object')
            fsm[from] = {};
        var stackOps = [epsilon, epsilon];
        if (isPDA) {
            symbol = symbol.split(',');
            stackOps = [symbol[1], symbol[2]];
            symbol = symbol[0];
        }
        if (symbol[0] == '\\') {
            if (symbol[1] == 's') {
                symbol = ' ';
                if (fsm[from][symbol] == undefined)
                    fsm[from][symbol] = [];
                fsm[from][symbol].push([to, stackOps[0], stackOps[1]]);
                symbol = '\\s'
            } else if (symbol[1] == 'e') {
                symbol = epsilon;
                if (fsm[from][symbol] == undefined)
                    fsm[from][symbol] = [];
                fsm[from][symbol].push([to, stackOps[0], stackOps[1]]);
            } else {
                var start = symbol[2];
                var end = symbol[4];
                for (var i = start.charCodeAt(0); i < end.charCodeAt(0) + 1; i++) {
                    if (fsm[from][String.fromCharCode(i)] == undefined)
                        fsm[from][String.fromCharCode(i)] = [];
                    fsm[from][String.fromCharCode(i)].push([to, stackOps[0], stackOps[1]]);
                }
            }
        } else {
            if (fsm[from][symbol] == undefined) fsm[from][symbol] = [];
            fsm[from][symbol].push([to, stackOps[0], stackOps[1]]);
        }
        if (symbol[0] == '\\' && symbol[1] == '[')
            symbol = symbol.substr(1, 5);
        if (fromTo[from][to] === undefined) {
            if (isPDA)
                fromTo[from][to] = '{' + symbol + ',' + stackOps[0] + ',' + stackOps[1] + '}';
            else
                fromTo[from][to] = symbol;
        } else {
            if (isPDA)
                fromTo[from][to] = fromTo[from][to] + ',' + '{' + symbol + ',' + stackOps[0] + ',' + stackOps[1] + '}';
            else
                fromTo[from][to] = fromTo[from][to] + ',' + symbol;
        }
    }
    for (var from in fromTo) {
        for (var to in fromTo[from]) {
            // var randcolor = getRandomColor();
            var randcolor = randomColor({
                luminosity: 'dark'
            });
            var label = fromTo[from][to];
            edges.push({
                from: from,
                to: to,
                label: label,
                arrows: 'to',
                color: {
                    color: randcolor
                },
                font: {
                    strokeWidth: 5,
                    strokeColor: randcolor,
                    color: 'whitesmoke'
                },
                shadow: true,
                value: 0
            });
        }
    }
    // freeing space
    fromTo = undefined;
    nodesIds = undefined;
    /*console.log(fsm);
    console.log(acceptedStates);
    console.log(startPoint);
    console.log(nodes);
    console.log(edges);*/
    //create a network
    var container = document.getElementById('mynetwork');
    nodes = new vis.DataSet(nodes);
    edges = new vis.DataSet(edges);
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        // nodes: { borderWidth: 3 },
        // interaction: { hover: true }
        // edges: {
        //     smooth: {
        //         type: 'diagonalCross'
        //     }
        // }
    };
    var network = new vis.Network(container, data, options);
}

/*
function setModeStringOrChar() {
    var textMode = document.getElementById("textMode");
    if (stringOrChar == 2) {
        textMode.innerHTML = '<b>STRING</b>';
        stringOrChar = 1;
    } else {
        textMode.innerHTML = '<b>CHARACTER</b>';
        stringOrChar = 2;
    }
}

/*
function isPDANodeUnique(actualStates, nextStateWithStack) {
    for (r in actualStates) {
        if (nextStateWithStack[0] == actualStates[r][0]) {
            if (nextStateWithStack[1].length == actualStates[r][1].length) {
                if (nextStateWithStack[1].length == 0)
                    return false;
                for (var inde = 0; inde < nextStateWithStack[1].length; inde++) {
                    if (nextStateWithStack[1][inde] !== actualStates[r][1][inde])
                        break;
                    return false;
                }
            }
        }
    }
    return true;
}

/*
function statesConnectedWithEpsilon(actualStates, visitedStates) {
    var localActualStates = [...actualStates];
    for (var index = 0; index < localActualStates.length; index++) {
        var actualState = localActualStates[index];
        if (actualState[0] !== undefined) {
            if (actualState[0][epsilon] !== undefined) {
                for (u in actualState[0][epsilon]) {
                    var stackOps = [actualState[0][epsilon][u][1], actualState[0][epsilon][u][2]];
                    var nextStateWithStack = [fsm[actualState[0][epsilon][u][0]],
                    [...actualState[1]]
                    ];
                    var canProceed = true;
                    if (stackOps[0] !== epsilon) {
                        if (stackOps[0] !== nextStateWithStack[1].pop())
                            canProceed = false;
                    }
                    if (stackOps[1] !== epsilon) {
                        for (var indexx = stackOps[1].length - 1; indexx > -1; indexx--)
                            nextStateWithStack[1].push(stackOps[1][indexx]);
                    }
                    if (canProceed) {
                        if (isPDANodeUnique(localActualStates, nextStateWithStack)) {
                            localActualStates.push(nextStateWithStack);
                            visitedStates.push([actualState[0][epsilon][u][0], nextStateWithStack[1]]);
                        }
                    }
                }
            }
        }
    }
    return [localActualStates, visitedStates];
}
/*
function evaluateLinesWithFSM() {
    output.innerHTML = '';
    symbolPos = 0;
    lineNumber = 0;
    acceptedOrRejected = [];
    way = [];
    symbolsToPrint = []
    lines = document.getElementById('linesToEval').value.split('\n');
    nMaxlineNumberDigits = parseInt(Math.log10(lines.length - 1)) + 1;
    var objSet = new Set();
    var actualStates = [];
    for (var i in lines) {
        line = lines[i];
        var symbols;
        if (stringOrChar == 1)
            symbols = line.split(' ');
        else
            symbols = line.split('');
        actualStates = [];
        for (k in startPoints) {
            actualStates.push([fsm[startPoints[k]],
            []
            ]);
        }

        var symbolNotInAlfabet = false;
        var nextStates = [];
        var flag1 = false;
        var auxActualStates = statesConnectedWithEpsilon(actualStates, []);
        actualStates = auxActualStates[0];
        var visitedStatesPerSymbol = auxActualStates[1];
        visitedStatesPerSymbol.push([startPoints[0],
        []
        ]);
        way.push(visitedStatesPerSymbol);
        symbolsToPrint.push('');
        for (var j in symbols) {
            debugger;
            var newActualStates = [];
            visitedStatesPerSymbol = [];
            flag1 = false;
            for (q in actualStates) {
                if (actualStates[q][0] !== undefined) {
                    nextStates = actualStates[q][0][symbols[j]];
                    if (nextStates == undefined) {
                        continue;
                    } else {
                        flag1 = true;
                    }
                    for (o in nextStates) {
                        var nextStateStack = [...actualStates[q][1]];
                        var canProceed = true;
                        if (nextStates[o][1] !== epsilon) {
                            if (nextStates[o][1] !== nextStateStack.pop())
                                canProceed = false;
                        }
                        if (nextStates[o][2] !== epsilon) {
                            for (var indexx = nextStates[o][2].length - 1; indexx > -1; indexx--)
                                nextStateStack.push(nextStates[o][2][indexx]);
                        }
                        if (canProceed) {
                            newActualStates.push([fsm[nextStates[o][0]],
                                nextStateStack
                            ]);
                            visitedStatesPerSymbol.push([nextStates[o][0], nextStateStack]);
                        }
                    }
                }
            }
            auxActualStates = statesConnectedWithEpsilon(newActualStates, visitedStatesPerSymbol);
            newActualStates = auxActualStates[0];
            visitedStatesPerSymbol = auxActualStates[1];
            actualStates = newActualStates;
            if (flag1) {
                way.push(visitedStatesPerSymbol);
                symbolsToPrint.push(symbols[j]);
            } else
                break;
        }
        way.push([]);
        symbolsToPrint.push('\0');
        var flag = false;
        for (p in visitedStatesPerSymbol) {
            if (acceptedStates[visitedStatesPerSymbol[p][0]] && visitedStatesPerSymbol[p][1].length == 0)
                flag = true;
        }
        if (flag)
            acceptedOrRejected.push('');
        else
            acceptedOrRejected.push(i);

    }
    way.push([]);
    symbolsToPrint.push('\0\0');
    play();
}

function changeNodeColor(nodeId, color) {
    nodes.update([{
        id: nodeId,
        color: {
            background: color
        }
    }]);
}

/*
function travelInStates() {
    if (lineIsPending) {
        printLineInterval();
        return;
    }

    if (symbolsToPrint[symbolPos] == '\0\0') {
        clearInterval(interval2);
        return;
    }
    lineSpan = document.createElement('span');
    lineSpan.id = 'line' + lineNumber;
    var nSpaces = nMaxlineNumberDigits - (parseInt(Math.log10(lineNumber)) + 1);
    var spaces = '';
    for (var i = 0; i < nSpaces; i++) {
        spaces += '&nbsp;&nbsp;';
    }
    lineSpan.innerHTML = spaces + lineNumber.toString() + ':&nbsp;';
    if (lineNumber > 0)
        output.innerHTML += '<br>';
    output.appendChild(lineSpan);
    output.scrollTop = output.scrollHeight;
    lineIsPending = true;
    printLineInterval();
}
*/

/*
function printLine() {
    if (symbolPos > 0) {
        var prevStates = way[symbolPos - 1];
        for (ps in prevStates) {
            if (isStartPoint[prevStates[ps][0]])
                changeNodeColor(prevStates[ps][0], 'lightgreen');
            else
                changeNodeColor(prevStates[ps][0], 'white');
        }
    }

    if (symbolsToPrint[symbolPos] == '\0') {
        var outputLine = document.getElementById('line' + lineNumber);
        if (acceptedOrRejected[lineNumber] != '') {
            outputLine.classList.add('highlightRed');
        } else {
            outputLine.classList.add('highlightGreen');
        }
        lineNumber += 1;
        symbolPos += 1;
        lineIsPending = false;
        clearInterval(interval2);
        travelInStates();
        return;
    }
    if (symbolsToPrint[symbolPos] == ' ')
        lineSpan.innerHTML += '&nbsp;';
    else
        lineSpan.innerHTML += symbolsToPrint[symbolPos];

    var states = way[symbolPos];
    for (s in states) {
        changeNodeColor(states[s][0], 'red');
    }
    symbolPos += 1;
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/*
function pause() {
    clearInterval(interval2);
}

function play() {
    travelInStates();
}


function printLineInterval() {
    interval2 = setInterval(function () {
        printLine()
    }, 1000);
}

function setPDA() {
    if (isPDA)
        isPDA = false;
    else
        isPDA = true;
}
*/