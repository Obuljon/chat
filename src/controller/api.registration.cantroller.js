import { hash, compare } from "bcrypt";
import usersdb from "../modul/usersdb.js";
class Registration {
    async signup(req, res){
        const {name, email, password} = req.body; 
        const data = {name, email , password:await hash(password, 10) };
        await usersdb.create(data);
        req.flash('success', 'Foydalanuvchi muvaffaqiyatli yaratildi!');
        res.status(200).json({ message: 'Success' });
    }
    async signin(req, res){
        const { email, password } = req.body;
        const user = await usersdb.findOne({email:email});
        const istrue = await compare( password,user.password);
        if(user == null || istrue == false){
            res.status(200).json({error:"error"})
        }else{
            req.session.user = user;
            res.status(200).json({message:true})
        }
    }
    isAuth(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            return res.redirect("/signin");
        }
    }
}

export default new Registration()