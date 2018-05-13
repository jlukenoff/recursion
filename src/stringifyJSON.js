// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  //check if obj is array
  if (Array.isArray(obj)) {
    // declare newArray;
    let newArr = [];
    //iterate over array;
    for (let i = 0; i < obj.length; i++) {
      //stringify array element;
      if (typeof obj[i] === 'string') {
        newArr.push('"' + obj[i] + '"');
      //check if array element is  object
      } else if (typeof obj[i] === 'object') {
        newArr.push(stringifyJSON(obj[i]));
      } else {
        newArr.push(obj[i]);
      }
    }
    // wrap in brackets
    return "[" + newArr.join() + "]";
  } else if (typeof obj === 'object' && obj !== null) {
    // declare keyValStore = []
    let keyValStore = [];
    //iterate through obj
    for (let key in obj) {
      //compile each key/value to a string and stringify.. 
      //..keys and add to array
      let val = obj[key];
      //check if val is unstringifiable
      if (typeof val === 'function' || typeof val === 'undefined') {
        continue;
      }
      //check whether to display quotes on value
      if (typeof val === 'string') {
        val = '"' + val + '"';
        //check if value is Obj
      } else if (typeof val === 'object') {
        //recursive call on val
        val = stringifyJSON(val);
      }
      //push to array
      keyValStore.push('"' + key + '":' + val);
    }
    //return joined array with curly braces wrapped
    return '{' + keyValStore.join(',') + '}';
  } else {
    return typeof obj === 'string' ? '"' + obj + '"' : '' + obj;
  }

};
