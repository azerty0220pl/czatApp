require('dotenv').config();
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    chat: [{ type: Schema.Types.ObjectId, ref: "Chat" }]
});

const chatSchema = new Schema({
    name: { type: String, required: true, unique: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

const messageSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    date: { type: Date, required: true },
    message: { type: String, required: true }
})

const User = mongoose.model("User", userSchema);
const Chat = mongoose.model("Chat", chatSchema);
const Message = mongoose.model("Message", messageSchema);

const connect = () => {
    return mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });
}

const newUser = async (user) => {
    let res = null;

    await User.findOne({ username: user.username }).then(async (doc) => {
        if (!doc) {
            let user = new User({ username: username, password: password, chat: [] });
            await user.save().then((x) => {
                res = { status: "success", payload: user.username };
            }).catch((err) => {
                res = { status: "error", payload: { title: "Error on User.save Username: " + user.username, err: err } };
            });
        } else {
            res = { status: "error", payload: { title: "Username name already exists. Username: " + user.username, err: "" } };
        }
    }).catch(err => {
        res = { status: "error", payload: { title: "Error on User.findOne. Username: " + user.username, err: err } };
    });

    return res;
}


const sendMessage = async (to, message) => {
    let res = null;

    await Chat.findOne({ name: to }).then(async (chat) => {
        if (chat) {
            const mssg = new Message({ from: message.from, to: chat.id, date: new Date(), message: message.message });

            await mssg.save().then(async (msg) => {
                await Chat.update(to, { $push: { messages: msg.id } }).then((x) => {
                    res = { status: "success", payload: msg.id };
                }).catch((err) => {
                    res = { status: "error", payload: { title: "Error on Chat.update Chat: " + chat, err: err } };
                });
            }).catch((err) => {
                res = { status: "error", payload: { title: "Error on Message.save message: " + message, err: err } };
            });
        } else {
            res = { status: "error", payload: { title: "Chat does not exist. Chat: " + to, err: "" } };
        }
    }).catch((err) => {
        res = { status: "error", payload: { title: "Error on Chat.findOne. Chat: " + to, err: err } };
    });

    return res;
}

const getUser = async (username) => {
    let res = null;

    await User.findOne({ username: username }).then((us) => {
        res = { status: "success", payload: us };
    }).catch((err) => {
        res = { status: "error", payload: { title: "Error User.findOne. User: " + username, err: err } };
    });

    return res;
}

const getChat = async (chat) => {
    let res = null;

    await Chat.findOne({ name: chat }).then((cht) => {
        res = { status: "success", payload: cht };
    }).catch((err) => {
        res = { status: "error", payload: { title: "Error Chat.findOne. Chat: " + chat, err: err } };
    });

    return res;
}

module.exports = {
    connect: connect,
    newUser: newUser,
    getuser: getUser,
    getChat: getChat,
    sendMessage: sendMessage
}