import usersdb from "../modul/usersdb.js";

async function notEmp(req, inputName) {
    inputName.forEach(item => 
        req.check(item).notEmpty().withMessage(item[0].toUpperCase() + item.slice(1) + " must not be empty")
    );
}


async function checkLengthPassword(req, inputName) {
    inputName.forEach(item => 
        req.check(item).isLength({min:8}).withMessage(item[0].toUpperCase() + item.slice(1) + " must be min:8 character")
        );
    }
    
    async function checkEmailFormat(req, inputName) {
        inputName.forEach(item => 
            req.check(item).isEmail().withMessage(item[0].toUpperCase() + item.slice(1) + " format is incorrect")
            );
        }
        async function isNum(req, inputName) {
            inputName.forEach(item => 
                req.check(item).isInt().withMessage(item[0].toUpperCase() + item.slice(1) + " must be a number")
            );
        }
        async function isEMail(req, inputName){
                req.check(inputName).custom( async (inputName) => {
                    const user = await usersdb.findOne({ email: inputName });
                    if (user) 
                        throw new Error();
                }).withMessage("E-mail already in use")
        }

async function errorStr(req, res, next) {
    const errors = await req.getValidationResult();

    if (!errors.isEmpty()) {
        const strErrors = errors.array().map(item => item.msg);
        res.status(400).json({ errors: strErrors });
    } else {
        next();
    }
}

class Validation {
   
    async signinValidator(req, res, next){
        await notEmp(req, ["email", "password"])
        await checkEmailFormat(req, ["email"])
        await errorStr(req, res, next);
    }
    async signupValidator(req, res, next){
        await notEmp(req, ["name", "email", "password"])
        await checkEmailFormat(req, ["email"])
        await checkLengthPassword(req, ["password"])
        await isEMail(req, "email");
        await errorStr(req, res, next);
    }

}

export default new Validation();
