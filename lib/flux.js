var _ = require('lodash');

var each = _.each;
var filter = _.filter;
var map = _.filter;
var isString = _.isString;
var keys = _.keys;

function Store(config) {

}

Store.prototype = {
  constructor: Store,

  emit: function () {

  }
}

```
CampaignComponent {

    var flux = Y.mt.flux.getInstance();
    var scope = Y.mt.scope.getInstance();
    var type = Y.mt.type;

    scope.$watchOnce('pageReady === true', function() {
      var dealStore = flux.getStore('dealStore');
      /**
       *
       *
       */
      scope.$watch('campaigns', function(campaigns) {
          type.of(campaigns, {
             name: type.String,
             age: type.Array
          });
          // 1. serialize deal info
          var dealinfo = serialize(store.getDealInfo());

          // 2. ajax call
          $.ajax(url, dealinfo, {
            success: function() {
              flux.dispatch(actions.CALCULATE_MAX_CAMPAIGN, res.data);
            },
            fail: function() {

            }
          });

          // 3.
      });

    });
}


```

function Dispatcher() {
  this.$stores = {};
  this._isPending = {};
  this._isHandled = {};
  this._isDispatching = false;
  this._pendingPayload = null;
  this._pendingAction = null;
}

var flux = {
  constructor: Dispatcher,
  registerStore: function(name, store) {
    var token = null;
    if (typeof name === "string") {
      token = name;
      this.$stores[name] = store;
    } else {
      token = PREFIX + (++count);
      stroe = name;
    }
    this.$store[token] = store;
    return token;
  },
  registerStores: function(obj) {
    var me = this;
    each(obj, function(val, key) {
      me.registerStore(key, val);
    });
    return keys(obj);
  },
  unregisterStore: function(obj) {
    this.$stores[name] = null;
  },
  createStore: function(config) {
    return new Store(config);
  },
  dispatch: function (actionName, payload) {
    this._startDispatching(actionName);
    var me = this;
    try {
      each(this.$stores, function(store, key) {
         if (me._isPending[key]) return;
         me._invoke(key);
      });
    } finally {
      me._stopDispatching();
    }
  },
  waitFor: function (storeIds) {
    for(var i = 0; i < storeIds.length; i++) {
      var id = storeIds[i];
      if (this._isPending[id]) {
        if (!this._isHandled) {
          throw new Error("circular dependency with store '" + id +"'");
        }
        continue;
      }
      this._invoke(id);
    }
  },
  _invoke: function (key) {
    this._isPending[key] = true;
    if (!this.$stores[key]) {
      log("[" + key + "] store not found!");
      this._isHandled[key] = true;
      return;
    }
    this.$stores[key].onDispatch(this._pendingAction, this._pendingPayload);
    this._isHandled[key] = true;
  },
  _startDispatching: function (actionName) {
    each(this.$stores, function() {
      me._isPending[key] = false;
      me._isHandled[key] = false;
    });
    this._pendingAction = actionName;
    this._pendingPayload = payload;
    this._isDispatching = true;
  },
  _stopDispatching: function () {
    this._pendingAction = null;
    this._pendingPayload = null;
    this._isDispatching = false;
  }
};


flux.createStore({
  onDispatch: function(name, payload) {
    this.waitFor([
      '?pointStore', 'cardStore'
      ]);

    switch(name) {
      case action.CHANGE_QUANTITY:
        break;
    }
  }
});


flux.disptach(actions.CHANGE_QUANTITY, {
  dealid: "1232342",
  quantity: 12
});


var dispatcher = new Dispatcher();

module.exports = dispatcher;
