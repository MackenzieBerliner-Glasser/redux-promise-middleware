import { isPromise, middleware } from './index';
import { createStore, applyMiddleware } from 'redux';

describe('isPromise', () => {
  it('checks that it is a promise', () => {
    const promise = new Promise(function(resolve, reject){
      resolve();
    });
    expect(isPromise(promise)).toBeTruthy();
  });

  it('returns false when sent an object that has a then prop', () => {
    const obj = { then: 'prop' };
    expect(isPromise(obj)).toBeFalsy();
  });

});

describe('middleware', () => {

  it('calls next with the dispatched action if the the action is not a promise', () => {
    const reducer = jest.fn();
    const store = createStore(reducer, applyMiddleware(middleware));
    const action = {
      type: 'PROMISE_ACTION',
      payload: '123'
    };
    const next = jest.fn();

    middleware(store)(next)(action);
    expect(next.mock.calls[0][0]).toEqual({
      type: 'PROMISE_ACTION',
      payload: '123'
    });
  });

  it('calls LOAD_START with action', () => {
    const reducer = jest.fn();
    const store = createStore(reducer, applyMiddleware(middleware));
    const action = {
      type: 'PROMISE_ACTION',
      payload: Promise.resolve('QQQQ')
    };
    const next = jest.fn();

    middleware(store)(next)(action);
    return action.payload
      .then(() => {
        expect(next.mock.calls).toHaveLength(1);
        expect(reducer.mock.calls[1][1]).toEqual({ type: 'LOAD_START' });
      });
  });

  it('calls LOAD_END with action', () => {
    const reducer = jest.fn();
    const store = createStore(reducer, applyMiddleware(middleware));
    const action = {
      type: 'PROMISE_ACTION',
      payload: Promise.resolve('QQQQ')
    };

    const next = jest.fn();
    middleware(store)(next)(action);
    return action.payload
      .then(() => {
        expect(next.mock.calls).toHaveLength(1);
        expect(reducer.mock.calls[2][1]).toEqual({ type: 'LOAD_END' });
      });
  });

  it('handles when the promise action is unsuccessful', () => {
    const reducer = jest.fn();
    const store = createStore(reducer, applyMiddleware(middleware));
    const action = {
      type: 'PROMISE_ACTION',
      payload: Promise.reject('QQQQ')
    };
    const next = jest.fn();

    middleware(store)(next)(action);
    return action.payload
      .then()
      .catch(() => {
        expect(reducer.mock.calls[1][1]).toEqual({ type: 'LOAD_START' });
        expect(reducer.mock.calls[2][1]).toEqual({ type: 'LOAD_END' });
        expect(reducer.mock.calls[3][1]).toEqual({ type: 'ERROR', payload: 'QQQQ' });
      });
  });
});

