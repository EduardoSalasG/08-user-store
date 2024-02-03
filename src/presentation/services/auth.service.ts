import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDTO, RegisterUserDTO, UserEntity } from "../../domain";

export class AuthService {

    //DI
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDTO) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            user.save();

            // JWT <--- para mantener la autenticación del usuario

            //email de confirmación

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: 'ABC'
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    public async loginUser(loginUserDto: LoginUserDTO) {
        //find.one para verificar si existe
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Email does not exist');


        //isMatch... bcrypt compare(123456, hash)
        const passwordMatch = bcryptAdapter.compare(loginUserDto.password, user.password)
        if (!passwordMatch) throw CustomError.badRequest('Password does not match');

        const { password, ...userEntity } = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({ id: user.id });
        if (!token) throw CustomError.internalServer('Error while creating JWT');


        return {
            user: userEntity,
            token
        }
    }


}