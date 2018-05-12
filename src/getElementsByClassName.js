// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  //declare array to store matched elements
  let elements = [];
  //searches a list of nodes
  function searchNodes(nodeList) {
    //iterate through nodeList...
    for (let i = 0; i < nodeList.length; i++) {
      //check if node has target class
      if (nodeList[i].className.search(className) !== -1) {
        //push node to elements array
        elements.push(nodeList[i]);
      } 
      //check if node has children
      if (nodeList[i].children.length !== 0) {
        searchNodes(nodeList[i].children);
      }
    }
  }
  searchNodes(document.childNodes[1].children);
  return elements;
};
