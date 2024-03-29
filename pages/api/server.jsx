import { Server } from 'socket.io';
import { createServer } from 'http';
import mongoose from 'mongoose';
import Room from '../../models/roomModel';
import { Message } from '../../models/messageModel';

export default function socket(req, res) {
  // Server is already created
  if (res.socket.server.io) {
    res.end();
    return;
  }
  console.log(`Created server running on port 3000`);

  mongoose
    .connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log(`Connected to MongoDB at ${process.env.MONGO_DB}`))
    .catch(error => console.log(error));

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  //listening to connection
  const onConnection = socket => {
    console.log(`Connected: ${socket.id}`);

    //join room based on id
    socket.on('joinRoom', async roomId => {
      try {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        const room = await Room.findOne({ id: roomId });
        await Room.updateOne({ id: roomId }, { $set: { userCount: room.userCount + 1 } });
      } catch (e) {
        console.log(e);
      }
    });

    //create room based on id
    socket.on('createRoom', async roomId => {
      try {
        console.log('creating room', roomId);
        const newRoom = new Room({
          id: roomId,
          userCount: 1,
          messages: []
        });
        await Room.create(newRoom);
        socket.join(roomId);
        console.log(`User ${socket.id} created room ${roomId}`);
      } catch (e) {
        console.log(e);
      }
    });

    //send message
    socket.on('sendMessage', async msgData => {
      try {
        const msg = new Message({
          user: msgData.user,
          roomId: msgData.room,
          message: msgData.message,
          time: msgData.time
        });
        // creates new message object
        await Message.create(msg);
        const room = await Room.findOne({ id: msgData.room });
        // adds new message to list and updates message list
        console.log('room exists', msgData.room);
        room.messages.push(msg);
        await Room.updateOne({ id: msgData.room }, { $set: { messages: room.messages } });
        //emit message to everyone listening in same room
        //socket.to(msgData.room).emit('receivedMessage', msgData);
        socket.broadcast.to(msgData.room).emit('receivedMessage', msgData);
        console.log(`sent message ${JSON.stringify(msgData)}`);
      } catch (e) {
        console.log(e);
      }
    });
  };

  io.on('connection', socket => {
    onConnection(socket);
  });
  res.end();
}
