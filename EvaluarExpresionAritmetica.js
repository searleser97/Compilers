function EvalExpAr(){
	var _this = this;

	_this.indexToken = 0;
	_this.result;

	_this.AnalizarExp = function (){
		var r;
		let v = {r:0.0};
		r = _this.E(v);
		if (r) {
			if (tokens[_this.indexToken] === Token_FIN) {
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
		t = tokens[_this.indexToken++];
		if (t === Token_MAS || t === Token_MENOS) {
			if (_this.T(v2)) {
				v.r = (t === Token_MAS)?(v.r + v2.r):(v.r - v2.r);
				if (_this.Ep(v)) {
					return true;
				}
			}
			return false;
		}
		_this.indexToken--;
		return true;
	}

	_this.T = function (v) {
		return _this.F(v) && _this.Tp(v);
	}

	_this.Tp = function (v){
		var t;
		let v2 = {r:0.0};
		t = tokens[_this.indexToken++];
		if (t === Token_PROD || t === Token_DIV) {
			if (_this.F(v2)) {
				v.r = (t === Token_PROD)?(v.r * v2.r):(v.r / v2.r);
				if (_this.Tp(v)) {
					return true;
				}
			}
			return false;
		}
		_this.indexToken--;
		return true;
	}

	_this.F = function (v){
		var t;
		t = tokens[_this.indexToken++];
		switch(t) {
			case Token_PAR_I:
				if (_this.E(v)) {
					t = tokens[_this.indexToken++];
					if (t === Token_PAR_D) {
						return true;
					}
					return false;
				}
				break;
			case Token_NUM:
				v.r = parseFloat(aTokens[_this.indexToken-1][Token_NUM]);
				return true;
				break;
			default:
				break;
		}
		return false;
	}
}
