const initialState = {
  
}

const rootReducer = (state = initialState, action) => {
  if(action.type === 'SET_AUTH_DATA'){
    return {
      ...state,
      ...action.authData
    }
  }
  return state;
}

export default rootReducer;