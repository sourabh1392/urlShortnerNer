const express=require("express")
const router=express.Router()
const urlController=require("../controller/urlController")


router.post("/url/shorten",urlController.postUrl)
router.get("/:urlCode",urlController.getUrl)

router.all("/*",async (req,res)=>{
    res.status(404).send({Status:false,msg:"Invalid request"})
})

module.exports=router