const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {  // xác định cuộc trò chuyện giữa 2 người 
      type: String,
    },
    sender: {  // xác định sở hữu tin nhắn => render ra ui 
      type: String,
    },
    text: {  // nội dung tin nhắn
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
