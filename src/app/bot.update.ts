import { AppService } from "./app.service";
import { InjectBot, Start, Update, Action, Hears, On, Message, Ctx, Command } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { actionButtons, statusButton } from "./bot.buttons";
import { Context, } from 'telegraf';
import { UserService } from "src/user/user.service";
import { ConnectionsService } from "src/connections/connections.service";
import { MonitoringService } from "src/monitoring/monitoring.service";
import axios from "axios";
import { webApp } from "telegraf/typings/button";
import { similarity } from "src/common/voice-similarity";

@Update()
export class BotUpdate {

	constructor(@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly appService: AppService,
		private readonly usersService: UserService,
		private readonly connectionsService: ConnectionsService,
		private readonly monitoringService: MonitoringService,

	) { }

	@Start()
	async startCommand(ctx: Context) {
		// await ctx.reply('Вас приветствует наш сервис!', actionButtons());
		// await ctx.reply('Шо делаем?', mainButton());
		const telegram_id = String(ctx.from.id);
		const telegram_chat_id = String(ctx.chat.id);

		const user = await this.usersService.create({ telegram_id, telegram_chat_id });

		ctx.reply('Вас приветствует наш сервис!');
		const userConnections = await this.usersService.findAllUserConnections(user.id);

		if (userConnections.length > 0) {
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
	async getAllHears(ctx: Context) {
		const credString = await this.monitoringService.getPostgreCredsByTgId(1111);
		const { host, port, username, password } = this.monitoringService.splitCreds(credString);

		let partMetricsReport = await this.monitoringService.getDatabasesReport(host, port, username, password);

		await ctx.reply(JSON.stringify(partMetricsReport));

	}

	@Hears('Создать подключение')
	async createNewConnection(ctx: Context) {

	}


	@On('text')
	async getMessages(@Message('text') message: string, @Ctx() ctx: Context) {
		await ctx.reply("Привет! Чтобы посмотреть статус базы данных, переходи по кнопке", statusButton())
	}

	// @On('file')
	// async getFiles(@Message('file') message: string, @Ctx() ctx: Context){

	// }

	
	@On('voice')
	async getVoice(@Message('voice') message: any, @Ctx() ctx: Context) {
		try {
			const voice = message;
			const fileId = voice.file_id;	
			const fileDetails  = await ctx.telegram.getFile(fileId);
			const fileLink  = await ctx.telegram.getFileLink(fileId);
		
			let blob = await fetch(fileLink.toString()).then(r => r.blob());
			var formData = new FormData();
      formData.append('file', blob);

      const response = await axios.post('http://localhost:8000/speech-to-text/', formData, {
				headers:{
				'Content-Type': 'multipart/form-data'
				}
      });

			const command = this.commands.find(x=>similarity(x, response.data.text) >= 0.90);

		switch (command){
		 	case "Создать подключение": 
			  ctx.reply("подключение");
			break;
			case "Показать статус": 
			 	ctx.reply("статус");
			break;
		}

      return response.data.text;
			
		} catch (error) {
			console.error('Error processing voice message:', error);
			ctx.reply('Sorry, I could not process your voice message.');
		}
	}

	commands = [
		"Создать подключение",
		"Показать статус"
	]




	


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
	
