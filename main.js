var automatas = [];
var strToEval = "";
var aTokens = [];
var globalGrammar = null;

/*===================================================================
=========                 AUTÓMATAS                     =============
===================================================================*/

// createFirstAutomaton();
// createSecondAutomaton();
// createThirdAutomaton();
// createFourthAutomaton();

$( document ).ready(function() {
    let selected = $('#sel_automata_1').val();
    if (selected != null || selected != undefined) {
    	createFSMDiagram(automatas[selected]);
    }
});

function populateSelects() {
	var indexLast = 0;
  $('#sel_automata_to_use').html('');
  $('#sel_automata_1').html('');
  $('#sel_automata_2').html('');
  for (let i = 0; i < automatas.length; i++) {
    let opt = new Option(i, i);
    opt.id = "Option"+i;
    if (automatas[i] == null || automatas[i] == undefined){
      $(opt).attr('disabled', true);
      $(opt).addClass('opt'+i);
    }else{
    	indexLast = i;
    }
    $('#sel_automata_to_use').append($(opt).clone());
    $('#sel_automata_1').append($(opt).clone());
    $('#sel_automata_2').append($(opt).clone());
  }
  $('#sel_automata_to_use').val(indexLast);
  if (automatas[indexLast] != undefined) {
	  createFSMDiagram(automatas[indexLast]);
  }
}

function addAutomata(automata) {
  if (automata.idAutomata < automatas.length)
    automatas[automata.idAutomata] = automata;
  else
    automatas.push(automata);
}

function createBasicAutomata(symbol) {
  let a = new Automata()
  a.basico(symbol);
  addAutomata(a);
  return a;
}

$('#operations').change(function () {
  self_operations = new Set(['positive', 'kleene', 'quantifier', 'transformToAFD', 'superJoin']);
  let selected = $(this).val();

  if (selected == 'basic') {
    $('#id_nuevo_basico').attr('type', 'text');
    $('#sel_automata_1').attr('disabled', true);
    $('#sel_automata_2').attr('disabled', true);
  } else if (self_operations.has(selected)) {
    $('#sel_automata_1').attr('disabled', false);
    $('#sel_automata_2').attr('disabled', true);
  } else {
    $('#id_nuevo_basico').attr('type', 'hidden');
    $('#sel_automata_1').attr('disabled', false);
    $('#sel_automata_2').attr('disabled', false);
  }
});

$('#submit').click(function () {
  let automataA = automatas[$('#sel_automata_1').val()];
  let automataB = automatas[$('#sel_automata_2').val()];
  let operation = $('#operations').val();
  if (automataA == undefined && operation != 'basic') {
    alert('Cree un automata primero');
    return;
  }
  switch (operation) {
    case 'basic':
      automataA = createBasicAutomata($('#id_nuevo_basico').val());
      break;
    case 'join':
      automataA.unir(automataB);
      break;
    case 'superJoin':
      automataA.superUnir();
      break;
    case 'concatenate':
      automataA.concatenar(automataB);
      break;
    case 'kleene':
      automataA.cerraduraKleene();
      break;
    case 'positive':
      automataA.cerraduraPositiva();
      break;
    case 'quantifier':
      automataA.cerraduraInterrogacion();
      break;
    case 'transformToAFD':
      var usados = new Set();
      var value = 0;
      if($( "#evalExprBtn" ).hasClass( "regexToDFA" )){
      	automataA = automatas[$('#sel_automata_to_use').val()];
      }
      for (var e of automataA.aceptados){
        var nToken = "";
        while (nToken == "" || nToken == null || usados.has(nToken)){
          nToken = prompt("Ingrese el token del estado "+e.id+": ", value+=10);
        }
        e.token = parseInt(nToken, 10);
        usados.add(nToken);
      }
      addAutomata(automataA = automataA.transformar());
      break;
  }
  populateSelects();
  // createFSMDiagram(automataA);
});

