//  config các action cho redux 
// quyết định vào thời điểm nào sẽ bắn ra form login thì nằm ở các component 
// bắt đầu login
export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

// login thành công
export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

// login thất bại 
export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});
