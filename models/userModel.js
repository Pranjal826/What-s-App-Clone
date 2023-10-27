const mongoose=require('mongoose')
// Create schema
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type: String,
        required: true, 
        minlength: 6,  
        validate: {
            validator: function (password) {
                return /[A-Z]/.test(password);
            },
            message: 'Password must contain at least one uppercase letter'
        }
    },
    dp:String,
    phone:{
        type:Number,
        unique:true
    },
    })
// Create model
const User=mongoose.model('User',userSchema)
// Export model
module.exports=User
