import { Schema, model } from "mongoose";

const signup = new Schema({
        name:{type:String, required:true},
        email:{type:String, required:true},
        password:{type:String, required:true},
        // about:{type:Object,required:true},
        friends:{type:[{
            friendsname:{type:String,required:true},
            friends_id:{type:String,required:true},
            friendoffer:{type:Boolean,required:true},
            friendyes:{type:Boolean,required:true},
            chat_id:{type:String,required:true},
            },
            {
                timestamps:true
            }
        ],required:true},
        images:{type:[
            {
                image:{type:String, required:true},
            },
            {
                timestamps:true
            }
        ], required:true},
    },
    {
        timestamps:true
    }
    )

export default model('users', signup);