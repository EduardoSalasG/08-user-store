import { regularExps } from "../../../config";


export class RegisterUserDTO {

    private constructor(
        public name: string,
        public email: string,
        public password: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterUserDTO?] {

        const { name, email, password } = object;

        if (!name) return ['Missing name'];
        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid email'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password too shower'];

        return [undefined, new RegisterUserDTO(name, email, password)]
    }
}