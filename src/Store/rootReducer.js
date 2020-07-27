const initialState = {
  contacts: [],
  callData: {
    active: false
  }
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
      state.contacts.push({
        email: action.contact,
        name: action.contact,
        chats: [action.msg]
      })
      return {...state};
    }
    else{
      if(action.incUnread)
        contact.unreadMessages = (contact.unreadMessages || 0) + 1
      contact.chats.push(action.msg);
      return {...state};
    }
  }
  if(action.type === 'SET_UNREAD_MESSAGE'){
    let contact = state.contacts.find(ct => ct.email === action.contact);
    if(!contact){
      return state;
    }
    else{
      contact.unreadMessages = action.count;
      return {...state};
    }
  }
  if(action.type === 'INC_UNREAD_MESSAGE'){
    let contact = state.contacts.find(ct => ct.email === action.contact);
    if(!contact){
      return state;
    }
    else{
      contact.unreadMessages = (contact.unreadMessages || 0) + 1;
      return {...state};
    }
  }
  if(action.type === 'MARK_MSGS_SEEEN'){
    let contact = state.contacts.find(ct => ct.email === action.email);
    if(!contact || !contact.chats || !contact.chats.length){
      return state;
    }
    else{
      let {chats} = contact;
      for(let i = chats.length-1; i >= 0 && !chats[i].seen; i--){
        chats[i].seen = new Date(action.time)
      }
      return {...state};
    }
  }
  if(action.type === 'SET_CALL_DATA'){
    return {
      ...state,
      callData: {
        ...state.callData,
        ...action.callData
      }
    }
  }
  if(action.type === 'CLEAR_CALL_DATA'){
    return {
      ...state,
      callData: {
        active: false
      }
    }
  }
  if(action.type === 'ADD_CONTACT'){
    state.contacts.push({
      ...action.contact,
      chats: []
    })
    return {...state};
  }
  return state;
}

export default rootReducer;