import {Controller,Post,Body,Headers,UseInterceptors} from "@nestjs/common"
import { SupabaseService } from "../supabase/supabase.service";
import { WebhookInterceptor } from "./webhook.interceptor";

@Controller("auth")
export class AuthController {
    constructor(private readonly supabase: SupabaseService){}
    @Post("webhook")
    @UseInterceptors(WebhookInterceptor)
    async handleAuthWebhook(@Body() body: any){
        const {type, user} = body;

        switch(type){
            case "user.created":
                await this.handleUserCreated(user);
                break;
            case "user.updated":
                await this.handleUserUpdated(user);
                break;
            case "user.deleted":
                await this.handleUserDeleted(user);
                break;
        }
        
    }   
    private async handleUserCreated(user: any){
            console.log("New user created:", user)
        }
    private async handleUserUpdated(user: any){
        console.log("User updated:", user)
    }
    private async handleUserDeleted(user: any){
        console.log("User Deleted:", user)
    }
}