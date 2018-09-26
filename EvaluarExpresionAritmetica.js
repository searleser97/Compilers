var indexToken = 0;
var result;

function AnalizarExp(){
	var r;
	let v = {r:0.0};
	r = E(v);
	if (r) {
		if (tokens[indexToken] === Token_FIN) {
			result = v.r;
			return r
		}else{
			return false;
		}
	}
	return r;
}

function E(v) {
	return T(v) && Ep(v);
}

function Ep(v){
	var t;
	let v2 = {r:0.0};
	t = tokens[indexToken++];
	if (t === Token_MAS || t === Token_MENOS) {
		if (T(v2)) {
			v.r = (t === Token_MAS)?(v.r + v2.r):(v.r - v2.r);
			if (Ep(v)) {
				return true;
			}
		}
		return false;
	}
	indexToken--;
	return true;
}

function T(v) {
	return F(v) && Tp(v);
}

function Tp(v){
	var t;
	let v2 = {r:0.0};
	t = tokens[indexToken++];
	if (t === Token_PROD || t === Token_DIV) {
		if (F(v2)) {
			v.r = (t === Token_PROD)?(v.r * v2.r):(v.r / v2.r);
			if (Tp(v)) {
				return true;
			}
		}
		return false;
	}
	indexToken--;
	return true;
}

function F(v){
	var t;
	t = tokens[indexToken++];
	switch(t) {
		case Token_PAR_I:
			if (E(v)) {
				t = tokens[indexToken++];
				if (t === Token_PAR_D) {
					return true;
				}
				return false;
			}
			break;
		case Token_NUM:
			return true;
			break;
		default:
			break;
	}
	return false;
}