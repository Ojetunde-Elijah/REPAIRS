import {Injectable,Inject} from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
    constructor (
        @Inject("SUPABASE_CLIENT") private readonly supabase: SupabaseClient
    ) {}

    getClient() {
        return this.supabase;
    }
}