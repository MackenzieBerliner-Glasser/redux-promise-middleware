export const isPromise = (value) => {
  if(value !== null && typeof value === 'object') {
    return value && typeof value.then === 'function';
  }
  return false;
};

export const middleware = store => next => action => {

  if(!isPromise(action.payload)) {
    return next(action);
  }
  store.dispatch({ type: 'LOAD_START' });
  action.payload.then(result => {
    next({
      type: action.type,
      payload: result
    });
    store.dispatch({ type: 'LOAD_END' });
  })
    .catch(error => {
      store.dispatch({ type: 'LOAD_END' });
      store.dispatch({
        type: 'ERROR',
        payload: error
      });

      throw error;
    });
};
