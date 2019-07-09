
    //elements
    var socket = io.connect();
    var messageForm = document.getElementById('messageForm');
    var message = document.getElementById('message');
    var messageArea = document.getElementById('messageArea');
    var output = document.getElementById('output');
    var userFormArea = document.getElementById('userFormArea');
    var lgnbutton = document.getElementById('lgnButton');
    var msgbutton = document.getElementById('msgButton');
    var users = document.getElementById('users');
    var username = document.getElementById('username');
    var feedback = document.getElementById('feedback');


    //send username
    lgnbutton.addEventListener('click', function () {
        socket.emit('new user', username.value, function (data) {
            if (data) {
                userFormArea.style.display = 'none';
                messageArea.style.display = 'block';
            }
        });
    });

    //Typing event emit
    message.addEventListener('keypress',function(){
        socket.emit('typing', username.value);
    });
   //Textaree submit Bug fix
    message.addEventListener('click', function(e){
        e.preventDefault();
    });

    //display typing user
    socket.on('typing', function(data){
        console.log('typing');
        feedback.innerHTML ='<p><em>'+ data +' is typing...</em></p>';
    });

    //send message
    msgbutton.addEventListener('click',function () {
        socket.emit('send message', message.value);
        message.value = '';
    });

    //display message
    socket.on('new message', function (data) {
        feedback.innerHTML = '';
        output.innerHTML += '<p><strong>' +data.user+'</strong>: '+ data.msg +'</p>';
    });

    //display Users
    socket.on('get users', function (data) {
        var html = '';
        for (i = 0; i < data.length; i++) {
            html += '<li id="user-list-item" class="list-group-item">'+ data[i]+'</li>';
        }
        users.innerHTML = html;
        console.log(data)
    });