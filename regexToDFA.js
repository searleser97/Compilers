function EvalRegex(){
	var _this = this;

	_this.indexToken = 0;
	_this.result;

	_this.AnalizarExp = function (){
		var r;
		let f = {r:new Automata()};
		r = _this.E(f);
		// console.log(f);
		if (r) {
			if (tokens[_this.indexToken] === Token_FIN) {
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
		var tok;
		let f2 = {r:new Automata()};
		tok = tokens[_this.indexToken++];
		if(tok === Token_OR){
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
		_this.indexToken--;
		return true;
	}

	_this.T = function(f){
		// console.log(f);
		return _this.C(f) && _this.Tp(f);
	}

	_this.Tp = function(f){
		// console.log(f);
		var tok;
		let f2 = {r:new Automata()};
		tok = tokens[_this.indexToken++];
		if(tok === Token_CONC){
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
		_this.indexToken--;
		return true;
	}

	_this.C=function(f){
		// console.log(f);
		return _this.F(f) && _this.Cp(f);
	}

	_this.Cp = function(f){
		// console.log(f);
		var tok;
		tok = tokens[_this.indexToken++];
		switch(tok) {
			case Token_CERRPOS:
				if(_this.Cp(f)){
					// console.log(f);
					f.r.cerraduraPositiva();
					return true;
				}
				return false;
				break;
			case Token_CERREST:
				if(_this.Cp(f)){
					// console.log(f);
					f.r.cerraduraKleene();
					return true;
				}
				return false;
				break;
			case Token_CERRINT:
				if(_this.Cp(f)){
					// console.log(f);
					f.r.cerraduraInterrogacion();
					return true;
				}
				return false;
				break;
			default:
				_this.indexToken--;
				return true;
				break;
		}
	}

	_this.F = function (f){
		// console.log(f);
		var tok;
		tok = tokens[_this.indexToken++];
		switch(tok) {
			case Token_PAR_I:
				if (_this.E(f)) {
					// console.log(f);
					tok = tokens[_this.indexToken++];
					if (tok === Token_PAR_D) {
						return true;
					}
					return false;
				}
				break;
			case Token_SIMB:
				// console.log(aTokens[_this.indexToken-1][Token_SIMB]);
				var a = aTokens[_this.indexToken-1][Token_SIMB];
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