const express = require('express');
const csrf = require('csurf');

const frontEndRouter = express.Router();
const csrfProtection = csrf({ cookie: true });

const userId = localStorage.getItem('MEDIUM_CURRENT_USER_ID')
const token = localStorage.getItem('MEDIUM_ACCESS_TOKEN')

async function getUserById(id) {
  const user = await fetch(`/api/users/${id}`)
  return { firstName, lastName, email, createdAt } = user
  // Test if this lazy return works. If not, just be not-lazy.
  // Returns non-sensitive information, no hashedPassword
}
async function getStoryById(id) {
  let story = await fetch(`/api/stories/${id}`)
  return await story.json()
}

async function getStoriesByUserId(id) {
  let stories = await fetch(`/api/users/${id}/stories`)
  return await stories.json()
}
async function getAllStories() {
  let stories = await fetch(`/api/stories`)
  return await stories.json()
}
async function getStoriesByFollowedAuthors(userId) {
  let stories = await fetch(`/users/${userId}/follows/stories`)
  return await stories()
}

async function getFollowerIdsOfUser(id) {
  let followers = await fetch(`/api/users/${id}/followers`)
  followers = await followers.json()
  return followers.map(follower => follower.followerId)
}
async function getFollowIdsOfUser(id) {
  let follows = await fetch(`/api/users/${id}/follows`)
  follows = await follows.json()
  return follows.map(follow => follow.followingId)
}

async function getBookmarkedStoryIdsForUser(id) {
  let bookmarks = await fetch(`/api/users/${id}/bookmarks`)
  bookmarks = await bookmarks.json()
  return bookmarks.map(bookmark => bookmark.storyId)
}
async function getUserIdsWithBookmarkForStory(id) {
  let bookmarks = await fetch(`/api/stories/${id}/bookmarks`)
  bookmarks = await bookmarks.json()
  return bookmarks.map(bookmark => bookmark.storyId)
}

async function getUserIdsOfLikesForStory(id) {
  let likes = await fetch(`/api/stories/${id}/likes`)
  likes = await likes.json()
  return likes.map(like => like.userId)
}
async function getStoryIdsOfLikesForStory(id) {
  let likes = await fetch(`/api/users/${id}/likes`)
  likes = await likes.json()
  return likes.map(like => like.storyId)
}

async function getCommentsForUser(id) {
  let comments = await fetch(`/api/users/${id}/comments`)
  return await comments.json()
}
async function getCommentsForStory(id) {
  let comments = await fetch(`/api/stories/${id}/comments`)
  return await comments.json()
}


async function getFromApi(path) {
  let response = await fetch(path, {
    headers: { "Authorization": `Bearer: ${token}` }
  })
  return await response.json()
}

//actual splash page
frontEndRouter.get("/splash", (req, res) => {
  res.render('splash');
});
//splash page
frontEndRouter.get("/", (req, res) => {
  res.render('index');
});
//sign up form
frontEndRouter.get("/sign-up", csrfProtection, (req, res) => {
  res.render('sign-up', { csrfToken: req.csrfToken() });
});
//log-in form
frontEndRouter.get("/log-in", csrfProtection, (req, res) => {
  res.render('log-in', { csrfToken: req.csrfToken() });
});
//user profile
frontEndRouter.get("/users/:id", async (req, res) => {
  const userId = req.params.id
  const user = await getUserById(userId)
  const followingUserIds = await getFollowIdsOfUser(userId)
  const followerUserIds = await getFollowerIdsOfUser(userId)
  const userFollows = followingUserIds.map(async userId => {
    return await getUserById(userId)
  })
  const userFollowers = followerUserIds.map(async userId => {
    return await getUserById(userId)
  })
  const userStories = getStoriesByUserId(userId)
  let userComments = getCommentsForUser(userId)
  userComments = userComments.map(async comment => {
    const story = await getStoryById(comment.storyId)
    return { body: comment.body, story: { title: story.title, }}
  })
  const likedStoryIds = getStoryIdsOfLikesForUser(userId)
  const likedStories = likedStoryIds.map(async storyId => {
    return await getStoryById(storyId)
  })
  const bookmarkedStoryIds = getBookmarkedStoryIdsForUser(userId)
  const bookmarkedStories = bookmarkedStoryIds.map(async storyId => {
    await getStoryById(storyId)
  })
  
  // TODO Convert createdAt to Month Year format.

  res.render('profile', {
    user, userStories, userComments,
    userFollows, userFollowers,
    bookmarkedStories,
    likedStories,
  });
});
//edit user profile form
frontEndRouter.get("/users/:id/edit", csrfProtection, (req, res) => {
  res.render('edit-profile', { csrfToken: req.csrfToken() });
});
//create new story form
frontEndRouter.get("/create", csrfProtection, (req, res) => {
  res.render('create', { csrfToken: req.csrfToken() });
});
// display story by id
frontEndRouter.get("/stories/:id", (req, res) => {
  res.render('story-layout');
});
//display story edit form
frontEndRouter.get("/stories/:id/edit", csrfProtection, (req, res) => {
  res.render('story-edit-layout', { csrfToken: req.csrfToken() });
});
//display feed
frontEndRouter.get("/feed", (req, res) => {
  res.render('feed');
});
//throw error
frontEndRouter.get("/error-test", (req, res, next) => {
  const err = new Error("500 Internal Server Error.");
  err.status = 500;
  err.title = "custom 500 error";
  next(err);
})

module.exports = frontEndRouter;
