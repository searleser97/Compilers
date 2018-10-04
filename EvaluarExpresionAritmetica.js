function EvalExpAr(automata, string){
	var _this = this;

	_this.indexToken = 0;
	_this.result;
	_this.lexer = new Lexer(automata, string+'\0');

	_this.AnalizarExp = function (){
		var r;
		let v = {r:0.0};
		r = _this.E(v);
		if (r) {
			// console.log("Asking for token");
			if (_this.lexer.getNextToken().token === Token_FIN) {
				_this.result = v.r;
				return _this.result;
			}else{
				return "Error";
			}
		}
		return "Error";
	}

	_this.E = function (v) {
		return _this.T(v) && _this.Ep(v);
	}

	_this.Ep = function (v){
		var t;
		let v2 = {r:0.0};
		// console.log("Asking for token");
		t = _this.lexer.getNextToken();
		// console.log(t);
		if (t.token === Tokens_Aritmetico.MAS || t.token === Tokens_Aritmetico.MENOS) {
			if (_this.T(v2)) {
				// console.log("Prev value = "+v.r+" and "+v2.r);
				v.r = (t.token === Tokens_Aritmetico.MAS)?(v.r + v2.r):(v.r - v2.r);
				// console.log("Next value = "+v.r+" and "+v2.r);
				if (_this.Ep(v)) {
					return true;
				}
			}
			return false;
		}
		_this.lexer.returnToPrevToken()
		return true;
	}

	_this.T = function (v) {
		return _this.F(v) && _this.Tp(v);
	}

	_this.Tp = function (v){
		var t;
		let v2 = {r:0.0};
		// console.log("Asking for token");
		t = _this.lexer.getNextToken();
		// console.log(t);
		if (t.token === Tokens_Aritmetico.PROD || t.token === Tokens_Aritmetico.DIV) {
			if (_this.F(v2)) {
				// console.log("Prev value = "+v.r+" and "+v2.r);
				v.r = (t.token === Tokens_Aritmetico.PROD)?(v.r * v2.r):(v.r / v2.r);
				// console.log("Next value = "+v.r+" and "+v2.r);
				if (_this.Tp(v)) {
					return true;
				}
			}
			return false;
		}
		_this.lexer.returnToPrevToken();
		return true;
	}

	_this.F = function (v){
		var t;
		// console.log("Asking for token");
		t = _this.lexer.getNextToken();
		// console.log(t);
		switch(t.token) {
			case Tokens_Aritmetico.PAR_I:
				if (_this.E(v)) {
					// console.log("Asking for token");
					t = _this.lexer.getNextToken();
					// console.log(t);
					if (t.token === Tokens_Aritmetico.PAR_D) {
						return true;
					}
					return false;
				}
				break;
			case Tokens_Aritmetico.NUM:
				v.r = parseFloat(t.value);
				// console.log("Value = "+v.r);
				return true;
				break;
			default:
				break;
		}
		return false;
	}
}
