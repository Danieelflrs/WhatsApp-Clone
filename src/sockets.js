module.exports = function (io) {

    let nicknames = {};

    io.on('connection', socket =>{
        console.log('Nuevo usuario conectado');

        socket.on('new user', (data, cb)=>{
            if (data in nicknames){
                cb(false);
            } else { 
                cb(true);
                socket.nickname = data;
                nicknames[socket.nickname] = socket ;
                updateNickNames();
            }
        });

        socket.on('send message', ( data, cb)=> {
            var msg = data.trim();
            if(msg.substr(0,3) === '/w' ){
                console.log("Se ha detectado el comando Whisper");
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if(index !== -1){
                    var name = msg.substr(0,index);
                    var msg = msg.substr(index + 1);
                    if(name in nicknames){
                        nicknames[name].emit('whisper',{
                            msg,
                            nick: socket.nickname
                        });                        
                    } else{
                        cb('Error! Please enter a valid Username');
                    }
                } else{
                    cb('Error! Please enter your message');
                }
            } else {
                io.sockets.emit('new message',{
                    msg:data,
                    nick:socket.nickname
                });                
            }
        });
        
        socket.on('disconnect', data =>{
            if(!socket.nickname) return;
            delete nicknames[socket.nickname];
            updateNickNames();
        });

        function updateNickNames(){
            io.sockets.emit('usernames', Object.keys(nicknames));
        }
  });
};