import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String,default:'https://imgs.search.brave.com/gZs5EfBpxEagrOkz7RmTNu5bl-faD6yxjixPk43P2EQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC82Ni8xNC9k/ZWZhdWx0LWF2YXRh/ci1waG90by1wbGFj/ZWhvbGRlci1wcm9m/aWxlLXBpY3R1cmUt/dmVjdG9yLTIxODA2/NjE0LmpwZw'},
    address:{type:Object,default:{line1:' ',line2:' '}},
    dob:{type:String,default:"Not Selected"},
    gender:{type:String,default:"Not Selected"},
    phone:{type:String,default:"00000000000"},
})

const userModel = mongoose.models.user || mongoose.model('user',userSchema);
export default userModel;