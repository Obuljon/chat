import { Server } from 'socket.io';
import usersdb from '../modul/usersdb.js';
import chatdb from "../modul/chatdb.js"
import {extractIds, checkObjectExistenceById, findObjectsByMethod} from "../helps/help.js"
export function initSocket(server) {
  const io = new Server(server);
  
  io.on('connection', (socket) => {
    var room;
    var user
    var mainroom = ""
    var interval = setInterval(() => {
      if(user)
      io.to(Array.from(socket.rooms)).emit("online", {_id:user._id, line:"online"})
    }, 1000)
    const myArray = Array.from(socket.rooms);
    room = myArray[0];
    socket.on("new user", async (data) => {
      user = await usersdb.findById(data);
      const rooms = user.friends.map(e => e = e.chat_id)
      rooms.push(data)
      rooms.forEach((item) => {
        socket.join(item);
      });

          io.to(room).emit("user data", user);
          const userFriends = await usersdb.find({ _id: { $in: extractIds(user.friends) } });
          io.to(room).emit("user friends", userFriends);
          interval
        });
    
    socket.on("offer", async (data) => {
      if(findObjectsByMethod(user.friends, data)){
        mainroom = findObjectsByMethod(user.friends, data).chat_id
        const chat = await chatdb.findById(mainroom)
        io.to(room).emit("response offer", {mainroom, chat})
      }
    })

    socket.on("new friend", async (data) => {
      const friends = await usersdb.findById(data);
      let hostchat
      if(!checkObjectExistenceById(user.friends, data)){
         const charusers = [{name:friends.name,_id:friends._id},{name:user.name, _id:user._id}]
         hostchat = await chatdb.create({users:charusers,messages:[]});
         await usersdb.updateOne(
            {"_id":data}, 
            {
               $push:{
                  friends:{
                     friendsname:user.name,
                     friends_id:user._id,
                     friendoffer:false,
                     friendyes:false,
                     chat_id:hostchat._id
                  }
               }
            })
         await usersdb.updateOne(
            {"_id":user._id}, 
            {
               $push:{
                  friends:{
                     friendsname:friends.name,
                     friends_id:friends._id,
                     friendoffer:false,
                     friendyes:false,
                     chat_id:hostchat._id
                  }
               }
            })
            user = await usersdb.findById(user._id);
            }else{
              hostchat = await chatdb.findById(findObjectsByMethod(user.friends, data).chat_id)
            }
            io.to(room).emit("response offer", {hostchat, id:data})
    })

    socket.on("searchpost", async (data) => {
      const search = await usersdb.find({_id: { $ne: user._id }, name: { $regex: data, $options: "i" } })
      io.to(room).emit("search", search)
    })
    

    socket.on('send-message', (data) => {
      if(mainroom == data.room){
        io.to(data.room).emit('chat-message', data);
      }
    });

    socket.on('disconnect', () => {
        clearInterval(interval);
        if(user)
        io.to(Array.from(socket.rooms)).emit("online", {_id:user._id, line:"offline"})      
        socket.leaveAll();
    });
  });
}
