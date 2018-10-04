function EvalRegex(automata, string){
	var _this = this;

	_this.indexToken = 0;
	_this.result;
	_this.lexer = new Lexer(automata, string+'\0');

	_this.AnalizarExp = function (){
		var r;
		let f = {r:new Automata()};
		// console.log(f);
		r = _this.E(f);
		if (r) {
			// console.log("Asking for token");
			if (_this.lexer.getNextToken().token === Token_FIN) {
				_this.result = f.r;
				return _this.result;
			}else{
				return "Error";
			}
		}
		return "Error";
	}

	_this.E = function(f){
		// console.log(f);
		return _this.T(f) && _this.Ep(f);
	}

	_this.Ep = function(f){
		// console.log(f);
		// let tok;
		let f2 = {r:new Automata()};
		// console.log("Asking for token");
		tok = _this.lexer.getNextToken();
		// console.log(tok);
		if(tok.token === Tokens_Regex.OR){
			if(_this.T(f2)){
				// console.log(f2);
				f.r.unir(f2.r);
				if(_this.Ep(f)){
					// console.log(f);
					return true;
				}
			}
			return false;
		}
		_this.lexer.returnToPrevToken();
		return true;
	}

	_this.T = function(f){
		// console.log(f);
		return _this.C(f) && _this.Tp(f);
	}

	_this.Tp = function(f){
		// console.log(f);
		// let tok;
		let f2 = {r:new Automata()};
		// console.log("Asking for token");
		tok = _this.lexer.getNextToken();
		// console.log(tok);
		if(tok.token === Tokens_Regex.CONC){
			if(_this.C(f2)){
				// console.log(f2);
				f.r.concatenar(f2.r);
				if(_this.Tp(f)){
					// console.log(f);
					return true;
				}
			}
			return false;
		}
		_this.lexer.returnToPrevToken();
		return true;
	}

	_this.C=function(f){
		// console.log(f);
		return _this.F(f) && _this.Cp(f);
	}

	_this.Cp = function(f){
		// console.log(f);
		// let tok;
		// console.log("Asking for token");
		tok = _this.lexer.getNextToken();
		// console.log(tok);
		switch(tok.token) {
			case Tokens_Regex.CERRPOS:
				if(_this.Cp(f)){
					// console.log(f);
					f.r.cerraduraPositiva();
					return true;
				}
				return false;
				break;
			case Tokens_Regex.CERREST:
				if(_this.Cp(f)){
					// console.log(f);
					f.r.cerraduraKleene();
					return true;
				}
				return false;
				break;
			case Tokens_Regex.CERRINT:
				if(_this.Cp(f)){
					// console.log(f);
					f.r.cerraduraInterrogacion();
					return true;
				}
				return false;
				break;
			default:
				_this.lexer.returnToPrevToken();
				return true;
				break;
		}
	}

	_this.F = function (f){
		// console.log(f);
		// let tok;
		// console.log("Asking for token");
		tok = _this.lexer.getNextToken();
		// console.log(tok);
		switch(tok.token) {
			case Tokens_Regex.PAR_I:
				if (_this.E(f)) {
					// console.log(f);
					// console.log("Asking for token");
					tok = _this.lexer.getNextToken();
					// console.log(tok);
					if (tok.token === Tokens_Regex.PAR_D) {
						return true;
					}
					return false;
				}
				break;
			case Tokens_Regex.SIMB:
				// console.log(tok.value);
				var a = tok.value;
				a = a.substring(1, a.length-1);
				// console.log(a);
				f.r.basico(a);
				// console.log(f);
				return true;
				break;
			default:
				break;
		}
		return false;
	}
}