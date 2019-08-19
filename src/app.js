const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const documents = {};

io.on("connection", socket => {
    let previousId;
    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId);
      previousId = currentId;
    };
  
    socket.on("getDoc", docId => {
      safeJoin(docId);
      socket.emit("document", documents[docId]);
    });
  
    socket.on("addDoc", doc => {
      documents[doc.id] = doc;
      safeJoin(doc.id);
      io.emit("documents", Object.keys(documents));
      socket.emit("document", doc);
    });
  
    socket.on("editDoc", doc => {
      documents[doc.id] = doc;
      socket.to(doc.id).emit("document", doc);
    });
  
    io.emit("documents", Object.keys(documents));
  });

  //Listen chat server
  //http.listen(4444,"Listen port");
  // Create an instance of the http server to handle HTTP requests
// let server = http.createServer((req, res) => {
//     // Set a response type of plain text for the response
//     res.writeHead(200, {'Content-Type': 'text/plain'});

//     // Send back a response and end the connection
//     res.end('Hello World!\n');
// });

// Start the server on port 3000
http.listen(3000, function(){
    console.log('Chat server running on port 3000');
});
