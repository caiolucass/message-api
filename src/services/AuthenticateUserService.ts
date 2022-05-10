import axios from "axios";
import prismaClient from "../prisma";
import {sign} from "jsonwebtoken";


interface IAccessTokenResponse {
    access_token: string
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string){
        const url = "https://github.com/login/oauth/access_token";

        /**
         * Recuperar o accessToken
         * do usuario logado na aplicacao
         */
        const {data: accessTokenResponse} = await axios.post<IAccessTokenResponse>(url, null, {
            params:{
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers:{
                "Accept": "application/json",
            }
        });

        /**
         * Recuperar todas as informacoes
         * do usuario logado na aplicacao
         */
        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers:{
                authorization: `Bearer ${accessTokenResponse.access_token}`,
            }
        });
        
        /**
         * Consultar se o usuario do banco
         * e igual ao do github
         */
        const {login, id, avatar_url, name} = response.data
        let user = await prismaClient.user.findFirst({
            where:{
                github_id: id
            }
        });

        /**
         * se nao existir o usuario
         * entao sera criado um novo usuario
         */
        if(!user){
            await prismaClient.user.create({
              data: {
                  github_id: id,
                  login,
                  avatar_url,
                  name,
              }
            });
        }

        /**
         * Criar token de acesso
         */
        const token = sign(
            {
               user:{
                name: user.name,
                avatar_url: user.avatar_url,
                id: user.id
            }
        },
        process.env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: "1d"
        }
    );
        return {token, user};
    }
}

export { AuthenticateUserService };