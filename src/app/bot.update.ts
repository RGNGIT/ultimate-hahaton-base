import { AppService } from "./app.service";
import { InjectBot, Start, Update, Action, Hears, On, Message, Ctx, Command } from "nestjs-telegraf";
import { Telegraf  } from "telegraf";
import { actionButtons, mainButton } from "./bot.buttons";
import { Context, Scenes } from 'telegraf';
import { UserService } from "src/user/user.service";
import { ConnectionsService } from "src/connections/connections.service";

@Update()
export class BotUpdate{
    constructor(@InjectBot() private readonly bot: Telegraf<Context>, 
        private readonly appService: AppService,
        private readonly usersService: UserService,
        private readonly connectionsService: ConnectionsService,
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
    async getAll(@Ctx() ctx: Scenes.SceneContext){
        await ctx.reply('У вас ещё нет подключений. Введите логин для создания подключения.');
        // ctx.scene.enter('createConnectionScene');
    }

    @Hears('Прослушка')
    async getAllHears(ctx: Context){
        await ctx.reply('edit');
    }

    // @On('text')
    // async onText(@Message('text') text: string, @Ctx() ctx: Scenes.SceneContext) {
    //   if (ctx.scene.current?.id === 'createConnectionScene') {
    //     const telegram_id = String(ctx.from.id);
    //     const user = await this.usersService.findOne(telegram_id);
    //     const connectionString = text;
    //     await this.connectionsService.create({user_id: user.id, connectionString});
    //     await ctx.reply('Подключение создано!');
    //     ctx.scene.leave();
    //   }
    // }


    
}
