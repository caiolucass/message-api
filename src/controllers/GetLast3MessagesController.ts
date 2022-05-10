import {Request, Response} from "express";
import { Get3LastMessagesService } from "../services/Get3LastMessagesService";

class GetLast3MessagesController {
    async handle(request: Request, response: Response){
       const service = new Get3LastMessagesService();
       const result = await service.execute();

       return response.json(result);
    }
}

export {GetLast3MessagesController};