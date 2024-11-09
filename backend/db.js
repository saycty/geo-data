import mongoose from "mongoose";
const DB = async(mongoURL)=>{
    if(!mongoURL){
        console.log("database is not matched please check database");
    }
    await mongoose.connect(mongoURL);
    console.log('connected to mongo')

}
export default DB;