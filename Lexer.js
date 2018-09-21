function Lexer(automata, strToTest) {

  _this = this;
  _this.automata = automata;
  _this.strToTest = strToTest;
  _this.position = 0;
  _this.current_state = automata.inicial;
  _this.lastMatchedState = undefined;
  _this.curr_symbol = undefined;
  _this.lastMatchedPosition = undefined;
  _this.lastMatchedSubstr = undefined;


  _this.reset = function () {
    _this.position = 0;
  }

  _this.advance = function () {
    if (_this.position != _this.strToTest.length) {
      _this.position++;
      _this.curr_symbol = strToTest[_this.position];
    }
    return _this.position < _this.strToTest;
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
    if ((_this.curr_symbol = strToTest[_this.position]) == EOF)
      return false;
    while (_this.curr_symbol != EOF) {
      debugger;
      console.log('curr_symbol ' + _this.curr_symbol);
      console.log(_this.current_state)
      var nextTransitions = _this.current_state.getTransWithSymbol(_this.curr_symbol);
      if (nextTransitions.length > 0) {
        _this.current_state = nextTransitions[0].destino; // assuming it is a DFA
        _this.advance();
        if (_this.current_state.final) {
          _this.lastMatchedState = _this.current_state;
          _this.lastMatchedPosition = _this.position;
        }
      } else {
        if (_this.lastMatchedState == undefined) {
          _this.current_state = _this.automata.inicial;
          _this.curr_symbol = strToTest[0];
          _this.position = 0;
          return -1;
        } else {
          _this.lastMatchedSubstr = _this.strToTest.substring(0, _this.lastMatchedPosition);
          return _this.lastMatchedState.token;
        }
      }
    }
    _this.lastMatchedSubstr = _this.strToTest.substring(0, _this.lastMatchedPosition);
    return _this.lastMatchedState.token;
  }
}