function createFirstAutomaton(){
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

	addAutomata(a1);
	addAutomata(a4);
	addAutomata(a13);
	addAutomata(a16);

	a1.superUnir();
	// addAutomata(a1.transformar());
	populateSelects();
}

function createSecondAutomaton(){
	// Autómata 1
	var a1 = new Automata();
	a1.basico('a');
	var a2 = new Automata();
	a2.basico('b');
	a1.unir(a2);
	a1.cerraduraPositiva();
	var a3 = new Automata();
	a3.basico('c');
	a3.cerraduraKleene();
	a1.concatenar(a3);
	var a4 = new Automata();
	a4.basico('d');
	a1.concatenar(a4);
	// a1.setFinalToken(10);
	// createFSMDiagram(a1);



	// Autómata 2
	var a4 = new Automata();
	a4.basico('c');
	var a5 = new Automata();
	a5.basico('a');
	var a6 = new Automata();
	a6.basico('b');
	a5.unir(a6);
	a5.cerraduraPositiva();
	a4.concatenar(a5);
	// a4.setFinalToken(20);
	// createFSMDiagram(a4);



	// Autómata 3
	var a7 = new Automata();
	a7.basico('a');
	var a8 = new Automata();
	a8.basico('b');
	a7.concatenar(a8);
	var a9 = new Automata();
	a9.basico('c');
	a9.cerraduraPositiva();
	a7.concatenar(a9);
	var a10 = new Automata();
	a10.basico('b');
	a10.cerraduraKleene();
	a7.concatenar(a10);
	var a11 = new Automata();
	a11.basico('a');
	a11.cerraduraPositiva();
	a7.concatenar(a11);
	var a12 = new Automata();
	a12.basico('d');
	a12.cerraduraPositiva();
	a7.concatenar(a12);
	// a7.setFinalToken(30);
	// createFSMDiagram(a13);

	// Autómata 4
	var a13 = new Automata();
	a13.basico('s');
	var a14 = new Automata();
	a14.basico('t');
	a13.unir(a14);
	a13.cerraduraPositiva();
	// a13.setFinalToken(40);

	addAutomata(a1);
	addAutomata(a4);
	addAutomata(a7);
	addAutomata(a13);

	a1.superUnir();
	// addAutomata(a1.transformar());
	populateSelects();
}

function createThirdAutomaton(){
	// Autómata 1
	var a1 = new Automata();
	a1.basico('+');
	a1.setFinalToken(10);
	// createFSMDiagram(a1);

	// Autómata 2
	var a2 = new Automata();
	a2.basico('-');
	a2.setFinalToken(20);
	// createFSMDiagram(a2);

	// Autómata 3
	var a3 = new Automata();
	a3.basico('*');
	a3.setFinalToken(30);
	// createFSMDiagram(a3);

	// Autómata 4
	var a4 = new Automata();
	a4.basico('/');
	a4.setFinalToken(40);
	// createFSMDiagram(a4);

	// Autómata 5
	var a5 = new Automata();
	a5.basico('(');
	a5.setFinalToken(50);
	// createFSMDiagram(a5);

	// Autómata 6
	var a6 = new Automata();
	a6.basico(')');
	a6.setFinalToken(60);
	// createFSMDiagram(a6);

	// Autómata 7
	var a7 = new Automata();
	a7.basico('1');
	var a8 = new Automata();
	a8.basico('2');
	a7.unir(a8);
	var a9 = new Automata();
	a9.basico('3');
	a7.unir(a9);
	var a10 = new Automata();
	a10.basico('4');
	a7.unir(a10);
	var a11 = new Automata();
	a11.basico('5');
	a7.unir(a11);
	var a12 = new Automata();
	a12.basico('6');
	a7.unir(a12);
	var a13 = new Automata();
	a13.basico('7');
	a7.unir(a13);
	var a14 = new Automata();
	a14.basico('8');
	a7.unir(a14);
	var a15 = new Automata();
	a15.basico('9');
	a7.unir(a15);
	var a16 = new Automata();
	a16.basico('0');
	a7.unir(a16);
	a7.cerraduraPositiva();
	var a17 = new Automata();
	a17.basico('.');
	var a18 = new Automata();
	a18.basico('1');
	var a19 = new Automata();
	a19.basico('2');
	a18.unir(a19);
	var a20 = new Automata();
	a20.basico('3');
	a18.unir(a20);
	var a21 = new Automata();
	a21.basico('4');
	a18.unir(a21);
	var a22 = new Automata();
	a22.basico('5');
	a18.unir(a22);
	var a23 = new Automata();
	a23.basico('6');
	a18.unir(a23);
	var a24 = new Automata();
	a24.basico('7');
	a18.unir(a24);
	var a25 = new Automata();
	a25.basico('8');
	a18.unir(a25);
	var a26 = new Automata();
	a26.basico('9');
	a18.unir(a26);
	var a27 = new Automata();
	a27.basico('0');
	a18.unir(a27);
	a18.cerraduraPositiva();
	a17.concatenar(a18);
	a17.cerraduraInterrogacion();
	a7.concatenar(a17);
	a7.setFinalToken(70);
	// createFSMDiagram(a7);

	addAutomata(a1);
	addAutomata(a2);
	addAutomata(a3);
	addAutomata(a4);
	addAutomata(a5);
	addAutomata(a6);
	addAutomata(a7);

	a1.superUnir();
	addAutomata(a1.transformar());
	populateSelects();
}