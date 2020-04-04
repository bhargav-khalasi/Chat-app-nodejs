const mongoose = require('mongoose');
const Joi = require('joi');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.pluralize(null);
const config = require('config');
const host = config.get('db');
mongoose.connect(host,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(()=>console.log("Connected to the MongoDB"))
    .catch((err)=>console.log(err.message));

const User = mongoose.model('users',new mongoose.Schema({
    name: {
        type:String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isOnline:{
        type: Boolean,
        default: false
    }
}));
const Chat = mongoose.model('chat_history',new mongoose.Schema({
    from_id: String,
    to_id: String,
    message: String,
    chat_time: Date
}));

exports.User = User;
exports.Chat = Chat; 