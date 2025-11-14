import jwt from 'jsonwebtoken';

const authDoctor = async (req,res,next) => {
    try {

        const {doctortoken} = req.headers;

        if(!doctortoken) {
            return res.json({
              success : false,
              message : "Unauthorized Login Detected",  
            })
        }

        const token_decode =  jwt.verify(doctortoken, process.env.JWT_SECRET);


        if (!req.body) {
          req.body = {};
        }

        req.body.docId = token_decode.id;
        
        next();
    } 

    catch (error) {
         console.log(error);
         res.json({
           success: false,
           message: error.message,
         });
    }

}

export default authDoctor;