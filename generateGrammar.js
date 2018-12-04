function GenGramaticas(automata, string){
    var _this = this;

    _this.indexToken = 0;
    _this.result;
    _this.lexer = new Lexer(automata, string+'\0');

    _this.AnalizarExp = function (){
        var r;
        let f = {r:new Map()};
        // console.log(f);
        r = _this.G(f);
        // console.log(r);
        if (r) {
            // console.log("Asking for token");
            if (_this.lexer.getNextToken().token === Token_FIN) {
                _this.result = f.r;
                return _this.result;
            }else{
                return null;
            }
        }
        return null;
    }

    // Start Prof
    _this.G = function(f) {
        // console.log(f);
        if (_this.ListaReglas(f)) {
            // console.log(f);
            return true;
        }
        // console.log(f);
        return false;
    }

    _this.ListaReglas = function(f) {
        // console.log(f);
        var tok;
        if (_this.Regla(f)) {
            // console.log(f);
            // console.log("Asking for token");
            tok = _this.lexer.getNextToken();
            // console.log(tok);
            if (tok.token === Tokens_Grammar.P_Y_C) {
                // console.log("CONSEGUIMOS UNA REGLA");
                if (_this.ListaReglasP(f)) {
                    // console.log(f);
                    return true;
                }
                    // console.log(f);
            }
        }
        // console.log(f);
        return false;
    }

    _this.ListaReglasP = function(f) {
        // console.log(f);
        var tok;
        // console.log("Asking for point");
        var BackUp = _this.lexer.returnPoint();
        // console.log(BackUp);
        if (_this.Regla(f)) {
            // console.log(f);
            // console.log("Asking for token");
            tok = _this.lexer.getNextToken();
            // console.log(tok);
            if (tok.token === Tokens_Grammar.P_Y_C) {
                if (_this.ListaReglasP(f)) {
                    // console.log(f);
                    return true;
                }
                // console.log(f);
                return false;
            } else if (tok.token === Token_ERROR) {
                return false;
            }
        }
        // console.log(f);
        // console.log("Return to point");
        // console.log(BackUp);
        _this.lexer.setPoint(BackUp);
        return true;
    }

    _this.Regla = function(f) {
        var tok;
        let L2 = {r:[]};
        // console.log(L2);
        let LIzquierdo = {r:[]};
        // console.log(LIzquierdo);
        if (_this.LadoIzquierdo(LIzquierdo)) {
            // console.log(LIzquierdo);
            // console.log("Asking for token");
            tok = _this.lexer.getNextToken();
            // console.log(tok);
            if (tok.token === Tokens_Grammar.FLECHA) {
                if (_this.ListaLadosDerechos(L2)) {
                    // console.log(L2);
                    f.r.set(LIzquierdo.r.pop(), L2.r)
                    return true;
                }
                // console.log(L2);
            }
        }
        // console.log(LIzquierdo);
        return false;
    }

    _this.LadoIzquierdo = function(LIzquierdo) {
        // console.log(LIzquierdo);
        // console.log("Asking for token");
        tok = _this.lexer.getNextToken();
        // console.log(tok);
        if (tok.token === Tokens_Grammar.SIMB) {
            var a = tok.lexema;
            a = a.substring(1, a.length-1);
            // console.log(a);
            LIzquierdo.r.push(a);
            // console.log(LIzquierdo);
            return true;
        }
        return false;
    }

    _this.ListaLadosDerechos = function(L1) {
        // console.log(L1);
        var L2 = {r:[]};
        // console.log(L2);
        if (_this.LadoDerecho(L2)) {
            // console.log(L2);
            L1.r.push(L2.r);
            // console.log(L2);
            if (_this.ListaLadosDerechosP(L1)) {
                // console.log(L1);
                return true;
            }
            // console.log(L1);
        }
        // console.log(L2);
        return false;
    }

    _this.ListaLadosDerechosP = function(L1) {
        // console.log(L1);
        // console.log("Asking for token");
        tok = _this.lexer.getNextToken();
        // console.log(tok);
        var L2 = {r:[]};
        // console.log(L2);
        if (tok.token === Tokens_Grammar.OR) {
            if (_this.LadoDerecho(L2)) {
                // console.log(L2);
                L1.r.push(L2.r);
                // console.log(L2);
                if (_this.ListaLadosDerechosP(L1)) {
                    // console.log(L1);
                    return true;
                }
                // console.log(L1);
            }
            // console.log(L2);
            return false;
        } else if (tok.token === Token_ERROR) {
            return false;
        }
        _this.lexer.returnToPrevToken();
        return true;
    }

    _this.LadoDerecho = function(L1) { //checar
        // console.log(L1);
        // console.log("Asking for token");
        tok = _this.lexer.getNextToken();
        // console.log(tok);
        if (tok.token === Tokens_Grammar.SIMB) {
            var a = tok.lexema;
            a = a.substring(1, a.length-1);
            // console.log(a);
            L1.r.push(a);
            // console.log(L1);
            if (_this.LadoDerechoP(L1)) {
                // console.log(L1);
                return true;
            }
            // console.log(L1);
        }
        return false;
    }

    _this.LadoDerechoP = function(L1) {
        // console.log(L1);
        // console.log("Asking for token");
        tok = _this.lexer.getNextToken();
        // console.log(tok);
        if (tok.token === Tokens_Grammar.SIMB) {
            var a = tok.lexema;
            a = a.substring(1, a.length-1);
            // console.log(a);
            L1.r.push(a);
            // console.log(L1);
            if (_this.LadoDerechoP(L1)) {
                // console.log(L1);
                return true;
            }
            // console.log(L1);
            return false;
        } else if (tok.token === Token_ERROR) {
            return false;
        }
        // console.log(_this.lexer.tokensPosition);
        // console.log(_this.lexer.collectedTokens[_this.lexer.tokensPosition]);
        _this.lexer.returnToPrevToken();
        // console.log(_this.lexer.tokensPosition);
        // console.log(_this.lexer.collectedTokens[_this.lexer.tokensPosition]);
        return true;
    }
}