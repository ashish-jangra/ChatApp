const initialState = {
  headerText: 'WhatsApp'
}

const rootReducer = (state = initialState, action) => {
  if(action.type === 'SET_HEADER_TEXT_ONLY'){
    return {
      ...state,
      headerText: action.text,
      showOptions: false
    }
  }
  else if(action.type === 'SET_HEADER_TEXT_OPTIONS'){
    return {
      ...state,
      headerText: action.text || state.headerText,
      showOptions: true,
      group: action.group
    }
  }
  return state;
}

export default rootReducer;