import CONFIG from "./config";

export const getAuth = (authData) => {
  return fetch(CONFIG.authURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(authData),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("[SC] getauth error");
      throw err;
    });
};

export const getAuthVerified = () => {
  return fetch(CONFIG.verifyAuthURL, { credentials: "include" })
    .then((response) => response.json())
    .then((authData) => authData)
    .catch((err) => {
      throw err;
    });
};

export const getContacts = () => {
  return fetch(CONFIG.getContactsURL, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      data = data.contacts;
      data.forEach((contact) => {
        contact.chats = contact.messages;
        delete contact.messages;
      });
      return data;
    })
    .catch((err) => {
      console.log("[SC] error", err);
      throw err;
    });
};

let sortByName = (user1, user2) => {
  return (user1.name > user2.name ? 1 : -1)
}

export const getContactsList = () => {
  return fetch(CONFIG.getContactsListURL, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      data = data.contacts;
      data.sort(sortByName);
      return data;
    })
    .catch((err) => {
      console.log("[SC] error", err);
      throw err;
    });
};

export const addContact = (contact) => {
  return fetch(CONFIG.addContactURL, {
    credentials: "include",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contact),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.saved) throw "Could not add contact";
      return data;
    })
    .catch((err) => {
      throw err;
    });
};

export const sendImage = (imageData)=> {
  return fetch(CONFIG.sendImageURL,{
    credentials: 'include',
    method: 'POST',
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
    body: imageData
  })
  .then(response => response.json())
  .then(res => {
    if(res.err)
      throw new Error(res.message)
    return res;
  })
  .catch(err => {
    throw err;
  })
}

export const updateProfilePic = formdata => {
  return fetch(CONFIG.updateProfilePicURL, {
    method: 'POST',
    credentials: 'include',
    body: formdata
  })
  .then(response => response.json())
  .then(res => {
    if(!res.filename)
      throw new Error('no filename returned')
    return res;
  })
  .catch(err => {
    throw err;
  })
}

export const getDateObject = input => {
  if(input instanceof Date)
    return input;
  return new Date(input)
}

export const getContactInfo = userId => {
  return fetch(CONFIG.contactInfoURL+`?userId=${userId}`, {credentials: 'include'})
    .then(response => response.json())
    .then(data => {
      if(data.error)
        throw new Error(data.message)
      return data;
    })
    .catch(err => {
      throw err;
    })
}