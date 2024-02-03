import { regularExps } from "../../../config";


export class LoginUserDTO {

    private constructor(
        public email: string,
        public password: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, LoginUserDTO?] {

        const { email, password } = object;

        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid email'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password too shower'];

        return [undefined, new LoginUserDTO(email, password)]
    }
}