$('#sel_automata_to_use').change(function () {
  let selected = $(this).val();
  $('#tokensOutput').val('');
  tokens = [];
  $('#evalExprBox').attr("hidden", true);
  $('#tokensBox').attr("hidden", true);
  if (automatas[selected].afd === true) {
    $('#buttonTable').attr('disabled', false);
    $('#lexicEvalBtn').attr('disabled', false);
  }else{
    $('#buttonTable').attr('disabled', true);
    $('#lexicEvalBtn').attr('disabled', true);
  }
  console.log(automatas[selected]);
  createFSMDiagram(automatas[selected]);
});

$('#lexicEvalBtn').click(function () {
  let automata = automatas[$('#sel_automata_to_use').val()];
  strToEval = "";
  while (strToEval == "" || strToEval == null) {
    strToEval = prompt("Ingrese la cadena a evaluar: ", "cadena");
  }
  aTokens = [];
  var tokens = lexicalAnalysis(automata, strToEval);
  // console.log(tokens);
  $('#tokensOutput').val(tokens);
  $('#tokensBox').attr("hidden", false);
  $('#strBox').attr("hidden", false);
  $('#strOutput').text(strToEval);
  if($( "#evalExprBtn" ).hasClass( "evalArit" ) || $( "#evalExprBtn" ).hasClass( "regexToDFA" ) || $( "#evalExprBtn" ).hasClass( "generateGrammar" )){
  	$('#evalExprBox').attr("hidden", false);
  }
});

$(document).on('click', '.showTable', function() {
  let automata = automatas[$('#sel_automata_to_use').val()];
  showTable(generateTableFromAFD(automata, fsm));
  $("#buttonTable").html('Ocultar Tabla');
  $(this).removeClass('showTable').addClass('dropTable');
});

$(document).on('click', '.dropTable', function() {
  dropTable();
  $("#buttonTable").html('Mostrar Tabla');
  $(this).removeClass('dropTable').addClass('showTable');
});

$('#evalExprBtn').click(function () {
	let vSelected = $('#sel_automata_to_use').val();
	if($( "#evalExprBtn" ).hasClass( "evalArit" )){
		alert("El resultado es: "+ new EvalExpAr(automatas[vSelected], strToEval).AnalizarExp());	
		populateSelects();
		$("#sel_automata_to_use option").each(function(index){
			if ($(this).val() == vSelected) {
				$(this).attr('selected', 'selected');
			}
		});
	}else if($( "#evalExprBtn" ).hasClass( "regexToDFA" )){
    addAutomata(new EvalRegex(automatas[$('#sel_automata_to_use').val()], strToEval).AnalizarExp());
    populateSelects();
    $("#sel_automata_to_use option").each(function(index){
      if ($(this).val() == vSelected) {
        $(this).attr('selected', 'selected');
      }
    });
  }else if($( "#evalExprBtn" ).hasClass( "generateGrammar" )){
    let grammarMap = new GenGramaticas(automatas[$('#sel_automata_to_use').val()], strToEval).AnalizarExp();
    if (grammarMap == null) {
      alert("ERROR");
    }else{
      console.log(grammarMap);
      let grammar = new Grammar();
      console.log(grammar);
      grammar.constructor(grammarMap);
      console.log(grammar);
      grammar.increase();
      console.log(grammar);
      globalGrammar = grammar;
    }
    populateSelects();
    $("#sel_automata_to_use option").each(function(index){
      if ($(this).val() == vSelected) {
        $(this).attr('selected', 'selected');
      }
    });
  }
});

