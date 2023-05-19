import users from '../models/users.js';
import Track from '../models/track.js';
import Socket from 'socket.io';
import SimpleSchema from 'simpl-schema';
import mongoose from 'mongoose';
import helper from "../helpers/commonHelper.js";
import chat from '../models/chat.js';
import order from '../controllers/order.js';

const messageSchema = new SimpleSchema({
    senderId: String,
    receiverId: String,
    type: String,
    message: String,
    file: {
        type: Buffer,
        optional: true
    }
}).newContext();

function init() {
    const io = new Socket(5404, {
        cors: {
            origin: '*'
        }
    });

    let celebrate = [];
    let cheers = [];
    let voted = [];
    let downvoted = [];

    io.on('connection', (socket) => {
        socket.emit('connected', 'Connected! Please subscribe to register event now!');

        socket.on('disconnection', () => {
            console.log('User disconnected');
        });

        socket.on('register', (response) => {
            if (response.id == undefined)
                return socket.emit("err", "Registration failed! User is undefined");
            socket.join(response.id);
            return socket.emit("register", "Successfully Registered");
        });

        socket.on('offline', (response) => {
            if (response.id == undefined) return socket.emit("err", "Error! User is undefined");
            users.findOne({ _id: response.id }).select('onlineStatus').then(status => {
                status.onlineStatus = 'Offline';
                status.save((error, res) => {
                    if (error) return socket.emit('err', error);
                    // socket.emit('offline2', status);
                    return io.sockets.emit('offline', {
                        id: response.id,
                        onlineStatus: 'Offline'
                    });
                });
            }).catch(error => { return socket.emit('err', error) });
        });

        socket.on('online', (response) => {
            if (response.id == undefined) return socket.emit("err", "Error! User is undefined");
            users.findOne({ _id: response.id }).select('onlineStatus').then(status => {
                status.onlineStatus = 'Online';
                status.save((error, res) => {
                    if (error) return socket.emit('err', error);
                    // socket.emit('online', status);
                    return io.sockets.emit('online', {
                        id: response.id,
                        onlineStatus: 'Online'
                    });
                });
            }).catch(error => { return socket.emit('err', error) });
        });

        socket.on('userStatus', (response) => {
            users.findOne({ _id: response.id }).select('onlineStatus').then(status => {
                return socket.emit('userStatus', status);
            }).catch(error => { return socket.emit('err', error) });
        });

        socket.on('findFriends', async (response) => {
            let friendList = null;
            if (response.fullName != undefined || response.phoneNo != undefined || response.username != undefined) {
                friendList = await users.find({
                    $or: [
                        { fullName: { $regex: '.*' + response.fullName + '.*', $options: 'i' } }, { phoneNo: { $regex: '.*' + response.phoneNo + '.*', $options: 'i' } }, { username: { $regex: '.*' + response.username + '.*', $options: 'i' } }
                    ]
                }).select('fullName username profilePic onlineStatus').lean();
                if (!friendList) return socket.emit('err', `Error! No user found!`);
            }
            console.log(friendList);
            return socket.emit('findFriends', friendList);
        });

        socket.on("chatList", async (response) => {
            let list = await users.findOne({ _id: response.id }).select("chatFriends").lean();
            if (list == null) return socket.emit("err", 'UserId is undefined');
            let userlist = await Promise.all(list.chatFriends.map(async (list) => {
                return {
                    user: await users.findOne({ _id: list.userId }).select("fullName username profilePic onlineStatus status"),
                    chat: list.chat
                }
            }));
            socket.emit('chatList', userlist);
        });

        socket.on('chatMessages', async (response) => {
            const sender = users.findOne({ _id: response.senderId });
            const receiver = users.findOne({ _id: response.receiverId });
            if (!sender) return socket.emit('err', `Error! No user found`);
            if (!receiver) return socket.emit('err', `Error! No user found`);
            const chats = await chat.find({
                $or: [
                    { senderId: response.senderId, receiverId: response.receiverId }, { senderId: response.receiverId, receiverId: response.senderId }
                ]
            }).sort({ createdDate: 1 });
            console.log(response);
            console.log(chats)
            return socket.emit('chatMessages', chats);
        });

        socket.on('message', async (response) => {
            if (response.type == 'file' && response.file !== undefined) {
                response.file = Buffer.from(response.file, "base64");
            }
            const isValid = messageSchema.validate(response);
            if (!isValid) return socket.emit('err', `Error! Message does not satisfy the schema`);
            if (response.senderId == response.receiverId) return socket.emit('err', `Error! sender can't be the receiver`);
            const sender = await users.findOne({ _id: response.senderId }).lean();
            const receiver = await users.findOne({ _id: response.receiverId }).lean();
            if (!sender) return socket.emit('err', `The sender's ID doesn't exists`);
            if (!receiver) return socket.emit('err', `The receiver's ID doesn't exists`);

            if (response.type == "file") {
                response.message = `${uuidv4()}.${response.message.split('.')[1]}`;
                fs.writeFileSync(`public/uploads/chats/${response.message}`, response.file);
                delete response.file;
                response.message = `https://${process.env.DOMAIN}/uploads/chats/${response.message}`;
            }
            users.findOne({ _id: response.senderId }).exec(function (err, array) {
                let findSenderChatList = array.chatFriends.findIndex(x => x.userId == response.receiverId)
                if (findSenderChatList == -1) {
                    array.chatFriends.push({
                        userId: mongoose.Types.ObjectId(response.receiverId),
                        chat: response.message
                    });
                } else {
                    array.chatFriends[findSenderChatList] = {
                        userId: mongoose.Types.ObjectId(response.receiverId),
                        chat: response.message,
                    }
                }
                array.save(function (err) {
                    if (err) socket.emit('err', "Something went worng");
                });
            });

            users.findOne({ _id: response.receiverId }).exec(function (err, array) {
                let findSenderChatList = array.chatFriends.findIndex(x => x.userId == response.senderId)
                if (findSenderChatList == -1) {
                    array.chatFriends.push({
                        userId: mongoose.Types.ObjectId(response.senderId),
                        chat: response.message
                    });
                } else {
                    array.chatFriends[findSenderChatList] = {
                        userId: mongoose.Types.ObjectId(response.senderId),
                        chat: response.message,
                    }
                }
                array.save(function (err) {
                    if (err) socket.emit('err', "Something went worng");
                });
            });

            let payloadData = {};
            const senderName = await users.findOne({ _id: response.senderId }).select('fullName').exec();
            const receiverFcmToken = await users.findOne({ _id: response.receiverId }).select('fcmToken').exec();
            await new chat(response).save().then(async (message) => {
                socket.emit('message', message);
                socket.to(response.receiverId).emit('message', message);

                payloadData = message
                message = message.toObject();
                message.senderId = await users.findById(message.senderId).select("fullName username profilePic onlineStatus status").exec();

                helper.notificationHelper(receiverFcmToken.fcmToken, 'MatchThat', `New message from ${senderName.fullName}`, message, payloadData, response.receiverId)
            }).catch(err => socket.emit('err', err.message));
        });

        socket.on('orderList', async (response) => {
            const orders = await order.getOrderList(response.orderStatus);
            return socket.emit('orderList', orders);
        });

        //spotify
        socket.on('comment', async (response) => {
            const user = await users.findById(response.id);
            return io.emit('comment', `user: ${user.email}, message: ${response.message}`);
        });

        socket.on('reactions', async (response) => {
            if (response.id == undefined) return socket.emit("err", "Error! User is undefined");
            const user = await users.findOne({ _id: response.id });
            if (user) {
                const [track] = await Track.find({ "tracksInfo.spotifytrackId": response.spotifytrackId }, { _id: 0, tracksInfo: { $elemMatch: { spotifytrackId: response.spotifytrackId } } }, { "tracksInfo.$": 1 });
                if (track) {
                    if (response.type === 1) {
                        for (let i = 0; i < track.tracksInfo.length; i++) {
                            const index = track.tracksInfo[i].downvoted.indexOf(user.email);
                            if (index > -1) {
                                await Track.updateMany({ 'tracksInfo': { $elemMatch: { spotifytrackId: response.spotifytrackId } } }, { $pull: { "tracksInfo.$.downvoted": user.email } }, { 'multi': true });
                            } else {
                                await Track.updateMany({ 'tracksInfo': { $elemMatch: { spotifytrackId: response.spotifytrackId } } }, { $push: { "tracksInfo.$.downvoted": user.email } }, { 'multi': true });
                            }
                        }
                        var count = commonHelper.reactionsArray(downvoted, response);
                        return io.emit('reactions', `the downvoted count is ${count}`);
                    } else if (response.type === 2) {
                        var count = commonHelper.reactionsArray(celebrate, response);
                        return io.emit('reactions', `the celebrate count is ${count}`);
                    } else if (response.type === 3) {
                        var count = commonHelper.reactionsArray(cheers, response);
                        return io.emit('reactions', `the cheers count is ${count}`);
                    } else if (response.type === 4) {
                        for (let i = 0; i < track.tracksInfo.length; i++) {
                            const index = track.tracksInfo[i].voted.indexOf(user.email);
                            if (index > -1) {
                                await Track.updateMany({ 'tracksInfo': { $elemMatch: { spotifytrackId: response.spotifytrackId } } }, { $pull: { "tracksInfo.$.voted": user.email } }, { 'multi': true })
                            } else {
                                await Track.updateMany({ 'tracksInfo': { $elemMatch: { spotifytrackId: response.spotifytrackId } } }, { $push: { "tracksInfo.$.voted": user.email } }, { 'multi': true })
                            }
                        }
                        var count = commonHelper.reactionsArray(voted, response);
                        return io.emit('reactions', `the voted count is ${count}`);
                    } else {
                        return io.emit('err', 'No such type exists');
                    }
                } else {
                    return io.emit('err', 'No such track exists')
                }
            } else {
                return io.emit('err', 'No such user exists')
            }
        });
    });
}

export default { init };