import { AppService } from "./app.service";
import { InjectBot, Start, Update, Action, Hears, On, Message } from "nestjs-telegraf";
import { Telegraf  } from "telegraf";
import { actionButtons, mainButton } from "./bot.buttons";
import { Context } from "./context.interface";
import { UserService } from "src/user/user.service";
import { ConnectionsService } from "src/connections/connections.service";

@Update()
export class BotUpdate{
    constructor(@InjectBot() private readonly bot: Telegraf<Context>, 
        private readonly appService: AppService,
        private readonly usersService: UserService,
    ){}

    @Start()
    async startCommand(ctx: Context){
        // await ctx.reply('Вас приветствует наш сервис!', actionButtons());
        // await ctx.reply('Шо делаем?', mainButton());
        const telegram_id = String(ctx.from.id);
        const user = await this.usersService.create({telegram_id});
        ctx.reply('Вас приветствует наш сервис!');
        const userConnections = await this.usersService.findAllUserConnections(user.id);

        if(userConnections.length > 0){
            await ctx.reply('Мои подключения')
        }
        else {
            await ctx.reply('У Вас нет подключений, создайте  новое', actionButtons());
        }
    }

    @Action('createConn')
    async getAll(ctx: Context){

        //const newConn = await this.connectionService.create()
        await ctx.reply('createConn');
    }

    @Hears('Прослушка')
    async getAllHears(ctx: Context){
        await ctx.reply('edit');
    }

    @On('text')
    async text(@Message('text') text: string, ctx: Context){
        await ctx.reply(text);
        // await ctx.reply('Это текст');
    }
}