$(document).on('click', '#HomeSide', function() {
  $(this).addClass('active');
  $('#CalcSide').removeClass('active');
  $('#RegexSide').removeClass('active');
  $('#GenGramSideSide').removeClass('active');
	alert("Podrás crear autómatas y realizar operaciones con ellos, así como evaluar expresiones con los AFD.");
	automatas = [];
	contador = 0;
	contAutom = 0;
	populateSelects();
	$('#sel_automata_1').attr("hidden", false);
	$('#sel_automata_2').attr("hidden", false);
    $('#operations').attr('hidden', false);
	$('#submit').attr("hidden", false);
	$('#tokensBox').attr("hidden", true);
	$('#strBox').attr("hidden", true);
	$('#evalExprBox').attr("hidden", true);
	$('#strOutput').text("");
    $('#BasicOption').attr('disabled', false);
    $('#JoinOption').attr('disabled', false);
    $('#superJoinOption').attr('disabled', false);
    $('#ConcatenateOption').attr('disabled', false);
    $('#KleeneOption').attr('disabled', false);
    $('#PositiveOption').attr('disabled', false);
    $('#InterrogativeOption').attr('disabled', false);
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  $('#grammarFile').attr("hidden", true);
  $('#automatonFile').attr("hidden", false);
});

$(document).on('click', '#CalcSide', function() {
  $(this).addClass('active');
  $('#HomeSide').removeClass('active');
  $('#RegexSide').removeClass('active');
  $('#GenGramSideSide').removeClass('active');
	alert("Calculadora por medio de un AFD y descenso recursivo.");
	automatas = [];
	contador = 0;
	contAutom = 0;
	createThirdAutomaton();
	$('#sel_automata_1').attr("hidden", true);
	$('#sel_automata_2').attr("hidden", true);
	$('#submit').attr("hidden", true);
    $('#operations').attr('hidden', true);
	$('#tokensBox').attr("hidden", true);
	$('#strBox').attr("hidden", true);
	$('#evalExprBox').attr("hidden", true);
	$('#strOutput').text("");
    $('#evalExprBtn').removeClass('regexToDFA');
    $('#evalExprBtn').removeClass('generateGrammar');
    $('#evalExprBtn').addClass('evalArit');
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  $('#grammarFile').attr("hidden", true);
  $('#automatonFile').attr("hidden", false);
});

$(document).on('click', '#RegexSide', function() {
  $(this).addClass('active');
  $('#CalcSide').removeClass('active');
  $('#HomeSide').removeClass('active');
  $('#GenGramSideSide').removeClass('active');
  alert("Analizador de expresiones regulares por medio de un AFD y descenso recursivo.");
  automatas = [];
  contador = 0;
  contAutom = 0;
  createFourthAutomaton();
  $('#sel_automata_1').attr("hidden", true);
  $('#sel_automata_2').attr("hidden", true);
  $('#submit').attr("hidden", false);
    $('#operations').attr('hidden', false);
  $('#tokensBox').attr("hidden", true);
  $('#strBox').attr("hidden", true);
  $('#evalExprBox').attr("hidden", true);
  $('#strOutput').text("");
    $('#BasicOption').attr('disabled', true);
    $('#JoinOption').attr('disabled', true);
    $('#superJoinOption').attr('disabled', true);
    $('#ConcatenateOption').attr('disabled', true);
    $('#KleeneOption').attr('disabled', true);
    $('#PositiveOption').attr('disabled', true);
    $('#InterrogativeOption').attr('disabled', true);
    $('#evalExprBtn').removeClass('evalArit');
    $('#evalExprBtn').removeClass('generateGrammar');
    $('#evalExprBtn').addClass('regexToDFA');
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  $('#grammarFile').attr("hidden", true);
  $('#automatonFile').attr("hidden", false);
});

$(document).on('click', '#GenGramSide', function() {
  $(this).addClass('active');
  $('#CalcSide').removeClass('active');
  $('#HomeSide').removeClass('active');
  $('#RegexSide').removeClass('active');
  alert("Analizador de gramáticas por medio de un AFD y descenso recursivo.");
  automatas = [];
  contador = 0;
  contAutom = 0;
  createFifthAutomaton();
  $('#sel_automata_1').attr("hidden", true);
  $('#sel_automata_2').attr("hidden", true);
  $('#submit').attr("hidden", true);
    $('#operations').attr('hidden', true);
  $('#tokensBox').attr("hidden", true);
  $('#strBox').attr("hidden", true);
  $('#evalExprBox').attr("hidden", true);
  $('#strOutput').text("");
    $('#BasicOption').attr('disabled', true);
    $('#JoinOption').attr('disabled', true);
    $('#superJoinOption').attr('disabled', true);
    $('#ConcatenateOption').attr('disabled', true);
    $('#KleeneOption').attr('disabled', true);
    $('#PositiveOption').attr('disabled', true);
    $('#InterrogativeOption').attr('disabled', true);
    $('#evalExprBtn').removeClass('evalArit');
    $('#evalExprBtn').removeClass('regexToDFA');
    $('#evalExprBtn').addClass('generateGrammar');
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  $('#grammarFile').attr("hidden", false);
  $('#automatonFile').attr("hidden", true);
});

