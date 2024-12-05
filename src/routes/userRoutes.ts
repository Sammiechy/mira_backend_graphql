import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../entities/User";
import { AppDataSource } from "../data-source";

const userRouter = express.Router();

userRouter.post("/signup", async(req,res)=>{
    try{
        const {firstName,lastName,phone,role, email, password,organizationId } = req.body;
        const userRepository  = AppDataSource.getRepository(User);
        const existingUser: User | null = await userRepository.findOne({ where: { email } });
        
        if(existingUser){
            res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            role,
            status,
            organizationId, // Directly assign the `organization` relation
          });
        
        await userRepository.save(user);
        const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });
        res.status(201).json({ message: "User created", token });

    } catch(error:any){
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

userRouter.post("/signin", async (req :Request,res :any) =>{
    try{
        const { email, password } = req.body;
        const userRepository  = AppDataSource.getRepository(User);
        const user :any = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
          }
          const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });
          res.status(200).json({ message: "Login successful", data: user, token });

    }catch(error:any){
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

export default userRouter;
