export const hostURL = 'http://192.168.43.11:4000'
// export const hostURL = 'http://localhost:4000'

export default {
  authURL: hostURL+'/login',
  verifyAuthURL: hostURL+'/verifyAuth',
  getContactsURL: hostURL+'/contacts/getContacts',
  getContactsListURL: hostURL+'/contacts/getContactsList',
  addContactURL: hostURL+'/contacts/addContact',
  sendImageURL: hostURL+'/media/postImage'
}