$('#downloadBtn').click(function () {
  let automata = automatas[$('#sel_automata_to_use').val()];
  var a = document.createElement("a");
  console.log(automata);
  var cache = [];
  var table = generateTableFromAFD(automata,fsm);
  console.log(table);
  var file = new Blob([JSON.stringify(table)], {type: 'text/plain;charset=utf-8'});
  cache = null;
  a.href = URL.createObjectURL(file);
  var d = new Date();
  var date = d.getDate().toString()+"-";
  date+=(d.getMonth()+1).toString()+"-";
  date+=d.getFullYear().toString()+"-";
  date+=d.getHours().toString()+":";
  date+=d.getMinutes().toString();
  a.download = 'automata'+date+'.json';
  a.click();
});

$('#loadBtn').change(function () {

  const fileToLoad = $('#loadBtn').prop('files')[0];
    
  const fileReader = new FileReader();
  fileReader.readAsText(fileToLoad, "UTF-8");
  fileReader.onload = function(fileLoadedEvent) {
      const textFromFileLoaded = fileLoadedEvent.target.result;
      console.log(textFromFileLoaded);
      const json = JSON.parse(textFromFileLoaded);
      console.log(json);
      addAutomata(generateAFDFromTable(json));
      populateSelects();
  }
  
  // var json_aux = '{"25":{"+":26,"-":27,"*":28,"/":29,"(":30,")":31,"[0-9]":32,".":null,"TOK":-1},"26":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":null,".":null,"TOK":10},"27":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":null,".":null,"TOK":20},"28":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":null,".":null,"TOK":30},"29":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":null,".":null,"TOK":40},"30":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":null,".":null,"TOK":50},"31":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":null,".":null,"TOK":60},"32":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":32,".":33,"TOK":70},"33":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":34,".":null,"TOK":-1},"34":{"+":null,"-":null,"*":null,"/":null,"(":null,")":null,"[0-9]":34,".":null,"TOK":70}}';
  // json = JSON.parse(json_aux);
  // console.log(json);

  // addAutomata(generateAFDFromTable(json));
  // populateSelects();
});

$('#downloadGrammarBtn').click(function () {
  if (globalGrammar == null) { 
    alert("No se encontró gramática para descargar");
  } else {
    console.log(globalGrammar);
    var a = document.createElement("a");
    var cache = [];
    var file = new Blob([JSON.stringify(globalGrammar)], {type: 'text/plain;charset=utf-8'});
    cache = null;
    a.href = URL.createObjectURL(file);
    var d = new Date();
    var date = d.getDate().toString()+"-";
    date+=(d.getMonth()+1).toString()+"-";
    date+=d.getFullYear().toString()+"-";
    date+=d.getHours().toString()+":";
    date+=d.getMinutes().toString();
    a.download = 'gramatica'+date+'.json';
    a.click();
  }
});

$('#loadGrammarBtn').change(function () {

  const fileToLoad = $('#loadGrammarBtn').prop('files')[0];
    
  const fileReader = new FileReader();
  fileReader.readAsText(fileToLoad, "UTF-8");
  fileReader.onload = function(fileLoadedEvent) {
      const textFromFileLoaded = fileLoadedEvent.target.result;
      console.log(textFromFileLoaded);
      const json = JSON.parse(textFromFileLoaded);
      console.log(json);
      globalGrammar = new Grammar(json);
      console.log(globalGrammar);
  }
});