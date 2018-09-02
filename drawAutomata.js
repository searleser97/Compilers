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
    for (let acStates of acceptedStatesArr)
        acceptedStates[acStates] = true;

    // Pintamos estados iniciales
    for (let st of startPoints)
        isStartPoint[st] = true;

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

    //create a network
    var container = document.getElementById('mynetwork');
    nodes = new vis.DataSet(nodes);
    edges = new vis.DataSet(edges);
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);
}

