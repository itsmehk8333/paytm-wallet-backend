import express from 'express';
import checkToken from '../auth/Auth.check.js';
import accountSchema from '../schemas/accout.schema.js';
import zod from 'zod';
import mongoose from 'mongoose';



export const balanceRouter = express.Router();


balanceRouter.post("/balance", checkToken, async (req, res) => {

    try {
         console.log(req.body)

        const zodCheck = zod.object({
            username: zod.string().email()
        }).safeParse(req.body)

        if (zodCheck.success == false) {
            return res.status(403).json({
                "message": "check the payload!"
            })
        }
        const balanace = await accountSchema.findOne({ username: req.body.username });

        if (balanace != null) {
            return res.json({
                "balance": balanace.balance
            })
        }
        else {
            return res.json({
                "message": "use not exist!!"
            })
        }
    } catch (error) {

        console.log(error)

        res.json({
            "message": "somthing went wrong!"
        })
    }
})

balanceRouter.post("/transfor", checkToken, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { amount, to } = req.body;

        console.log(amount, "amount")

        const account = await accountSchema.findOne({ username: req.username }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                "message": "Insufficient balance"
            })
        }

        const toAccount = await accountSchema.findOne({ username: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();

            return res.status(400).json({
                "message": "Invalid account."
            })
        }

        await accountSchema.updateOne({ username: req.username }, { $inc: { balance: -amount } });
        await accountSchema.updateOne({ username: to }, { $inc: { balance: amount } });

        await session.commitTransaction();

        res.json({
            "message": "Transfer successful"
        })


    } catch (error) {
        //  console.log(error)
        await session.abortTransaction();
        res.json({
            "message": "something went wrong!"
        })
    }
})
