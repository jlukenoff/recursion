// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {
  if (json.startsWith('[')) {
    if (!json.endsWith(']')) throw (SyntaxError());
    return parseArray(json);
  } else if (json.startsWith('{')) {
    return renderOutputObj(keyValSort(json));
  }
};

//---Helper Functions---//

//extracts keys and their respective values into separate arrays from a json string
const keyValSort = function(json) {
  json = trimEnds(json);
  let newObj = {
    keys: [],
    values: []
  }
  let key = true;
  let inString = false;
  let str = '';
  for (let i = 0; i < json.length; i++) {
    let char = json[i];
    if (char === ':' && key) {
      newObj.keys.push(str);
      str = '';
      key = false;
      if (json[i + 1] === ' ') i++;
    } else if (char === '{' || char === '[' && !key) {
      newObj.values.push(parseJSON(objExtractor(json.slice(i))));
      i += objExtractor(json.slice(i)).length - 1;
    } else if (char !== '"' && key) {
      str += char;
    } else if (char === ',' && !key && !inString) {
      if (str !== '') newObj.values.push(str);
      str = '';
      key = true;
      if (json[i + 1] === ' ') i++;
    } else if (i === json.length - 1) {
      if (char !== '"') str += char;
      newObj.values.push(str);
    } else if (char !== '"' && char !== ' ') {
      str += char;
    } else if (char === '"') {
      inString ? inString = false : inString = true;
    } else if (char === ' ' && inString) {
      str += char;
    }
  }
  return newObj;
};

//returns an array from a json array string
const parseArray = function(json) {
  let inString = false;
  let newArr = [];
  let str = '';
  json = trimEnds(json);
  for (let i = 0; i < json.length; i++) {
    let char = json[i];
    if (char === '\\' && inString) {
      str += json[i + 1];
      i++;
      if (i === json.length - 1) throw (SyntaxError());
    } else if (char === '"') {
      inString ? inString = false : inString = true;
      if (i === json.length - 1 && str.search(/\\/) === -1) {
        newArr.push(convertToPrimitive(str));
      } else if (i === json.length - 1) {
        if (str.endsWith('\\')) throw (SyntaxError());
        newArr.push(str);
      }
    } else if (char === '{' || char === '[') {
      newArr.push(parseJSON(objExtractor(json.slice(i))));
      i += objExtractor(json.slice(i)).length;
    } else if (char === ',' && !inString) {
      newArr.push(convertToPrimitive(str));
      str = '';
    } else if (inString || char !== ' ') {
      str += char;
      if (i === json.length - 1) newArr.push(convertToPrimitive(str));
    }

  }
  return newArr;
};

//extracts nested json object string when passed a string slice starting at the opening brace
const objExtractor = function(json) {
  let closeBrace = json[0] === '[' ? ']' : '}';
  let openBrace = json[0];
  let braces = 0;
  for (let i = 1; i < json.length; i++) {
    let char = json[i];
    if (char === openBrace) {
      braces++;
    } else if (char === closeBrace && braces > 0) {
      braces--;
    } else if (char === closeBrace && braces === 0) {
      let output = json.slice(0, i + 1);
      return output;
    }
  }
};

//renders final object from keyValSort output
const renderOutputObj = function(obj) {
  let newObj = {};
  obj.keys.forEach(function (key, i) {
    newObj[convertToPrimitive(key)] = convertToPrimitive(obj.values[i]);
  });
  return newObj;
};

//convert strings with quotes and other types into primitive type or plain string
const convertToPrimitive = function(str) {
  if (typeof str === 'object') return str;
  str = str.trim();
  if (str === 'true') {
    return true;
  } else if (str === 'false') {
    return false;
  } else if (str === 'null') {
    return null;
  } else if (!isNaN(str) && str !== '' && str.length !== 5) {
    return Number(str);
  }
  return str;
};

//returns a given string with first and last characted removed
const trimEnds = function(str) {
  return str.slice(1, str.length - 1);
};





