import CONFIG from "./config";

export const getAuth = (authData) => {
  console.log("send auth data", authData);
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
      console.log("[SC] getauth data", data);
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
      console.log("[SC] contactslist", data);
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
