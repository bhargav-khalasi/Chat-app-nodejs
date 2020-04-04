const mongoose = require('mongoose');
const Joi = require('joi');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.pluralize(null);
const config = require('config')
const host = config.get('db')
//console.log(host)
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
    message: String
}));
function validateUser(user)
{
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(5).max(255).required().email(),
        pass: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(user,schema);
}

exports.User = User;
exports.Chat = Chat; 