import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext"// để lấy dữ liệu user 
import Topbar from "../../components/topbar/Topbar"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message" // config các tin nhắn 
import ChatOnline from "../../components/chatOnline/ChatOnline" // danh sách những ông đang online
import "./messenger.css"
import axios from "axios"
import { io } from "socket.io-client"   // import server 
// lưu ý hoạt động của set State trong re-render FE 
// không set lại giá trị khởi tạo 
// tránh những useEffect có điều kiện hoặc reference 
// việc re-render lại 1 ob không ảnh hưởng đến 1 object khác đã set 


export default function Messenger(){
    const { user } = useContext(AuthContext);  // lấy dữ liệu tài khoản 
    const [conversations, setConversations] = useState([]);  // conversationid biểu thị cho cuộc trò chuyện giũa hai người 
    // thằng này chứa 1 mảng gôm các id của conversation 
    const [currentChat, setCurrentChat] = useState(null); // set trạng thái chat,
    // lấy dữ liệu các cuộc trò chuyện trong db 
    const [messages, setMessages] = useState([]); // lấy danh sách các tin nhắn 

    const [newMessage, setNewMessage] = useState("") // nhập tin nhắn mới 
   
    const scrollRef = useRef(); // config cho tin nhắn mới sẽ hiện xuống dưới 
    // thằng cuộn này hoạt động khi ta có thêm tin nhắn; mảng tin nhắn thay đổi 
    // thằng này set ở mỗi tin nhắn 
   
    const [chatUsers, setChatUsers] = useState([]);  // lấy danh sách user
    

    // chộp tin nhắn vừa được gửi sau đó thêm vào list mesage ban đầu rồi render ra 
    // cách bình thường là phỉa reload page hoặc chỉ thấy tin nhắn của mình 
    const [arrivalMessage, setArrivalMessage] = useState(null);// lấy thông tin của tin nhắn vừa gửi 
    const socket = useRef(); // để tránh việc thay đổi socket id trong 1 phiên làm việc 
    
    // luôn lắng nghe 1 lần khi reload page 
    // sẽ hoạt động đếu bắt được tín hiệu từ server
    useEffect(() => {  // lắng nghe tin nhắn được gửi tới socketid của nó từ server
      socket.current = io("ws://localhost:8900"); // dùng ig... là kết nối rối 
      // trên thằng server cũng nhận được 1 object socket
      socket.current.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }, []);
    
    // thêm mesage 
    useEffect(() => {
      // logic code: nếu arrivalMessage khác null( chỉ xét khi nó có sự thay đổi giá trị)
      // và trong thằng currenChat check được có tồn tại id sender của arrival thì nó thêm vào danh sách mesage và render lại 
      arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    // chạy 1 lần cho đến khi user thay đổi 
    // cập nhật thông tin user đăng nhập và lấy danh sách user online 
    useEffect(() => {
      socket.current.emit("addUser", user._id); // cập nhật idUser lên server socket 
      socket.current.on("getUsers", (users) => { // thằng web socket trả về những user đang kết nối với web socket server 
        setChatUsers(users); // set những User có thể tham gia chat 
      });
    }, [user]);
   
    // láy thông tin conversatio 
    useEffect(() => {
      const getConversations = async () => {
        try {
          const res = await axios.get("/conversations/" + user._id);
          
          setConversations(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getConversations();
    }, [user._id]);
    
    // currentChat = conversation được chọn => CurrentChat.id= conversaton._id 
    // Trong thằng messenger có lưu 1 trường là id conversation 
    useEffect(() => {  // lấy ra danh sách message khi current chat thay đổi
      const getMessages = async () => {
        try {
          const res = await axios.get("/messages/" + currentChat?._id);  // current chat có thể rỗng vì ban đầu có thể chưa chọn 
          setMessages(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getMessages();
    }, [currentChat]);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      // current 
      const message = {
        // thu thập dữ liệu 
        sender: user._id,
        text: newMessage,  // set liên tục ; vừa gõ vừa re-render FE 
        conversationId: currentChat._id,// thu thập dữ liệu 
      };
      // current chat lưu 1 mảng gômg id của user và id của người tham gia chat 
      const receiverId = currentChat.members.find(
        (member) => member !== user._id
      );
      
      // bắn đoạn tin lên web socket 
      // quan trọng là thằng socket này đã mang id
      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage,
      });

      try {
        const res = await axios.post("/messages", message);  // call api gửi tin nhắn vào db 
        // trả về message vừa nhập 
        // sau đó set bổ sung vào mảng 
        setMessages([...messages, res.data]);  // set lại danh sách tin nhắn => re-render -FE 
        setNewMessage("");   // set lại tin nhắn 
      } catch (err) {
        console.log(err);
      }
    };
    

    // tạo conversation
    const handleCreateCoversation = async (receiver)=>{
      var a=0;
      try {
         // console.log(conversations)
         for(var i=0;i<conversations.length;i++){
           if(conversations[0].members.includes(receiver)){
            a=a+1;
           }
         }
         if(a>0){
          alert("Đã có cov không call api")
         }
         else{
          const res = await axios.post("/conversations", {senderId:user._id,receiverId:receiver});  // call api gửi tin nhắn vào db 
          // trả về message vừa nhập 
          // sau đó set bổ sung vào mảng 
          setConversations([...conversations, res.data]);  // set lại danh sách tin nhắn => re-render -FE 
          }
      } catch (err) {
        console.log(err);
      }

    }
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });// đoạn code để trượt xuống khi có tin nhắn mới 
    }, [messages]);
    return (
        <div>
              <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
              {/*click thì set thông tin currentchat theo thông tin của conversation*/}
              {conversations.map((c) => (
                <div onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))}
              
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
          {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      {/*chỉnh giá trị own dựa vào cách so sánh người gửi tin nhắn với id của người đăng nhập*/}
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
               {chatUsers.map((m) => (
                    <div onClick={() => handleCreateCoversation(m.userId)}>
                      {/*chỉnh giá trị own dựa vào cách so sánh người gửi tin nhắn với id của người đăng nhập*/}
                      {/*Bây giờ sẽ truyền vào mảng gồm userId và socketID*/}
                      <ChatOnline 
                        userInfor={m} 
                        currentUser={user}
                        />
                    </div>
                ))}
            
          </div>
        </div>
      </div>
        </div>
    )
}