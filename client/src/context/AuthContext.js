import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {   // khởi tạo dữ liêuj global state thông qua local storage 
  user:JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

// tạo ra context chứa dữ liệu 
// mỗi khi user gọi đến useContext thì lệnh khởi tạo INITIAL_STATE được gọi lại. 
export const AuthContext = createContext(INITIAL_STATE);

//Dùng để khởi tạo cấu trúc reducer 
// state ở đây là global state trong redux 
// children là element con ; children con (App) phải sử dụng dữ liệu chung của authcontex. provider 
export const AuthContextProvider = ({ children }) => {
  // dispatch thằng state đến authReducer ( AuReducer có state khởi tạo là initState )
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  // dữ liệu của user lấy từ local storage 
  useEffect(()=>{
    // Khai báo để đẩy dữ liệu authentication của user lên localStorage 
    // state là action được dispath lên 
    localStorage.setItem("user", JSON.stringify(state.user))
  },[state.user])
  
  // kiến thức về react useContext;
  return (
    /*Config dữ liệu trong redux*/
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
