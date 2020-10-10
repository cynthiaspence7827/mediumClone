import { loggedIn } from './utils.js';
const navHeader = document.querySelector('.navHeader')
const topnav = document.querySelector('.topnav');

document.addEventListener('DOMContentLoaded', e => {
  let logged = loggedIn();
if (logged) {
  navHeader.classList.remove('navHeaderStyles')
} else {
  topnav.classList.remove('topNavStyles');
}
})


const userId = window.localStorage.getItem('MEDIUM_CURRENT_USER_ID')
const logoutButton = document.querySelector('#logoutButton');

const profileButton = document.querySelector('#profileButton');
const writeStoryButton = document.querySelector('#createStoryButton')

const signInElement = document.querySelector('.signInButton');
const signUpElement = document.querySelector('.signUpButton');
const dropdownElement = document.querySelector('.dropdown');

let logged = loggedIn();
if (logged) {
  signInElement.classList.add('hidden');
  signUpElement.classList.add('hidden');
} else {
  dropdownElement.classList.add('hidden');
}
logoutButton.addEventListener('click', (e) => {
  localStorage.removeItem('MEDIUM_ACCESS_TOKEN');
  localStorage.removeItem('MEDIUM_CURRENT_USER_ID');
  window.location.href = "/";
})
profileButton.addEventListener('click', e => {
  window.location.href = `/users/${userId}`
})
writeStoryButton.addEventListener('click', e => {
  window.location.href = '/create'
})
