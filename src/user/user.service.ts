import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class UserService{
    constructor(private readonly prisma: PrismaService){}
    async createUser(supabaseUser: any){
        return this.prisma.user.create({
            data: {
            id: supabaseUser.id,
            email: supabaseUser.email,
            firstName: supabaseUser.user_metadata?.full_name?.split(" ")[0] || "",
            lastName: supabaseUser.user_metadata?.full_name?.split(" ")[1] || "",
            phone: supabaseUser.user_metadata?.phone || null,
            password: null, // or set as needed
            // role will default to CUSTOMER
            createdAt: new Date(),
            // updatedAt will be set automatically
            }
        });

    
}
async updateUser(supabaseUser: any){
        return this.prisma.user.update({
            where: { id: supabaseUser.id },
            data: {
                email: supabaseUser.email,
                firstName: supabaseUser.user_metadata?.full_name?.split(" ")[0] || "",
                lastName: supabaseUser.user_metadata?.full_name?.split(" ")[1] || "",
                phone: supabaseUser.user_metadata?.phone || null,
                updatedAt: new Date(),
            }   
        })
    }

    async deleteUser(userId: string){
        return this.prisma.user.delete({
            where: { id: userId }
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}