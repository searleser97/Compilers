
/*
var e1 = new Estado(0,false);
var e2 = new Estado(1,true);
e1.addTrans('a',e2);
a1.totalTransiciones.push(new TransicionTotal(e1.id, 'a', e2.id));
a1.inicial = e1;
a1.aceptados.push(e2);
a1.alfabeto.add('a');
*/

/*
var a1 = new Automata();
a1.basico('s');

a1.cerradura(new Estado(++contador, 'x'));

var a2 = new Automata();
a2.basico('a');
*/

/*
var e1 = a1.aceptados.pop();
var t1 = a2.inicial.transiciones.pop();
var e2 = t1.destino;
totalTransiciones.push(new TransicionTotal(e1.id, t1.simbolo.toString(), e2.id));
*/
//a1.concatenar(a2);
//a1.unir(a2);

var a1 = new Automata();
a1.basico('s');

var a2 = new Automata();
a2.basico('t');

a1.unir(a2);
a1.cerraduraPositiva();
createFSMDiagram(a1);

/* 
var a3 = new Automata();
a3.basico('z');

a2.concatenar(a3);

a1.cerraduraPositiva();

a1.unir(a2);
//a1.concatenar(a2); */




//a1.unir(a3);


var inn = '' +
    'A 0 A\n' +
    'A 1 A\n' +
    'A 0 B\n' +
    'A 1 C\n' +
    'B 0 D\n' +
    'C 1 D\n' +
    'D 0 D\n' +
    'D 1 D';
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
var acceptedStatesStr = 'D';
//document.getElementById('linesToEval').value = file;
//document.getElementById('fsm').value = inn;
//document.getElementById('acStates').value = acceptedStatesStr;
//document.getElementById('startPoint').value = 'A';
// global variables needed
var lineNumber = 0;
var acceptedOrRejected = [];
var way = [];
var interval;
var interval2;
var symbolPos = 0;
var fsm = {};
var nodesIds = {};
var color = 'blue';
var acceptedStates = {}
var nodes = [];
var edges = [{}];
var startPoints;
var lines;
var symbolsToPrint = [];
var lineSpan;
var nMaxlineNumberDigits;
var lineIsPending;
var isStartPoint = {};
var output = document.getElementById('output');
var stringOrChar = 2;
var isPDA = false;
var stacks = [];
var actualStatesWithItsStacks = [];

// end of global variables needed
function createFSMDiagram(automata) {
    clearInterval(interval);
    fsm = {};
    nodesIds = {};
    acceptedStates = {}
    nodes = [];
    var edges = [{}];
    isStartPoint = {};
    startPoints = [automata.inicial.id];
    var acceptedStatesArr = automata.aceptadosID;
    for (var i in acceptedStatesArr)
        acceptedStates[acceptedStatesArr[i]] = true;
    for (st in startPoints)
        isStartPoint[startPoints[st]] = true;
    var fromTo = {};
    // var lines = (document.getElementById('fsm').value).split('\n');
    for (var trans of totalTransiciones) {
        // var line = lines[i];
        // var values = line.split(' ');
        var from = String(trans.inicial);
        var symbol = String(trans.simbolo);
        var to = String(trans.final);
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
        /* // nodes: { borderWidth: 3 },
        // interaction: { hover: true }
        edges: {
            smooth: {
                enabled: true,
                type: "dynamic",
                roundness: 0.5
            }
        },
        physics: true */
    };
    var network = new vis.Network(container, data, options);
    // var  network = new vis.Network(container, data);
}

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
