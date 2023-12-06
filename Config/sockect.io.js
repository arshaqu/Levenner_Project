const socketIO = require('socket.io') 
const dotenv= require('dotenv')

dotenv.config()


function intializeSocket(server) {
    const io = socketIO(server, {
        pingTimeout:60000,
        cors: {
            origin:"*"
         },
      });
      

    io.on('connection', (socket) => {
        socket.on('setup', (id) => {
            socket.join(id)
            socket.emit('connected')
            console.log('A user connected' +id);
        });

        socket.on('join', (room) => {
            socket.join(room);
            console.log("room" , room);
            console.log("joined");
        })
    
        socket.on('chatMessage', (message) => {
            // console.log("seding ...");
            //  console.log(message.toId);
            //  console.log(message,"in Socket.io");
            //     socket.in(message.toId).emit("msgDone",message);
   
             if(message.fromId == message.senderId){
                socket.in(message.toId).emit("msgDone",message)
             }else{
                socket.in(message.fromId).emit("msgDone",message)
             }

         
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

}



module.exports = intializeSocket