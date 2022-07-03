import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext} from "./context/AuthContext";

function App() {
  // trong authContext chứa dữ liệu người dùng lấy từ localStorage 
  const { user } = useContext(AuthContext);  // lấy dữ liệu từ context 
  return (
    <Router>
      <Switch>
        {/*Nếu user đúng thì trang ban đầu hiển thị component home không thì thi register*/}
        <Route exact path="/">
          {user ? <Home /> : <Register />}
        </Route>

        {/*Thằng redirect này đã giải quyết được bài toán tự động chuyển trang */}
        {/*Tất cả dựa vào 1 dữ liệu lưu vào local Storage }
        {/*Vào trang Login , nếu user đã tồn tại thì vẫn redirect đến trang login vì để tránh xung đột local storage với các web site khác */}
        <Route path="/login"> <Login />
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/login" /> : <Register />}
        </Route>
        <Route path="/messenger">
          {/*Nếu không có user thì chuyên đến trang chính; user lấy từ AuthContext*/}
          {!user ? <Redirect to="/" /> : <Messenger />}
        </Route>
        {/*Config route đi vào profile*/}
        <Route path="/profile/:username">
          <Profile />
        </Route>

        {/*Ở đây chưa có phần config đi vào chat*/}
       
      </Switch>
    </Router>
  );
}

export default App;
