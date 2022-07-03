const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  // catch lỗi ở đây là xử lý lỗi khi server trò chuyện với database
 
   const user = await User.findOne({ email: req.body.email });
   
   if(user==null){
       res.json("user not found");
   }
   else{
      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if(validPassword===true)
      {
        res.status(200).json(user)
      }
      else{
        res.json("Sai mật khẩu")
      }
   }
   
});

module.exports = router;
