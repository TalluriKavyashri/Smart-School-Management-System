import mongoose from "mongoose";
const studentSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        age: {
            type:Number,
            required:true,
        },
        className:{
            type:String,
            required:true,
        },
        rollNo:{
            type:String,
            required:true,
            unique:true,
        },
    },
    {timestamps:true}
);
const Student = mongoose.model("Student",studentSchema);

export default Student;