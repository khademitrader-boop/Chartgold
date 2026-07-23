(function(){
  'use strict';
  // ---------- Hidden calculator ----------
  var calcToggle = document.getElementById('calcToggle');
  var calcPanel = document.getElementById('calcPanel');
  var calcDisplay = document.getElementById('calcDisplay');

  if(calcToggle && calcPanel){
    calcToggle.addEventListener('click', function(){
      var isHidden = calcPanel.hasAttribute('hidden');
      if(isHidden){
        calcPanel.removeAttribute('hidden');
        calcToggle.setAttribute('aria-expanded', 'true');
      }else{
        calcPanel.setAttribute('hidden', '');
        calcToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if(calcDisplay && calcPanel){
    (function(){
      var current = '0';
      var previous = null;
      var operator = null;
      var waitingForOperand = false;

      function round(n){ return Math.round(n * 1e10) / 1e10; }
      function updateDisplay(){ calcDisplay.textContent = current; }

      function inputDigit(d){
        if(waitingForOperand){ current = d; waitingForOperand = false; }
        else{ current = (current === '0') ? d : current + d; }
        updateDisplay();
      }
      function inputDot(){
        if(waitingForOperand){ current = '0.'; waitingForOperand = false; updateDisplay(); return; }
        if(current.indexOf('.') === -1){ current += '.'; updateDisplay(); }
      }
      function clearAll(){
        current = '0'; previous = null; operator = null; waitingForOperand = false;
        updateDisplay();
      }
      function toggleSign(){
        if(current === '0') return;
        current = current.charAt(0) === '-' ? current.slice(1) : '-' + current;
        updateDisplay();
      }
      function inputPercent(){
        current = String(round(parseFloat(current) / 100));
        updateDisplay();
      }
      function compute(a, b, op){
        switch(op){
          case '+': return a + b;
          case '−': return a - b;
          case '×': return a * b;
          case '÷': return b === 0 ? 0 : a / b;
          default: return b;
        }
      }
      function handleOperator(nextOperator){
        var inputValue = parseFloat(current);
        if(previous === null){
          previous = inputValue;
        }else if(operator){
          var result = compute(previous, inputValue, operator);
          previous = result;
          current = String(round(result));
          updateDisplay();
        }
        waitingForOperand = true;
        operator = nextOperator;
      }

      var calcGrid = calcPanel.querySelector('.calc-grid');
      calcGrid.addEventListener('click', function(e){
        var btn = e.target.closest('button[data-calc]');
        if(!btn) return;
        var val = btn.getAttribute('data-calc');
        if(/^[0-9]$/.test(val)){ inputDigit(val); return; }
        if(val === '.'){ inputDot(); return; }
        if(val === 'clear'){ clearAll(); return; }
        if(val === 'sign'){ toggleSign(); return; }
        if(val === 'percent'){ inputPercent(); return; }
        if(val === '='){
          if(operator && previous !== null){
            var inputValue = parseFloat(current);
            var result = compute(previous, inputValue, operator);
            current = String(round(result));
            previous = null;
            operator = null;
            waitingForOperand = true;
            updateDisplay();
          }
          return;
        }
        handleOperator(val);
      });
    })();
  }

})();
