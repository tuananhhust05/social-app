// server socket chạy tại cổng 8900
// kết nối với client thông địa chỉ client 
// sau này deploy lên chũn chạy như này 
const io = require("socket.io")(8900, { 
    cors: {
      origin: "http://localhost:3000",
    },
  });

  let users = []; // chứa các object mà mỗi object chứa thông tin userId đi với socket id 

  // hàm này hoạt động  như sau 
  // nếu trong mảng users không có object nào có trường userId 
  // bằng với userId truyền vào thì ta thêm object với dữ liệu userId và usersocketid 

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const getUser = (userId) => {  // trả về ob có userid cần tìm 
   
    return users.find((user) => user.userId === userId);
  };
  
  // dùng khi user ngắt kết nối 
  const removeUser = (socketId) => {
    
    users = users.filter((user) => user.socketId !== socketId);
  };

// kênh connection là kênh đặc biệt 
// lắng nghe user truy cập từ đó xác định tài khoản online 
io.on("connection",(socket)=>{ // thằng socket truyền vào là thằng user chuyển lên khi user io("ws:http/....")
    console.log("a user connected")
    socket.on("addUser", (userId) => { // user cũng emit vào kênh adduser cái user id của họ 
      addUser(userId, socket.id);  // dùng thằng socket bắn lên từ user khi user kết nối để lấy socketid
      io.emit("getUsers", users);  // trả về trên kênh getUser 1 mảng gồm danh sách user đang online
    });

    //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => { // nhận data
   
    const user = getUser(receiverId); // tìm ob trong danh sách đang hoạt động 
    
    // // và tiến hành gửi qua kênh get message
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
     });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
})