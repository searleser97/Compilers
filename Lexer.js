function Lexer(automata, strToTest) {
	// console.log("Enter lexer with");
	// console.log(automata);
	// console.log(strToTest);

  _this = this;
  _this.automata = automata;
  _this.strToTest = strToTest;
  _this.position = 0;
  _this.current_state = automata.inicial;
  _this.lastMatchedState = undefined;
  _this.curr_symbol = strToTest[0];
  _this.lastMatchedPosition = -1;
  _this.lastMatchedSubstr = undefined;
  _this.collectedTokens = [];
  _this.tokensPosition = -1;


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

    if (_this.curr_symbol == EOF){
      _this.collectedTokens[++_this.tokensPosition] = {
        token: 0,
        str: EOF,
        position: _this.position,
        lastPosition: _this.lastMatchedPosition+1,
        state: _this.lastMatchedState
      };
    	// console.log(_this.collectedTokens);
    	// (_this.collectedTokens).forEach( function(value){
    	// 	console.log(value);
    	// });
   	   key = {
        token: 0,
        value : EOF
      };
      return key;
    }

    _this.current_state = _this.automata.inicial;
    var lastMatchedPosition;
    var lastMatchedState;
    _this.curr_symbol = strToTest[_this.position = _this.lastMatchedPosition + 1];
    while (_this.curr_symbol != EOF) {
      sValue += _this.curr_symbol;
      // console.log('curr_symbol ' + _this.curr_symbol);
      // console.log(_this.current_state)
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
      key = {
        token: 1000,
        value : "ERROR"
      };
      return key;
    } else {
      _this.lastMatchedSubstr = _this.strToTest.substring(_this.lastMatchedPosition, lastMatchedPosition);
      _this.lastMatchedPosition = lastMatchedPosition;
      _this.lastMatchedState = lastMatchedState;
      _this.collectedTokens[++_this.tokensPosition] = {
        token: _this.lastMatchedState.token,
        str: sValue,
        position: _this.position,
        lastPosition: _this.lastMatchedPosition,
        state: _this.lastMatchedState
      };
    	// console.log(_this.collectedTokens);
      key = {
        token: _this.lastMatchedState.token,
        value : sValue
      };
      return key;
    }
  }

  _this.returnToPrevToken = function () {
	// console.log("In return token");
 //    console.log("position: "+_this.position);	
 //    console.log("lastMatchedState: "+_this.lastMatchedState);
 //    console.log("lastMatchedPosition: "+_this.lastMatchedPosition);
 //    console.log("tokensPosition: "+_this.tokensPosition);
 //    console.log(_this.collectedTokens);
    token = _this.collectedTokens[--_this.tokensPosition]
    _this.position = token.position;
    _this.lastMatchedSubstr = token.str;
    _this.lastMatchedState = token.state;
    _this.lastMatchedPosition = token.lastPosition;
    // console.log("--------------");
    // console.log("position: "+_this.position);	
    // console.log("lastMatchedState: "+_this.lastMatchedState);
    // console.log("lastMatchedPosition: "+_this.lastMatchedPosition);
    // console.log("tokensPosition: "+_this.tokensPosition);
    // console.log(_this.collectedTokens);
  }
}

function lexicalAnalysis(dfa, strToTest) {
	// console.log("Enter lexicalAnalysis with");
	// console.log(dfa);
	// console.log(strToTest);
  tokens = [];
  str = strToTest + '\0';
  // console.log('starts lexical analysis');
  var lexer = new Lexer(dfa, str);
  lexerToken = lexer.getNextToken();
  while (true) {
    // console.log('lexerToken: ' + lexerToken);
    if (lexerToken.token == 0) {
      // console.log('fin de cadena');
      // console.log("lastMatchedPosition: "+_this.lastMatchedPosition);
      // console.log("position: "+_this.position);
      tokens.push(0);
      break;
    }
    if (lexerToken.token == 1000) {
      tokens = 'Error at position ' + lexer.lastMatchedPosition;
      tokens += '\nnear: ' + lexer.lastMatchedSubstr;
      break;
    }
    // console.log("lastMatchedPosition: "+_this.lastMatchedPosition);
    // console.log("position: "+_this.position);
    tokens.push(lexerToken.token);
    lexerToken = lexer.getNextToken();
  }
  // console.log(_this.collectedTokens);
  return tokens;
}