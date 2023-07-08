# czatApp
 Chatting app for discussions, developed with MERN stack. This project is divided in two, the client and the API.

## Client

## API
The API is a improved version of [chatApp's]('https://github.com/azerty0220pl/chatApp') API. Build with Node and Express, uses Passport for authentication, socketio for instant communication with the client and MongoDB as the database. It's meant to be hosted on [render](https://render.com/).

### Express
The app uses Express. It's configuration:

* it trusts proxies
* uses bodyparser and cookie parser for simpler and safer communication with the client
* max age of cookie is one day
* it uses a session and MongoStore to store it
* it uses passport
* cors sends credentials and origin set to 'https://azerty0220pl.github.io'

### Routes
The API have the following routes: 

* /register - post - creates new user, if username available
* /login - post - logins if username and password correct, and if not, redirects to /failed-login
* /chat - get - protected - meant to fetch a chat, for now there is only one
* /failed-login - get - returns failed authentication error
* /logout - get - logs out any logged user

### Database
I'm using MongoDB with Mongoose. The database is pretty simple, it contains three schemas:

* User: it stores the username, password and chats, that the user have access to. This is so I always have the option of adding more than one chat to the app.
* Chat: it stores it's name and all the messages in an array.
* Message: it stores the user who sent it, to what chat it was sent, the date it was sent and the message itself.

## Logs

### 08/07/2023
The idea of the project is to create a very simple app, that would allow users to create themselves an account and chat in one general chat. To make it more interesting, I will use MongoDB to store all the data. For now, let's start with the API. I copied the code from one of my previous projects, and now I'm adapting it. Should not be to difficult. I will try to spread it out to different files, so it's cleaner.
Express set up, database connected, routes also set up. Tried with Postman, I can create new users, cannot get the chat until logged. Next, I will need to implement authentication.