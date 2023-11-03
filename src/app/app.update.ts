import { AppService } from "./app.service";
import { Controller } from "@nestjs/common";
import { InjectBot, Start, Update } from "nestjs-telegraf";
import { Context, Telegraf  } from "telegraf";

@Update()
export class AppUpdate{
    constructor(@InjectBot() private readonly bot: Telegraf<Context>, private readonly appService: AppService){}

    @Start()
    async startCommand(ctx: Context){
        await ctx.reply('Приветики!');
        return this.appService.getHello();
    }
}