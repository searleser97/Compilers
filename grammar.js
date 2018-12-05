function Grammar(json){
	var _this = this;

	_this.terminales = new Set();
	_this.noTerminales = new Set();
	_this.rules = new Map();
	_this.inicioGramatica = "";
	_this.increased = false;
	_this.__type = 'Grammar';

	if (typeof json === 'object') {
		_this.terminales = json.terminales;
		_this.noTerminales = json.noTerminales;
		_this.rules = json.rules;
		_this.inicioGramatica = json.inicioGramatica;
		_this.increased = json.increased;
		_this.__type = json.__type;
	}

	_this.constructor = function(grammarMap){
		// No terminales
		for (const k of grammarMap.keys()) {
			_this.noTerminales.add(k);
		}

		// Terminales
		for (const v of grammarMap.values()) {
			v.forEach(function(element) {
				element.forEach(function(symbol) {
					if (!(_this.noTerminales.has(symbol))) {
						_this.terminales.add(symbol);
					}
				});
			});
		}

		// Inicio Gramática
		_this.inicioGramatica = grammarMap.keys().next().value;

		// Reglas
		_this.rules = grammarMap;
	}

    _this.increase = function(){
    	if (!(_this.increased)) {
			let firstKey = _this.inicioGramatica;
			let increasedGrammar = firstKey + "p";

	    	let auxRules = new Map();
			auxRules.set(increasedGrammar, new Array(new Array(firstKey)));
			for (let [k, v] of _this.rules) {
				auxRules.set(k, v);
			}

			_this.noTerminales.add(increasedGrammar);

			_this.inicioGramatica = increasedGrammar;

			_this.increased = true;

			_this.rules = auxRules;
    	}
    }
}