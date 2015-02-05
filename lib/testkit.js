function bindTesterMethods(runner) {
  // tester methods
  var testerMethods = 'abort,skip,assertTrue,assert,assertEqual,assertEquals,assertNotEquals,assertElementCount,assertEvaluate,assertEval,assertEvalEqual,assertEvalEquals,assertFail,assertField,assertFieldCSS,assertFieldXPath,assertSelectorExist,assertSelectorExists,assertExist,assertExists,assertNotExists,assertDoesntExist,assertHttpStatus,assertMatches,assertMatch,assertFalse,assertNot,assertInvisible,assertNotVisible,assertThrows,assertRaise,assertRaises,assertResourceExist,assertResourceExists,assertTextDoesntExist,assertTextExist,assertTextExists,assertTruthy,assertFalsy,assertSelectorContains,assertSelectorHasText,assertSelectorDoesntContain,assertSelectorDoesntHaveText,assertTitle,assertTitleMatches,assertTitleMatch,assertType,assertInstanceOf,assertUrlMatches,assertUrlMatch,assertVisible,bar,setUp,tearDown,begin,colorize,comment,done,dubious,error,exec,fail,findTestFiles,getCurrentSuiteId,formatMessage,infoassrocessAssertionErrorrocessAssertionResultrocessErrorrocessPhantomError,renderFailureDetails,renderResults,runSuites,runTest,terminate,saveResults,testEqual,testEquals,uncaughtError';
  testerMethods = testerMethods.split(',').map(function(str){return str.trim()});
  testerMethods.forEach(function(method) {
    runner.test[method] = function() {
       runner._queue.push([function(){
        var tester = runner._tester;
        var args = arguments;
        var func = tester[method];
        casper.then(function(){
          if (!func) {
            console.log("[warning]" + method + " not found!");
            return;
          }
          func.apply(tester, args);
        });
      }, arguments]);
      return runner;
  }
  });
}
// casper methods
function bindCasperMethods(runner) {
  var _casperMethods = 'back,base64encode,bypass,callUtils,capture,captureBase64,captureSelector,checkStep,checkStarted,clear,click,clickLabel,configureHttpAuth,createStep,debugHTML,debugPage,die,download,each,eachThen,echo,evaluate,evaluateOrDie,exists,exit,fetchText,fillForm,fillNames,fillSelectors,fill,fillXPath,forward,getColorizer,getPageContent,getCurrentUrl,getElementAttr,getElementAttribute,getElementsAttr,getElementsAttribute,getElementBounds,getElementInfo,getElementsInfo,getElementsBounds,getFormValues,getGlobal,getHTML,getTitle,handleReceivedResource,initErrorHandler,injectClientScripts,injectClientUtils,includeRemoteScripts,log,mouseEvent,open,reload,repeat,resourceExists,run,runStep,sendKeys,scrollTo,scrollToBottom,setContent,setHttpAuth,start,status,then,thenClick,thenEvaluate,thenOpen,thenBypass,thenBypassIf,thenBypassUnless,thenOpenAndEvaluate,toString,unwait,userAgent,viewport,visible,warn,wait,waitStart,waitDone,waitFor,waitForPopup,waitForResource,waitForUrl,waitForSelector,waitForText,waitForSelectorTextChange,waitWhileSelector,waitUntilVisible,waitWhileVisible,withFrame,withPopup,zoom';
  var casperMethods = Object.keys(casper.__proto__);
  casperMethods.forEach(function(methodName){
    if (/^(start|done)$/.test(methodName)) {
      return;
    }

    Runner.prototype[methodName] = function(){
      this._queue.push([function() {
        casper[methodName].apply(casper, arguments);
        return this;
      }, arguments]);
      return this;
    }
  });
}

function Kit() {
  if (!(this instanceof Kit)) {
    return new Kit();
  }
}
Kit.prototype = {
  config: function (config) {
    this._component = config.component;
    return this;
  },
  begin: function (desc) {
    var runner = new Runner;
    runner._desc = desc;
    return runner;
  }
};
function Runner() {
  this._queue = [];
  this.test = {};
  bindCasperMethods(this);
  bindTesterMethods(this);
}
Runner.prototype = {
  _run: function (test) {
    this._tester = test;
    this._queue.forEach(function(tuple){
      tuple[0].apply(null, tuple[1]);
    });
    return this;
  },
  start: function (url) {
    this._queue.push([function(){
      casper.start(url);
    }, null]);
    return this;
  },
  done: function () {
    var me = this;
    this._queue.push([function(){
      casper.run(function(){
        me._tester.done();
      });
    }, null]);
    casper.test.begin(this._desc, function (test) {
      me._run(test);
    });
  }
}

var kit = Kit();
kit.config({
  component: 'common-head'
});

kit.begin('do something cool')
   .start('http://baidu.com')
   .test.assertExists('body')
   .test.assertExists('#kw')
   .done();

kit.begin('qq')
   .start('http://www.qq.com')
   .test.assertExists('body')
   .test.assertExists('#sougouTxt')
   .done();
