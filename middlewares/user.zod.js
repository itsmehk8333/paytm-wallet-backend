import zod from "zod";


export const singUpBody = zod.object({
    username:zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string()
})

export const singInBody = zod.object({
    username:zod.string().email(),
    password:zod.string()
})