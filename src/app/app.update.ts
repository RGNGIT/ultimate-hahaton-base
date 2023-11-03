import { AppService } from "./app.service";
import { InjectBot, Start, Update, Action, Hears, On, Message } from "nestjs-telegraf";
import { Telegraf  } from "telegraf";
import { actionButtons } from "./app.buttons";
import { Context } from "./context.interface";

@Update()
export class AppUpdate{
    constructor(@InjectBot() private readonly bot: Telegraf<Context>, private readonly appService: AppService){}

    @Start()
    async startCommand(ctx: Context){
        await ctx.reply('Приветики!');
        await ctx.reply('Шо делаем?', actionButtons());
    }

    @Action('list')
    async getAll(ctx: Context){
        await ctx.reply('list');
    }

    @Hears('Прослушка')
    async getAllHears(ctx: Context){
        await ctx.reply('edit');
    }

    @On('text')
    async text(@Message('text') idTask: string, ctx: Context){
        if(!ctx.session.type) return;
        // await ctx.reply('Это текст');
    }
}