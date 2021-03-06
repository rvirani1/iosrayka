import { AsyncStorage } from 'react-native';
import { API_BASE } from '../../config/apiBase';
import { Actions } from 'react-native-router-flux';

const headers = (token) => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': '',
    'Authorization': `Bearer ${token ? token : undefined}`
  };
};

const defaultPost = (subUrl, data) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('token', (err, token) => {
     if (err) {
       console.log(' NO TOKEN: ', err);
       Actions.login();
       return
     }
     const parsedToken = JSON.parse(token);

     fetch(`${API_BASE}/${subUrl}`, {
       method: 'POST',
       headers: headers(parsedToken),
       body: JSON.stringify(data)
     })
     .then((response) => response.json())
     .then((apiData) => resolve(apiData))
     .catch((apiErr) => reject(apiErr));
   });
 });
};

const defaultPut = (subUrl, data) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('token', (err, token) => {
     if (err) {
       console.log(' NO TOKEN: ', err);
       Actions.login();
       return
     }
     const parsedToken = JSON.parse(token);

     fetch(`${API_BASE}/${subUrl}`, {
       method: 'PUT',
       headers: headers(parsedToken),
       body: JSON.stringify(data)
     })
     .then((response) => response.json())
     .then((apiData) => resolve(apiData))
     .catch((apiErr) => reject(apiErr));
   });
 });
};

const defaultGet = (subUrl, params) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('token', (err, token) => {
     if (err) {
       console.log(' NO TOKEN: ', err);
       Actions.login();
       return
     }
     const parsedToken = JSON.parse(token);
     let url = '';
     if (params) {
       url = `${API_BASE}/${subUrl}?${params}`;
     } else {
       url = `${API_BASE}/${subUrl}`;
     }
     fetch(url, {
       method: 'GET',
       headers: headers(parsedToken)
     })
     .then((response) => response.json())
     .then((apiData) => resolve(apiData))
     .catch((apiErr) => reject(apiErr));
   });
 });
};

const defaultImagePost = ( subUrl, data ) => {
  return new Promise((resolve, reject) => {
      const date = new Date()
      var photo = {
        uri: data.photo,
        type: 'image/jpeg',
        name: `photo-${date.toISOString()}.jpg`,
      };
      AsyncStorage.getItem('token', (err, token) => {
       if (err) {
         console.log(' NO TOKEN: ', err);
         return
       }
       const parsedToken = JSON.parse(token);
        var form = new FormData();
        form.append("photo", data.photo);
        if(data.place) {
          form.append("placename", data.place.name)
        }
        fetch(
          `${API_BASE}/${subUrl}`,
          {
            body: form,
            method: "POST",
            headers: Object.assign({}, headers(parsedToken), {'Content-Type': 'multipart/form-data'})
          })
         .then((response) => response.json())
         .then((apiData) => resolve(apiData))
         .catch((apiErr) => reject(apiErr));
      })
  })
}


const addPlaceToFavorite = (place) => defaultPost('places', place);
const loginUser = (userProfile) => defaultPost('users', userProfile);
const getPlaces = (latLng) => defaultGet('places',latLng);
const getPlace = (place) => defaultGet(`places/${place.id}`);
const getFriendPlaces = () => defaultGet(`places/friends`);
const getExpertPlaces = () => defaultGet(`places/experts`);
const getUserPlaces = (user) => defaultPost('places/user', user);
const getFilterPlaces = (places) => defaultGet('places/types', places);
const getFilterPlacesCityOrCountry = (cityOrCountry) => defaultGet('places/search', cityOrCountry);
const getFeed = (latLng) => defaultGet('feed',latLng);
const getUserFeed = (user) => defaultGet(`feed/users/${user.id}`);
const getFriends = () => defaultGet('friends');
const getUserFriends = (user) => defaultGet(`friends/users/${user.id}`);
const searchForFriends = (query) => defaultGet('users/search', query);
const addFriend = (friend) => defaultPost('friends', friend);
const getFriendFeed = () => defaultGet('feed/friends');
const getExpertFeed = () => defaultGet('feed/experts');
const getRequestedFriends = () => defaultGet('friends/requested');
const getPendingFriends = () => defaultGet('friends/pending');
const acceptFriend = (friend) => defaultPost('friends/accept', friend);
const declineFriend = (friend) => defaultPost('friends/decline', friend);
const getMyGroups = () => defaultGet('groups');
const createGroup = (group) => defaultPost('groups', group);
const getPrivateGroups = () => defaultGet('groups/private');
const getPublicGroups = () => defaultGet('groups/public');
const joinPublicGroup = (group) => defaultPost('groups/public', group);
const joinPrivateGroup = (group) => defaultPost('groups/private', group);
const searchForGroups = (query) => defaultGet('groups/search', query);
const getGroupPlaces =  (query) => defaultGet('groups/places', query);
const addFriendsToGroup = (friendsAndGroup) => defaultPost('groups/friends', friendsAndGroup);
const getNotifications = () => defaultGet('notifications');
const acceptJoinGroupRequest = (friendAndGroup) => defaultPost('groups/accept', friendAndGroup);
const updateUser = (user) => defaultPut(`users/${user.id}`, user);
const createLike = (likeeLikorPlace) => defaultPost('notifications/like', likeeLikorPlace);
const getLikes = () => defaultGet('notifications/likes');
const beenThere = (placeId) => defaultPost('notifications/been_there', placeId);
const postImageToPlace = (imageAndPlace) => defaultImagePost('places/image', imageAndPlace);
const postImageToUser = (image) => defaultImagePost('users/image', image);

export {
  addPlaceToFavorite,
  loginUser,
  getUserFeed,
  getUserPlaces,
  getFilterPlaces,
  getPlaces,
  getPlace,
  getFriendPlaces,
  getExpertPlaces,
  getFilterPlacesCityOrCountry,
  getFeed,
  getFriends,
  getUserFriends,
  searchForFriends,
  addFriend,
  getFriendFeed,
  getExpertFeed,
  getRequestedFriends,
  getPendingFriends,
  acceptFriend,
  declineFriend,
  getMyGroups,
  createGroup,
  getPublicGroups,
  getPrivateGroups,
  joinPublicGroup,
  joinPrivateGroup,
  searchForGroups,
  getGroupPlaces,
  addFriendsToGroup,
  getNotifications,
  acceptJoinGroupRequest,
  updateUser,
  createLike,
  getLikes,
  beenThere,
  postImageToPlace,
  postImageToUser
};
