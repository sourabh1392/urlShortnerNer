const express=require("express")
const mongoose=require("mongoose")
const route=require("./routes/route")
const app=express()

mongoose.set('strictQuery', true);

app.use(express.json())

mongoose.connect("mongodb+srv://project4:project4@cluster0.o19fsjf.mongodb.net/group3Database",{
    useNewUrlParser:true
})
.then( () => {console.log( "MongoDb is connected")}  )
.catch( err => console.log(err))

app.use("/",route)

app.listen(3000,()=>{
    console.log("Express app running on port 3000")
})
