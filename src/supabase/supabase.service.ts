import {Injectable,Inject} from "@nestjs/common";
import { SUPABASE_CLIENT } from "./supabase.constant";

@Injectable()
export class SupabaseService {
    constructor (
        @Inject(SUPABASE_CLIENT) private readonly supabase: any   ) {}

    getClient() {
        return this.supabase;
    }
}