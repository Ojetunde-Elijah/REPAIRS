import {Injectable,Inject} from "@nestjs/common";
import { SUPABASE_CLIENT } from "./supabase.module";

@Injectable()
export class SupabaseService {
    constructor (
        @Inject(SUPABASE_CLIENT) private readonly supabase: any   ) {}

    getClient() {
        return this.supabase;
    }
}