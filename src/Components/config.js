// export const hostURL = 'https://192.168.43.11:4000'
export const hostURL = 'https://localhost:4000'
// export const hostURL = 'https://chat-jarvis.herokuapp.com'

export default {
  authURL: hostURL+'/login',
  verifyAuthURL: hostURL+'/verifyAuth',
  getContactsURL: hostURL+'/contacts/getContacts',
  getContactsListURL: hostURL+'/contacts/getContactsList',
  addContactURL: hostURL+'/contacts/addContact',
  sendImageURL: hostURL+'/media/postImage',
  updateProfilePicURL: hostURL+'/media/updateProfilePic',
  getImage: filename => hostURL + "/media/getImage?filename="+filename,
  getProfilePic: userId => hostURL+'/media/getProfilePic?userId='+userId,
  contactInfoURL: hostURL+'/contacts/contactInfo'
}