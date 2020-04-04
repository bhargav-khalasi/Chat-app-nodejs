const express = require('express');
const app = express();
const user = require('./routes/users');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const path = require('path');
const socket = require('socket.io');
const {User,Chat} = require('./models/user');
require('./prod')(app)
var curr;

//middleware
app.engine('html',cons.swig)
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','html')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/',user);



//connection
const port = process.env.PORT || 3000;
var server = app.listen(port,()=>console.log(`Listening to port ${port}..`));

//socket
var io = socket(server);
io.use(function(socket, next) {
    curr = socket.request._query['uemail'];
    // console.log(curr.split("@")[0])
    next();
  });

io.on('connection',async function(socket){
    //console.log(curr)
    let on_user = await online_users()
    let curr_user = await current_user(curr);
    //console.log(curr_user);
    socket.join(curr_user._id);
    socket.emit('update_user_list',on_user);
    socket.broadcast.emit('broadcast',curr_user);
    socket.on('chat',async (data)=>{
      io.sockets.in(data.to_id).emit('new_msg',{from_id:data.from_id, msg:data.message});
      await savechat(data);
    });
    socket.on('getmessages',async (data)=>{
      let msg_h = await Chat.find()
        .or([{from_id:data.from_id,to_id:data.to_id},{from_id:data.to_id,to_id:data.from_id}])
        .select({message:1,from_id:1,_id:0});
        socket.emit("take_msg",msg_h);
        //console.log(msg_h);
    });
    socket.on('window_closed',async (data)=>{
      await close_conn(data.from_id)
      let on_user = await online_users()
      //console.log(on_user)
      socket.broadcast.emit('update_user_list',on_user);
    });
});

async function savechat(data)
{
  let save_new_msg = new Chat({
    from_id: data.from_id,
    to_id: data.to_id,
    message: data.message
  });
  await save_new_msg.save();
}

async function close_conn(user_id)
{
  await User.updateOne({ _id:user_id }, { isOnline: false });
}
async function online_users()
{
  return await User.find({},{email:1,name:1,_id:1,isOnline:1});
}

async function current_user(curr_id)
{
  return await User.findOne({_id: curr_id },{name:1,_id:1});
}