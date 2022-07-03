import { useContext, useRef } from "react"
import "./login.css"
import { loginCall } from "../../apiCalls"
import { AuthContext } from "../../context/AuthContext"
import { CircularProgress } from "@material-ui/core"
import { useHistory } from "react-router"
import axios from "axios"
export default function Login() {
  const email = useRef();  // khai báo là biến toàn cục bên ngoiaf khi re- render thì không bọ báo lại undefined 
  const password = useRef();
  const history = useHistory();// chuyển trang

  // lấy dữ liệu từ context
  const { isFetching, dispatch } = useContext(AuthContext); // lấy dữ liệu từ authcontext 
  // dùng cách khác để dispatch thôi 

  const handleClick = async (e) => {
    e.preventDefault();
    
  
    // dispatch action , trong thằng call api nó vừa dispatch action; vừa call api 
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
    // thằng chuyển trang cũ dựa vào state mà bây giờ mình muốn verify lại thằng state nên làm lại đoạn login này 
    // Thằng state global chỉ set lại giá trị mà nó thay đổi thôi, không set lại toàn chương trình nên lệnh call api để chuyển trang sau đây vẫn có hiệu quả 
    // hiện taij chấp nhận việc phải call api 2 lần để tránh phụ thuộc vào state và khắc phục nguy cơ sự cố bên localStorage 
    const res = await axios.post("/auth/login",  { email: email.current.value, password: password.current.value }); // call api 
    if(res.data.email!=undefined)
    {
      history.push("/");
    }
    else{
      history.push("/login");
    }
    
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
