import express from 'express';
import { usersSchema } from '../schemas/users.schema.js';
import { singInBody, singUpBody } from '../middlewares/user.zod.js';
import jwt from "jsonwebtoken";
import balanceSchema from '../schemas/accout.schema.js';


export const userRoute = express.Router();


userRoute.post("/register", async (req, res) => {
    try {

        //  console.log("hittinfg....")
        //   console.log(req.body)
        singUpBody.safeParse(req.body)

        const { firstname, lastname, username, password } = req.body;


        const data = new usersSchema({
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password
        })


        await data.save();

        var intiateBalance = new balanceSchema({
            balance: parseInt(1 + Math.random() * 100),
            username: username
        })

        await intiateBalance.save()
        res.json({
            "success":true,
            "message": "User created successfully"
        })
    } catch (error) {
        console.log(error)
        res.send({
            "message": "something went wrong!"
        })
    }
})


userRoute.post("/login", async (req, res) => {
    try {

        const zodvalidation = singInBody.safeParse(req.body);
        console.log(zodvalidation)
        const { username, password } = req.body;

        try {

            const data = await usersSchema.findOne({ username: username, password: password });

            if (data) {

                const token = jwt.sign({
                    username: username,

                }, process.env.SECRECT_KEY)
                res.json({
                    "success": true,
                    "token": token,
                    "details":{
                        firstname:data.firstname,
                        lastname:data.lastname,
                        username:data.username
                    }
                })
            }
        } catch (error) {
            res.json({
                "success": false,
                "message": "something went wrong while login!"
            })
        }


    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message": "something went wrong while login!"
        })

    }
})