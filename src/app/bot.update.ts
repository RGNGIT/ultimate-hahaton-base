import { AppService } from "./app.service";
import { InjectBot, Start, Update, Action, Hears, On, Message, Ctx, Command } from "nestjs-telegraf";
import { Context, Scenes, Telegraf } from "telegraf";
import { actionButtons, myConnectsButton, statusButton } from "./bot.buttons";
import { UserService } from "src/user/user.service";
import { ConnectionsService } from "src/connections/connections.service";
import { MonitoringService } from "src/monitoring/monitoring.service";
import axios from "axios";
import { similarity } from "src/common/voice-similarity";
import { BotService } from "./bot.service";
import { Logger } from "@nestjs/common";

@Update()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  constructor(@InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
    private readonly usersService: UserService,
    private readonly connectionsService: ConnectionsService,
    private readonly monitoringService: MonitoringService,
    private readonly botService: BotService,

  ) { }

  @Start()
  async startCommand(ctx: Context) {
    // await ctx.reply('Вас приветствует наш сервис!', actionButtons());
    // await ctx.reply('Шо делаем?', mainButton());
    const telegram_id = String(ctx.from.id);
    const telegram_chat_id = String(ctx.chat.id);

    const user = await this.usersService.create({ telegram_id, telegram_chat_id });

    ctx.reply('Вас приветствует наш сервис!', statusButton());
    const userConnections = await this.usersService.findAllUserConnections(telegram_id);

    if (userConnections.length > 0) {

      await ctx.reply('Мои подключения:', myConnectsButton(userConnections))
    }
    else {
      await ctx.reply('У Вас нет подключений, создайте новое', actionButtons());
    }
  }

  @Command('connect')
  async connect(ctx: Scenes.SceneContext) {
    this.logger.debug('Trying to enter the connectionWizard scene');
    await ctx.scene.enter('connectionWizard');
  }

  @Hears('Мои подключения')
  async myConnections(ctx: Context) {

    const conns = await this.usersService.findAllUserConnections(String(ctx.from.id));
    console.log(conns);
    if (conns.length > 0) {

      await ctx.reply('Мои подключения:', myConnectsButton(conns))
    }
    else {
      await ctx.reply('У Вас нет подключений, создайте новое', actionButtons());
    }
  }

  @Hears('Создать подключение')
  async createNewConnection(ctx: Scenes.SceneContext) {
    this.logger.debug('Trying to enter the connectionWizard scene');
    await ctx.scene.enter('connectionWizard');
  }


  @Hears('Показать статус')
  async getAllHears(ctx: Context) {
    const credString = await this.monitoringService.getPostgreCredsByTgId(1111);
    const { host, port, username, password } = this.monitoringService.splitCreds(credString);

    let partMetricsReport = await this.monitoringService.getDatabasesReport(host, port, username, password);

    await ctx.reply(JSON.stringify(partMetricsReport));

  }



  // @On('text')
  // async getMessages(@Message('text') message: string, @Ctx() ctx: Context) {

  //   await ctx.reply("Привет! Чтобы посмотреть статус базы данных, переходи по кнопке", statusButton())
  // }

  @Action('upload_doc')
  async executeUploadKey(ctx: Scenes.SceneContext) {
    // ctx.reply('Пожалуйста, отправьте вашу строку подключения в ответном сообщении в виде: host;port;username;password');
    this.logger.debug('Trying to enter the connection scene');
    await ctx.scene.enter('my_scene');
  }



  @On('text')
  async getText(@Message() message: any, @Ctx() ctx: Context) {
    if (message.reply_to_message && message.reply_to_message.text.includes('отправьте вашу строку подключения')) {
      const result = this.botService.parseConnectionString(message.text, ctx.from.id.toString());
      if (result) ctx.reply("Подключение добавлено!");
      else ctx.reply("Произошла ошибка!");
    }
  }

  @On('document')
  async getFiles(@Message() message: any, @Ctx() ctx: Context) {


    if (message.reply_to_message && message.reply_to_message.text.includes('отправьте вашу строку подключения')) {

      const fileId = message.document.file_id;
      const fileLink = await ctx.telegram.getFileLink(fileId);
      const response = await axios({
        method: 'GET',
        url: fileLink.toString(),
        responseType: 'stream'
      });

      const reader = response.data;
      let data = '';
      reader.on('data', (chunk) => {
        data += chunk.toString(); // преобразование Buffer в строку
      });

      reader.on('end', () => {
        console.log(data); // Текст файла доступен здесь после окончания чтения
        ctx.reply('Файл получен. Производим настройку подключения...');
        // Тут вы можете использовать данные как вам нужно
        this.botService.parseConnectionString(data, ctx.from.id.toString());

        ctx.reply("Подключение добавлено!");
      });

      reader.on('error', (err) => {
        console.error('Ошибка при загрузке файла: ', err);
        ctx.reply('Произошла ошибка при загрузке файла.');
      });

      // console.log(data)
      // ctx.reply('Файл получен. Производим настройку подключения...');

    }
  }


  @On('voice')
  async getVoice(@Message('voice') message: any, @Ctx() ctx: Context) {
    try {
      const voice = message;
      const fileId = voice.file_id;
      // const fileDetails = await ctx.telegram.getFile(fileId);
      const fileLink = await ctx.telegram.getFileLink(fileId);

      let blob = await fetch(fileLink.toString()).then(r => r.blob());
      var formData = new FormData();
      formData.append('file', blob);

      const response = await axios.post('http://localhost:8000/speech-to-text/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const command = this.commands.find(x => similarity(x, response.data.text) >= 0.90);

      switch (command) {
        case "Создать подключение":
        case "Подключение":
        case "Подключись":
        case "Подключи базу":
          ctx.reply('Пожалуйста, отправьте вашу строку подключения в ответном сообщении в виде: host;port;username;password');
          break;
        case "Показать статус":
        case "Покажи статус":
        case "Статус":
          ctx.reply('Функция в разработке');
          // console.log(ctx.from.id)
          //   const credString = await this.monitoringService.getPostgreCredsByTgId(ctx.from.id.toString());
          //   console.log(credString)
          //   const { host, port, username, password } = this.monitoringService.splitCreds(credString);

          //   let partMetricsReport = await this.monitoringService.getDatabasesReport(host, port, username, password);

          //   await ctx.reply(JSON.stringify(partMetricsReport));

          break;

        case "Мои подключения":
        case "Покажи мои подключения":

          const conns = await this.usersService.findAllUserConnections(String(ctx.from.id));
          console.log(conns);
          if (conns.length > 0) {

            await ctx.reply('Мои подключения:', myConnectsButton(conns))
          }
          else {
            await ctx.reply('У Вас нет подключений, создайте новое', actionButtons());
          }
          break;
        default:
          ctx.reply(`Кажется, Вы сказали: \"${response.data.text}\"`);
      }



    } catch (error) {
      console.error('Error processing voice message:', error);
      ctx.reply('Sorry, I could not process your voice message.');
    }
  }


  

  commands = [
    "Создать подключение",
    "Подключение",
    "Подключись",
    "Подключи базу",

    "Показать статус",
    "Покажи статус",
    "Статус",
    "Мои подключения",
    "Покажи мои подключения"

  ]







  // // @Command('reload'){

  // // }


}

