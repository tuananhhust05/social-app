import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css"

// thằng này nó sẽ hiện ra danh sách bạn bè đang online của bạn và nếu bạn click vào 
// thì có thể trò chuyện với họ 

export default function ChatOnline({userInfor,currentUser}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    
    const [userDetail,setUserDetail]=useState({username:""})  // tránh trường hợp an null => Truyền vào user name rỗng
    useEffect(() => {  // lấy ra danh sách message khi current chat thay đổi
      const getuser = async () => {
        try {
          const res = await axios.get("/users/getuser/" + userInfor.userId);  // current chat có thể rỗng vì ban đầu có thể chưa chọn 
          setUserDetail(res.data[0])
        } catch (err) {
          console.log(err);
        }
      };
      getuser();
    }, []);
   
    //logic cần nằm trong thẻ dom 
    return (
      <div>
          {(userInfor.userId==currentUser._id) ? (
              <div>
              </div>
          ) : (
            <div className="chatOnline">
        
                  <div className="chatOnlineFriend" >
                    <div className="chatOnlineImgContainer">
                    <img
                        className="conversationImg"
                        src={
                          userInfor?.profilePicture
                            ? PF + userInfor.profilePicture
                            : PF + "person/noAvatar.png"
                        }
                        alt=""
                      />
                      <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">{userDetail.username}</span>
                  </div>
          </div>

          )}
      </div>
     


     
    );
  }