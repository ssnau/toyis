var noop = function(){};
var every = _.every;


var type = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),

  any: function(){return true},
  arrayOf: function(typeChecker) {
    return function(array) {
      if (!type.array(array)) {
        throwError(propName + " is not array");
      }
      var passed = every(array, function(val) {
            return typeChecker(val);
      });
      !passed && throwError(propName + " is not arrayOf");
    }
  },
  element: elementTypeChecker,
  instanceOf: createInstanceTypeChecker,
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,

  of: function(obj, types) {
    each(obj, function(val, key) {
      if (!types[key]) return;

      return types[key](val);
    });
  }
};

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName) {
  var propValue = props[propName];
  var propType = getPropType(propValue);
  if (propType !== expectedType) {
    propType = getPreciseType(propValue);
    if (propType !== expectedType) {
      return new Error(".....");
    }
  }
  return null;
}
return createChainableTypeChecker(validate);

}


// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Object.prototype.toString.call(propValue).indexOf('Array') !== -1) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}
