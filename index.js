const express = require('express');
const app = express();
const {Web3} = require("web3");
const ABI = require("./ABI.json");
app.use(express.json())
const web3 = new Web3("HTTP://127.0.0.1:7545")
const contractAddress = "0x9036181112dFeaBA2bA1aB481f8D9FAc73c50673"; 

const contract = new web3.eth.Contract(ABI,contractAddress);



//gender verification


const genderVerify = (gender)=>{
    const genderData = gender.toLowerCase();
    if(genderData==="male" || genderData==="female" || genderData==="others"){
        return true;
    }else{
        return false;
    }
}
const partyClash=async(party)=>{
    const candidateInfo = await contract.methods.candidateList().call();
    const exists = candidateInfo.some((candidate)=>candidate.party===party);
    return exists;
}
app.post("/api/voter-verification",(req,res)=>{
    const {gender} = req.body; 
    const status = genderVerify(gender)
    if(status){
        res.status(200).json({message:"Registration Successful"})
    }else{
        res.status(404).json({message:"Gender Invalid"})
    }
})

//Time verification
app.post("/api/time-bound",(req,res)=>{
    const {startTime,endTime} = req.body;
    if(endTime-startTime < 86400 ){
        res.status(200).json({message:"Voting time Started"})
    }else{
        res.status(404).json({message:"Voting time is greater than 24hrs"})
    }
})

//Candidate verification

app.post("/api/candidate-verfy",async(req,res)=>{
    const {party,gender} = req.body;
    const partystatus = await partyClash(party);
    const genderStatus = genderVerify(gender);

    if(genderStatus && partystatus!==true){
        res.status(200).json({message:"Registration successful"})
    }else{
        res.status(404).json({message:"Either party or Gender is not valid"})
    }
    
    
})
app.listen(3000,()=>{
    console.log("Server 3000 is running")
})