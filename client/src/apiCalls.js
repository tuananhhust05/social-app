import axios from "axios";

// catch lỗi ở đây là dùng  để bắt lỗi khi trò chuyện cùng server 
export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login", userCredential);
    if(res.data.email!=undefined){
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    }
    else{
      alert(res.data);// in ra thông báo trả từ server
      // sai thì không quan trọng payload
      dispatch({ type: "LOGIN_FAILURE", payload:"sai mật khẩu" });
    }
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
