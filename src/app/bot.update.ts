import { AppService } from "./app.service";
import { InjectBot, Start, Update, Action, Hears, On, Message, Ctx, Command } from "nestjs-telegraf";
import { Telegraf  } from "telegraf";
import { actionButtons, statusButton } from "./bot.buttons";
import { Context, } from 'telegraf';
import { UserService } from "src/user/user.service";
import { ConnectionsService } from "src/connections/connections.service";
import { MonitoringService } from "src/monitoring/monitoring.service";

@Update()
export class BotUpdate{
    constructor(@InjectBot() private readonly bot: Telegraf<Context>, 
        private readonly appService: AppService,
        private readonly usersService: UserService,
        private readonly connectionsService: ConnectionsService,
        private readonly monitoringService: MonitoringService,
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
            await ctx.reply('Мои подключения', statusButton())
        }
        else {
            await ctx.reply('У Вас нет подключений, создайте  новое', actionButtons());
        }
    }

    @Action('createConn')
    async getAll(@Ctx() ctx: Context){
        await ctx.reply('У вас ещё нет подключений. Введите логин для создания подключения.');
        // ctx.scene.enter('createConnectionScene');
    }

    @Action('status')
    async getStatus(@Ctx() ctx: Context){
      
        // ctx.scene.enter('createConnectionScene');
    }

    @Hears('Показать статус')
    async getAllHears(ctx: Context){
        const credString = await this.monitoringService.getPostgreCredsByTgId(1111);
        const splitCreds = credString.split(';');
    
        let fullMetricsReport = await this.monitoringService.getFullMetricsReport(splitCreds[0], splitCreds[1], splitCreds[2], splitCreds[3]);
    
        fullMetricsReport = fullMetricsReport['databases'].map(u => ({state: "active", ...u}));
    
        await ctx.reply(fullMetricsReport as string);
     
    }


    @On('text')
    async getMessages(@Message('text') message: string, @Ctx() ctx: Context){
        
        const connectionString = message;
        const telegram_id = String(ctx.from.id);
        const user = await this.usersService.findOne(telegram_id);

        const conn = await this.connectionsService.create({user_id: user.id, connectionString});
        if(conn){
            await ctx.reply('Подключение создано!');
        }
    }

    
}
