import "./message.css";
import { format } from "timeago.js";  // config thời gian cho tin nhắn 


// truyền vào tin nhắn và thông tin sở hữu của tin nhắn là bạn hay hay người nói chuyện với bạn 
// true false và được css 
// chỉ cần click vào 1 thằng thì sẽ hiện ra thông tin chat của mình với 1 đối tượng, đơn giản vậy thôi 
export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="http://localhost:8800/images/person/noAvatar.png"
          alt=""
        />{/*Hình anh mặc định*/}
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}