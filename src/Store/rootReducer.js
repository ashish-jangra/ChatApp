const initialState = {
  contacts: []
}

const rootReducer = (state = initialState, action) => {
  if(action.type === 'SET_AUTH_DATA'){
    return {
      ...state,
      ...action.authData
    }
  }
  if(action.type === 'SET_CONTACTS'){
    return {
      ...state,
      contacts: action.contacts
    }
  }
  if(action.type === 'ADD_CHAT'){
    let contact = state.contacts.find(ct => ct.email === action.contact);
    if(!contact){
      return;
    }
    else{
      contact.chats.push(action.msg);
      return {...state};
    }
  }
  if(action.type === 'SET_UNREAD_MESSAGE'){
    let contact = state.contacts.find(ct => ct.email === action.contact);
    if(!contact){
      return;
    }
    else{
      contact.unreadMessages = action.count;
      return {...state};
    }
  }
  return state;
}

export default rootReducer;