const mongoose = require('mongoose')

const storySchema = mongoose.Schema({
  picture:String,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  caption:String,
  Date:{
    type:Date,
    default: Date.now
  },
  likes:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
  ]
})
 
module.exports = mongoose.model('story', storySchema)