const urlModel=require("../models/urlModel")

const postUrl=async (req,res)=>{
    try{


    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}



const getUrl=async (req,res)=>{
    try{


    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports={postUrl,getUrl}