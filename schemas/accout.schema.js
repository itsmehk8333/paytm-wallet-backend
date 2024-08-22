import mongoose, { Schema } from "mongoose";



const schema = new Schema({
    username:{
        type:String,
        "ref":"users",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

 const accountSchema = mongoose.model("account", schema)

 export default accountSchema;