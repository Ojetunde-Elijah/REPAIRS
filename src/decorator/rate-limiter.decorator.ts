import {SetMetadata} from "@nestjs/common"

export const RateLimit = (maxTokens: number, refillRate: number)=> SetMetadata("rateLimitConfig", {maxTokens,refillRate});