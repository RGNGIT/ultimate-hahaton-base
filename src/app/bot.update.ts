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
        const telegram_chat_id = String(ctx.chat.id);

        const user = await this.usersService.create({telegram_id, telegram_chat_id});
        
        ctx.reply('Вас приветствует наш сервис!');
        const userConnections = await this.usersService.findAllUserConnections(user.id);

        if(userConnections.length > 0){
            await ctx.reply('Мои подключения', statusButton())
        }
        else {
            await ctx.reply('У Вас нет подключений, создайте новое', actionButtons());
        }
    }

    // @Action('createConn')
    // async getAll(@Ctx() ctx: Context){
    //     await ctx.reply('У вас ещё нет подключений. Введите логин для создания подключения.');

    // }

    // @Action('status')
    // async getStatus(@Ctx() ctx: Context){
      
       
    // }

    @Hears('Показать статус')
    async getAllHears(ctx: Context){
        const credString = await this.monitoringService.getPostgreCredsByTgId(1111);
        const {host, port, username, password} = this.monitoringService.splitCreds(credString);
    
        let partMetricsReport = await this.monitoringService.getDatabasesReport(host, port, username, password);
    
        await ctx.reply(JSON.stringify(partMetricsReport));
     
    }


    @On('text')
    async getMessages(@Message('text') message: string, @Ctx() ctx: Context){
        await ctx.reply("Привет! Чтобы посмотреть статус базы данных, переходи по кнопке", statusButton())
    }


    // @Command('reload'){

    // }

//    @Command('upload_key')
//    async executeUploadKey(ctx: Context) {
//         ctx.reply('Пожалуйста, отправьте ваш приватный ключ в ответном сообщении.');
//       }
      
//       @On('text')
//       async getDocument(@Message('document') message: string, ctx: Context) {
//         // Проверить, ожидаем ли мы получение файла
//         if (ctx.message.reply_to_message && ctx.message.reply_to_message.text.includes('отправьте ваш приватный ключ')) {
//           // Получение файла
//           const fileId = ctx.message.document.file_id;
//           const fileLink = await ctx.telegram.getFileLink(fileId);
          
//           // Здесь можно скачать файл и сохранить его локально или обработать как нужно
//           ctx.reply('Файл ключа получен. Производим настройку подключения...');
//         }
//       };
    
}
