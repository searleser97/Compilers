var automatas = [];

/*===================================================================
=========                 AUTÓMATAS                     =============
===================================================================*/

createThirdAutomaton();

$( document ).ready(function() {
    let selected = $('#sel_automata_1').val();
    createFSMDiagram(automatas[selected]);
});

function populateSelects() {
  // $('#sel_automata_1').html('');
  $('#sel_automata_1').html('');
  $('#sel_automata_2').html('');
  for (let i = 0; i < automatas.length; i++) {
    let opt = new Option(i, i);
    if (automatas[i] == null || automatas[i] == undefined)
      $(opt).attr('disabled', true);
    // $('#sel_automata_1').append($(opt).clone());
    $('#sel_automata_1').append($(opt).clone());
    $('#sel_automata_2').append($(opt).clone());
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
      for (var e of automataA.aceptados){
        var nToken = "";
        while (nToken == "" || nToken == null || usados.has(nToken)){
          nToken = prompt("Ingrese el token del estado "+e.id+": ", "10");
        }
        e.token = parseInt(nToken, 10);
        usados.add(nToken);
      }
      addAutomata(automataA = automataA.transformar());
      break;
  }
  populateSelects();
  createFSMDiagram(automataA);
});

$('#sel_automata_1').change(function () {
  let selected = $(this).val();
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
  let automata = automatas[$('#sel_automata_1').val()];
  var strToEval = "";
  while (strToEval == "") {
    strToEval = prompt("Ingrese la cadena a evaluar: ", "abbacccdsstscababbssabcccaaddabccaddsstss");
    let tokens = lexicalAnalysis(automata, strToEval);
  }
  $('#tokensOutput').val(tokens);
});

$(document).on('click', '.showTable', function() {
  let automata = automatas[$('#sel_automata_1').val()];
  showTable(generateTable(automata, fsm));
  $("#buttonTable").html('Ocultar Tabla');
  $(this).removeClass('showTable').addClass('dropTable');
});

$(document).on('click', '.dropTable', function() {
  dropTable();
  $("#buttonTable").html('Mostrar Tabla');
  $(this).removeClass('dropTable').addClass('showTable');
});