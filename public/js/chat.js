$(window).on('load',function(){
    var uri = window.location.href.toString().split("?");
    const host = location.host
    window.history.replaceState({},document.title,uri[0]);
    var from_id = uri[1].split("=")[1];
    var users = document.getElementById('userlist');
    var curr = "uemail="+from_id;
    var socket = io.connect(`http://${host}`,{query: curr});
    var to_id;
    var prev;
    var text_id = document.getElementById("user_chat");
    var btn = document.getElementById("send");
    var user_name = document.getElementById("user_name");
    if(to_id==null)
    {
        $("#textmessage").prop('disabled', true);
    }
    //socket
    socket.on('update_user_list',(data)=>{
        var liston = "";
        var listoff = "";
        //console.log(data);
        for(x in data){
            if(data[x]._id!=from_id){
                if(data[x].isOnline)
                {
                    liston += "<div class='chat_list' id='"+data[x]._id+"'>"+
                            "<div class='chat_people'>"+
                            "<div class='chat_img'> <img src='https://ptetutorials.com/images/user-profile.png' alt='sunil'> </div>"+
                            "<div class='chat_ib'>"+
                                "<h5>"+data[x].name+"&nbsp;&nbsp;<div class='led-green'></div><span class='chat_date'>Dec 25</span></h5>"+
                                "<p>Hey there, i m on chat</p>"+
                            "</div></div></div>";
                }
                else
                {
                    listoff += "<div class='chat_list' id='"+data[x]._id+"'>"+
                            "<div class='chat_people'>"+
                            "<div class='chat_img'> <img src='https://ptetutorials.com/images/user-profile.png' alt='sunil'> </div>"+
                            "<div class='chat_ib'>"+
                                "<h5>"+data[x].name+"&nbsp;&nbsp;<div class='led-red'></div><span class='chat_date'>Dec 25</span></h5>"+
                                "<p>Hey There, I m on chat</p>"+
                            "</div></div></div>";
                }
            }
            else{
                user_name.innerHTML = data[x].name;
            }
        }
        liston += listoff;
        users.innerHTML=liston;
    });
    socket.on('broadcast',(data)=>{
        var newuser = "<div class='chat_list' id='"+data._id+"'>"+
                        "<div class='chat_people'>"+
                        "<div class='chat_img'> <img src='https://ptetutorials.com/images/user-profile.png' alt='sunil'> </div>"+
                        "<div class='chat_ib'>"+
                            "<h5>"+data.name+"&nbsp;&nbsp;<div class='led-green'></div><span class='chat_date'>Dec 25</span></h5>"+
                            "<p>Hey there, I m on chat</p>"+
                            "</div></div></div>";
        $("#"+data._id).remove();
        users.innerHTML = newuser + users.innerHTML;
    });

    socket.on("new_msg",(data)=>{
        var recent = $("#"+data.from_id).find("p");
        recent.text(data.msg)
        if(to_id==data.from_id)
        {
            var msg = '<div class="incoming_msg">'+
                        '<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>'+
                        '<div class="received_msg">'+
                        '<div class="received_withd_msg">'+
                        '<p>'+data.msg+'</p>'+
                        '<span class="time_date"> 11:01 AM    |    June 9</span></div></div></div>'
                        text_id.innerHTML += msg;
            
        }
        else recent.css("color","red");
        text_id.scrollTop = text_id.scrollHeight - text_id.clientHeight;

    });

    socket.on('take_msg',(data)=>{
        //console.log(data);
        var merger = "";
        for(x in data){
            if(data[x].from_id===from_id)
            {
                merger += '<div class="outgoing_msg">'+
                '<div class="sent_msg">'+
                '<p>'+data[x].message+'</p>'+
                '<span class="time_date"> 11:01 AM    |    June 9</span> </div></div>';
            }
            else 
            {
                merger += '<div class="incoming_msg">'+
                '<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>'+
                '<div class="received_msg">'+
                '<div class="received_withd_msg">'+
                '<p>'+data[x].message+'</p>'+
                '<span class="time_date"> 11:01 AM    |    June 9</span></div></div></div>'
            }
    }
        text_id.innerHTML = merger;
        text_id.scrollTop = text_id.scrollHeight - text_id.clientHeight;
    });




    //socket emit
    btn.addEventListener('click',()=>{
        socket.emit('chat',{
            from_id: from_id,
            to_id: to_id,
            message: textmessage.value,
        });
        text_id.innerHTML +=  '<div class="outgoing_msg">'+
                                        '<div class="sent_msg">'+
                                        '<p>'+textmessage.value+'</p>'+
                                        '<span class="time_date"> 11:01 AM    |    June 9</span> </div></div>'
        textmessage.value = "";
        text_id.scrollTop = text_id.scrollHeight - text_id.clientHeight;
    });    
    $("#textmessage").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#send").click();
        }
    });



    //click event
    $("#userlist").on("click","div.chat_list",function(){

        to_id = $(this).attr('id');
        $(this).find("p").css("color","#989898");
        $('#textmessage').prop('disabled',false);
        if(this!=prev){
            socket.emit('getmessages',{
                from_id: from_id,
                to_id: to_id
            });
            $(this).addClass('active_chat');
            $(prev).removeClass('active_chat');
            prev = this;
            text_id.innerHTML = "";
        }
        var txt = $(this).find("h5").html();
        var regex = /(.*)&nbsp;&nbsp;/;
        txt = txt.match(regex)[1];
        $("#seluser").text("Chatting with "+txt);
    });
});


