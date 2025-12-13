const mongoose = require('mongoose');
module.exports.dbConnect = async() => {
    try{
        if(process.env.mode === 'pro'){
            await mongoose.connect(process.env.DB_PRO_URL, {useNewUrlParser: true})
            console.log('Production database connected');
        }else{
            await mongoose.connect(process.env.DB_LOCAL_URL, {useNewUrlParser: true})
        console.log('Local database connected');
        }
        
    }catch(err){    
        console.log(err.message);
    }
}