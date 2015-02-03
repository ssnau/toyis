var me = this;
return this._validations.every(function(tuple) {
    var validated = tuple.validateFn();
    var result = false;
    var msg = "";
    if (typeof validated === "object") {
       result = validated.value;
       msg = validated.msg;
    } else {
      result = validated;
    }
    me.validationStatus = {
      component: tuple.component,
      value: result,
      msg: msg
    }

    return result;
});


```example
if (!validator.validate()) {
  var msg = validator.getStatus();
  return;
}
```
