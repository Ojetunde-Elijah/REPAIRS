import { INestApplication } from "@nestjs/common";
import {OpenAPIObject} from "@nestjs/swagger";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SWAGGER_CONFIG } from "./swagger.default";

export function createDocument(app: INestApplication):OpenAPIObject{
    const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    for(const tag of SWAGGER_CONFIG.tags){
        builder.addTag(tag)
    }
    const options = builder.build()

    return SwaggerModule.createDocument(app, options)
}