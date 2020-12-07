# Christian Connect Backend - API
This is a Node.js API For Christian Connect. A social network website, where people can meet, chat,download media files, get event notificationa and job vacancies.

*Frontend app: [https://github.com/its-nedum/christian-connect-frontend](https://github.com/its-nedum/christian-connect-frontend)

## Demo Link
Access the app [Christain Connect](https://christian-connect.herokuapp.com)

## Features

### User
- Signup
- Signin
- Update profile
- Avatar
- Change password
- User profile details
### Post
- Create post
- Read all posts
- Comment on posts
- Read a single post
- Like a post
- Delete own post
- Edit a post
### Music
- Get all songs
- Comment on a song
- Get a single song and its comment
### Connect
- View user profile
- Get all of a user's connect(friends)
### Lyrics
- Get all lyrics
- Comment on a lyric
- Get a single lyric and its comment
### Request
- Send a friend request
- View your sent friend requests
- View your received friend requests
- Accept a friend request
- Reject a friend request
- Disconnect with a friend
- Verify users connect status
### Video
` Get all videos
- Comment on a video
- Get a single video and its comment
### Job
- Get all job vacancies
- Get a single job vacancies
### Event
- Get all up coming events
### Admin
- Create account
- Post a song
- Post a video
- Post a lyric
- Post an event
- Post a job vacancies
## Technologies Used
Node.js, Express, Cloudinary, jsonwebtoken, PostgreSQL, Sequelize

## Installation

Clone repo to your local machine:

```git
git clone https://github.com/its-nedum/christian-connect-backend.git
```
move into project folder
```
cd christian-connect-backend
```
### Install dependencies

install dependencies
```
    yarn install 
```
or
```
    npm install 
```

Now start the Express server:

```
    npm start
```

## API Routes
<table>
	<tr>
		<th>HTTP VERB</th>
		<th>ENDPOINT</th>
		<th>FUNCTIONALITY</th>
	</tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/signup</td>
        <td>Create user account</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/signin</td>
        <td>Login a user</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>/api/v1/update-profile</td>
        <td>User update their account</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/avatar</td>
        <td>User upload a profile picture</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>/api/v1/change-password</td>
        <td>User change their account password</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/user-details</td>
        <td>Get user profile details</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/video</td>
        <td>Get all videos</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/video/:videoId</td>
        <td>Get a single video and its comments</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/category/video/:videoId/comment</td>
        <td>Make a comment on videos</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/sendfriendrequest/:requesteeid</td>
        <td>Send a friend request</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/viewrequestsent</td>
        <td>View friend requests you sent</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/viewrequestreceived</td>
        <td>View friend requests you received</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>/api/v1/acceptfriendrequest/:requestid</td>
        <td>Accept a friend request</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/api/v1/rejectfriendrequest/:requestid</td>
        <td>Reject a friend request</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/api/v1/cancelfriendrequest/:requestid</td>
        <td>Cancel a friend request</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/api/v1/disconnectfriends/:requesteeid</td>
        <td>Disconnect a friend</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/verifyconnectionstatus/:requesteeid</td>
        <td>Verify a friend connect</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/createpost</td>
        <td>Create a post</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/posts</td>
        <td>View a users posts</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/feed</td>
        <td>View all your friends post including yours</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/addcommenttopost</td>
        <td>Comment on a post</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/viewsinglepost/:postId</td>
        <td>View a single post</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/getcomments/:postId</td>
        <td>View a single post</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/like/:postId</td>
        <td>Like a post</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/api/v1/deletepost/:postId</td>
        <td>Delete a post</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>/api/v1/updatepost/:postId</td>
        <td>Update a post</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/music</td>
        <td>Get all music</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/music/:musicId</td>
        <td>Get a single song with its comment</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/category/music/:musicId/comment</td>
        <td>Post a comment on a song</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/lyric</td>
        <td>Get all lyrics</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/lyric/:lyricId</td>
        <td>Get a single song with its comment</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/category/lyric/:lyricId/comment</td>
        <td>Post a comment on a lyric</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/job</td>
        <td>Get all jobs</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/job/:jobId</td>
        <td>Get a single job</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/event</td>
        <td>Get all events</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/category/event/up-coming</td>
        <td>Get all up-coming events</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/users</td>
        <td>Get all registered user</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/users:/username</td>
        <td>View a single user profile</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/allMyConnect</td>
        <td>Get a list of all a user's connect(friends)</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/getnewestmember</td>
        <td>Get a list of the 4 newest member</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/music</td>
        <td>Post a song</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/video</td>
        <td>Post a video</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/lyric</td>
        <td>Post a lyric</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/event</td>
        <td>Post an event</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/job</td>
        <td>Post a job vacancies</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/create-admin</td>
        <td>Create an admin account</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/signin-admin</td>
        <td>Sign in an admin</td>
    </tr>
</table>