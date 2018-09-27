function Lexer(automata, strToTest) {

  _this = this;
  _this.automata = automata;
  _this.strToTest = strToTest;
  _this.position = 0;
  _this.current_state = automata.inicial;
  _this.lastMatchedState = undefined;
  _this.curr_symbol = strToTest[0];
  _this.lastMatchedPosition = -1;
  _this.lastMatchedSubstr = undefined;


  _this.reset = function () {
    _this.position = 0;
  }

  _this.advance = function () {
    _this.curr_symbol = strToTest[++_this.position];
  }

  function isFinalState(states) {
    for (state of states)
      if (state.final)
        return true;
    return false;
  }

  _this.getToken = function (states) {
    let token = -1;
    for (state of states) {
      if (state.final)
        token = state.token;
    }
    return token;
  }

  _this.getNextToken = function () {
    var sValue = "";

    if (_this.curr_symbol == EOF)
      return EOF;

    _this.current_state = _this.automata.inicial;
    var lastMatchedPosition;
    var lastMatchedState;
    _this.curr_symbol = strToTest[_this.position = _this.lastMatchedPosition + 1];
    while (_this.curr_symbol != EOF) {
      sValue += _this.curr_symbol;
      // console.log(_this.current_state);
      // console.log('curr_symbol ' + _this.curr_symbol);
      var nextTransitions = _this.current_state.getTransWithSymbol(_this.curr_symbol);
      if (nextTransitions.length > 0) {
        _this.current_state = nextTransitions[0].destino; // assuming it is a DFA
        if (_this.current_state.final) {
          lastMatchedState = _this.current_state;
          lastMatchedPosition = _this.position;
        }
        _this.advance();
      } else{
        sValue = sValue.substring(0, sValue.length-1);
        break;
      }
    }
    if (lastMatchedState == undefined) {
      _this.current_state = _this.automata.inicial;
      _this.curr_symbol = strToTest[0];
      _this.position = 0;
      return -1;
    } else {
      _this.lastMatchedSubstr = _this.strToTest.substring(_this.lastMatchedPosition, lastMatchedPosition);
      _this.lastMatchedPosition = lastMatchedPosition;
      _this.lastMatchedState = lastMatchedState;
      var finalToken = new Object();
      var nToken = lastMatchedState.token; 
      finalToken[nToken] = sValue;
      return finalToken;
    }
  }
}

function lexicalAnalysis(dfa, strToTest, aTokens) {
  tokens = [];
  str = strToTest + '\0';
  // console.log('starts lexical analysis');
  var lexer = new Lexer(dfa, str);
  lexerToken = lexer.getNextToken();
  while (true) {
    if (lexerToken == EOF) {
      var finalToken = new Object();
      var nToken = 0; 
      finalToken[nToken] = EOF;
      aTokens.push(finalToken);
      tokens.push(0);
      // console.log('fin de cadena');
      break;
    }
    if (lexerToken == -1) {
      tokens = 'Error at position ' + lexer.lastMatchedPosition;
      tokens += '\nnear: ' + lexer.lastMatchedSubstr;
      break;
    }
    // console.log('lexerToken: ' + lexerToken);
    aTokens.push(lexerToken);
    var aux = Object.keys(lexerToken);
    aux = aux[0];
    aux = parseInt(aux,10);
    tokens.push(aux);
    lexerToken = lexer.getNextToken();
  }
  return tokens;
}