import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserRepository } from "../user.repository";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'jshdfkjsk%$',
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        const user = await this.userRepository.findOne({ id });

        if (!user) {
            throw new UnauthorizedException('Not Authorized');
        }

        return user;
    }
}  