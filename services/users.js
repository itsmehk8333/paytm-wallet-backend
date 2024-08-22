import express from 'express';
import mongoose from "mongoose";
import checkToken from '../auth/Auth.check.js';
import { usersSchema } from '../schemas/users.schema.js';
import zod from 'zod';


export const appUsersRoute = express.Router();


appUsersRoute.get("/get-users/bulk", checkToken, async (req, res) => {
    try {

        const data = await usersSchema.find().select("-_id").select("-password -_id")

        if (data.length > 0) {
            return res.json({
                "success": "true",
                data: data
            })
        } else {
            return res.json({
                "success": "true",
                "message": "users not existed!",
                data: data
            })
        }

    } catch (error) {
        res.json({
            "success": false,
            "message": "something went wrong while login!"
        })
    }
})


appUsersRoute.get("/get-user", checkToken, async (req, res) => {
    try {

        const zodCheck = zod.object({
            username: zod.string().email()
        }).safeParse(req.body);
         
        

        if (zodCheck.success == false) {
            return res.json({ "message": "check the payload." })
        }

        const data = await usersSchema.find({
            username: req.body.username
        })

        if (data != null) {
            return res.json({
                "success": true,
                data: data
            })
        }
        else {
            return res.json({ "message": "user not found!" })
        }


    } catch (error) {
        res.json({
            "message": "something went wrong!!"
        })
    }
})