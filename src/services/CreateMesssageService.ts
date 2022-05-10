import { io } from "../app";
import prismaClient from "../prisma";

class CreateMessageService {
    async execute(text: string, user_id: string){
       const message = await prismaClient.message.create({
         data: {
             text,
             user_id
         },
          include:{
                 user: true
          }
       });

       /**
        * Web socket para capturar as mensagens em tempo real
        */
       const infoWS = {
        text: message.text,
        user_id : message.id,
        created_at: message.created_at,
        user: {
            name: message.user.name,
            avatar_url: message.user.avatar_url,
        }
    }
    io.emit("new_message", infoWS);
    
       return message;
    }
}

export { CreateMessageService};