var automatas = [];
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
// createFSMDiagram(a1);



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
// createFSMDiagram(a4);



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
// createFSMDiagram(a13);

// Autómata 4
var a16 = new Automata();
a16.basico('S');
var a17 = new Automata();
a17.basico('T');
a16.unir(a17);
a16.cerraduraPositiva();

a1.unir(a4);
a1.unir(a13);
a1.unir(a16);
a1.transformar();
// a40 = a1.transformar();
// a1 = a40;
createFSMDiagram(a1);
addAutomata(a1);

//Ejemplo ed AFND -> AFD

// var a18= new Automata();
// a18= a16.transformar();
// createFSMDiagram(a18);


function addAutomata(automata) {
  let newId = automatas.length;
  $('#sel_automata_1').append(new Option(newId, newId));
  $('#sel_automata_2').append(new Option(newId, newId));
  $('#sel_automata_to_show').append(new Option(newId, newId));
  automatas.push(automata);
}

function createBasicAutomata(symbol) {
  let a = new Automata()
  a.basico(symbol);
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

  console.log(automatas);

  let automataA = automatas[$('#sel_automata_1').val()];
  let automataB = automatas[$('#sel_automata_2').val()];
  let operation = $('#operations').val();
  let isNew = false;
  switch (operation) {
    case 'basic':
      isNew = true;
      addAutomata(createBasicAutomata($('#id_nuevo_basico').val()));
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
      addAutomata(automataA = automataA.transformar());
      break;
  }
  if (isNew)
    createFSMDiagram(automatas[automatas.length - 1]);
  else
    createFSMDiagram(automataA);
});

$('#sel_automata_to_show').change(function () {
  let selected = $(this).val();
  createFSMDiagram(automatas[selected]);
});
