var automatas = [];
var strToEval = "";
var aTokens = [];

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
      	console.log("Hola")
      	console.log($('#sel_automata_to_use').val());
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
  if($( "#evalExprBtn" ).hasClass( "evalArit" ) || $( "#evalExprBtn" ).hasClass( "regexToDFA" )){
  	$('#evalExprBox').attr("hidden", false);
  }
});

$(document).on('click', '.showTable', function() {
  let automata = automatas[$('#sel_automata_to_use').val()];
  showTable(generateTable(automata, fsm));
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
	console.log($('#sel_automata_to_use').val())
	if($( "#evalExprBtn" ).hasClass( "evalArit" )){
		console.log("Here");
		alert("El resultado es: "+ new EvalExpAr(automatas[vSelected], strToEval).AnalizarExp());	
		populateSelects();
		$("#sel_automata_to_use option").each(function(index){
			if ($(this).val() == vSelected) {
				$(this).attr('selected', 'selected');
			}
		});
	}else if($( "#evalExprBtn" ).hasClass( "regexToDFA" )){
		console.log("There");
		addAutomata(new EvalRegex(automatas[$('#sel_automata_to_use').val()], strToEval).AnalizarExp());
		populateSelects();
		$("#sel_automata_to_use option").each(function(index){
			if ($(this).val() == vSelected) {
				$(this).attr('selected', 'selected');
			}
		});
	}
});

$(document).on('click', '#HomeSide', function() {
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
});

$(document).on('click', '#CalcSide', function() {
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
    $('#evalExprBtn').addClass('evalArit');
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
});

$(document).on('click', '#RegexSide', function() {
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
    $('#evalExprBtn').addClass('regexToDFA');
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
});