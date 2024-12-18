import { Server } from 'socket.io';
import Message from '../server/modal/Message.js';
import Conversation from '../server/modal/Conversation.js';



const io = new Server(9000, {
    cors: {
        //origin: 'http://localhost:3000',
        origin: 'https://updates.properwebtechnologies.co.in',
    }, 
});

let users = [];

const addUser = (userData, socketId) => {
    if (!users.some(user => user.sub === userData.sub)) {
        users.push({ ...userData, socketId });
    }
};

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user => user.sub === userId);
};

const updateReadStatus = async (messageId) => {
    try {
        const result = await Message.findByIdAndUpdate(
            messageId,
            { read: true },
            { new: true } // This option returns the updated document
        );
        console.log('Message Updated:', result);
    } catch (error) {
        console.log('Error updating message:', error.message);
    }
};

io.on('connection', (socket) => {
    console.log('user connected');

    // connect
    socket.on("addUser", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    });

    // send message
    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);
        if (user) {
            io.to(user.socketId).emit('getMessage', data);
        } else {
            console.log(`User with ID ${data.receiverId} not found`);
        }
    });

    // mark message as read
    socket.on('markAsRead', async (messageId) => {
        console.log(messageId);
        try {
           // await Message.findByIdAndUpdate(messageId, { read: true });
           const messageId = '66a24263faf91c421ce10b9d'; // Replace with the actual message ID
            //updateReadStatus(messageId);
            console.log(`Message with ID ${messageId} marked as read`);
        } catch (error) {
            console.error(`Error marking message as read: ${error}`);
        }
    });

    // disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    });
});
