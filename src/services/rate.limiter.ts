import { Injectable } from "@nestjs/common"
import { Redis } from "ioredis"
import { InjectRedis } from "@nestjs-modules/ioredis"

@Injectable()
export class RateLimiterService{
    private readonly LUA_SCRIPT = `
    local key = KEYS[1]
    local max_tokens = tonumber(ARGV[1])
    local refill_rate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])
    local request_cost = tonumber(ARGV[4])

    local bucket = redis.call("HMGET", key, "tokens", "last_refill")
    local tokens = tonumber(bucket[1])
    local last_refill = tonumber(bucket[2])
    --initialize the bucket if it doesn't exist
    if not tokens then
    tokens = max_tokens - request_cost
    redis.call("HMSET", key, "tokens", tokens, "last_refill", now)
    redis.call("EXPIRE", key, math.ceil(max_tokens / refill_rate))
    return 1
    end
    --Calculate refill
    local time_passed = now - last_refill
    local new_tokens = time_passed * refill_rate
    tokens = math.min(tokens + new_tokens, max_tokens)
    --Check if there are enough tokens
    if tokens >= request_cost then
    tokens = tokens - request_cost
    redis.call("HMSET", key, "tokens", tokens, "last_refill", now)
    return 1
    else
    return 0
    end
    `
    constructor(@InjectRedis() private readonly redis: Redis){}
    async consume(
        key: string,
        maxTokens: number,
        refillRate:number,
        requestCost = 1
    ):Promise<boolean>{
        const now = Math.floor(Date.now() /1000)
        try {
            const allowed = await this.redis.eval(this.LUA_SCRIPT,1,key,maxTokens,refillRate,now,requestCost)
            return allowed === 1
        } catch (error) {
            console.error("Rate-limitter error:",error)
            return true
        }
    }
}