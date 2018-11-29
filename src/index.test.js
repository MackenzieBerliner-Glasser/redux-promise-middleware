import { isPromise } from './index';

describe('isPromise', () => {
  it('checks that object is a promise', () => {
    const promise = new Promise(function (resolve, reject){
      resolve()
    })
    expect(isPromise(promise)).toBeTruthy();
  });

});