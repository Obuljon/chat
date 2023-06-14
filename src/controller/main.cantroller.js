import usersdb from "../modul/usersdb.js";
import chatdb from "../modul/chatdb.js";
import { checkObjectExistenceById, findObjectsByMethod, methods } from "../helps/help.js"
class maincantroller{
   async shopimage(req, res){
      const user = await usersdb.findById(req.session.user._id);
        if(user.images.length != 0){
           res.json(user.images[user.images.length - 1])
        }else{
         res.json({image:"noavatar.png"})
        }
   }
   async rooms(req, res){
      const rooms = req.session.user.friends.map(e => e = e.chat_id)
      res.json(rooms)
   }

   async myfriends(req, res){
      const user = await usersdb.findById(req.session.user._id);
      res.json({chats:user.friends})
      
   }
   
   
   async thechat(req, res){
      try {
         const {name, _id} = req.session.user;
         const friends = await usersdb.findById(req.params.id)
         if(!checkObjectExistenceById(friends.friends, _id)){
            const charusers = [{name:friends.name,_id:friends._id},{name, _id}]
            const hostchat = await chatdb.create({users:charusers,messages:[]});
            await usersdb.updateOne(
               {"_id":req.params.id}, 
               {
                  $push:{
                     friends:{
                        friendsname:name,
                        friends_id:_id,
                        friendoffer:false,
                        friendyes:false,
                        chat_id:hostchat._id
                     }
                  }
               })
            await usersdb.updateOne(
               {"_id":_id}, 
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
               const user = await usersdb.findById(_id);
               req.session.user = user
               }
            const search_chat = findObjectsByMethod(req.session.user.friends, req.params.id)
            const chat = await chatdb.findById(search_chat.chat_id)
         res.json(chat)
      } catch (error) {
         console.error
      }

      
   }
   
   async search(req, res){
         const data = await usersdb.find({ name: { $regex: req.body.message, $options: "i" } })
         res.json(data)
   }

   async updatafile(req, res){
      
      if (!req.file) {
         return res.status(400).json({ error: 'No file uploaded' });
      }
      await usersdb.updateOne({"_id":req.session.user._id, }, {$push : { images: { "image":req.file.originalname } }})
       // Process the uploaded file if needed
     
       res.json({ image:req.file.originalname });
   }

}

export default new maincantroller()