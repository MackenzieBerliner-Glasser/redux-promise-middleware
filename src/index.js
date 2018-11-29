export const isPromise = (value) => {
  if(value !== null && typeof value === 'object') {
    return value && typeof value.then === 'function';
  }
  return false;
 }

const middleware = store => next => action => {

};


// function isPromise(object){
//   if(Promise && Promise.resolve){
//     return Promise.resolve(object) == object;
//   }else{
//     throw "Promise not supported in your environment"
//   }
// }

// var i = 1;
// var p = new Promise(function(resolve,reject){
//   resolve()
// });

// console.log(isPromise(i));
// console.log(isPromise(p));