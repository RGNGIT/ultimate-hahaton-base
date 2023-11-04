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
    const telegram_id = String(ctx.from.id);
    const telegram_chat_id = String(ctx.chat.id);

    const user = await this.usersService.create({ telegram_id, telegram_chat_id });

    ctx.reply(`Привет, ${ctx.from.username}!`, statusButton());
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

  @Command('voicehelp')
  @Command('голос')
  @Hears('💬 Список голосовых команд')
  async sendVoiceHelp(@Ctx() ctx: Context) {
    let helpText = `*Доступные голосовые команды:*\n\n`;
    helpText += this.voicecommands.map((command) => `- *${command.command}* - ${command.description}`).join(`\n`);
    await ctx.replyWithMarkdown(helpText);
  }

  @Command('помощь')
  @Command('help')
  @Hears('😱 Помощь')
  async sendHelp(@Ctx() ctx: Context) {
    let helpText = `*Доступные команды:*\n\n`;
    helpText += this.commands.map((command) => `*/${command.command}* - ${command.description}`).join(`\n`);
    await ctx.replyWithMarkdown(helpText);

  }

  @Command('about')
  async aboutUs(@Ctx() ctx: Context) {
    await ctx.reply(
      'Бот разработан командой \"34. Сборная Оренбургской области №1\".\n' +
      'Над проектом работали: Exem, RGN, SunDust, Airi и Dane4ka \n ' +
      'Они же СТАС ⭐️ - \"ай, как сложно\"'
    );
    await ctx.replyWithMarkdown(
      'Если у вас возникли вопросы, вы можете связаться с разработчиками:\n'
    );
    await ctx.replyWithContact("+79058188101", "Юлия");
    await ctx.replyWithMarkdown(
      'или посетите [GitHub проекта - Бот](https://github.com/RGNGIT/ultimate-hahaton-base)\n'
    );
    await ctx.replyWithMarkdown(
      '[GitHub проекта - WebApp](https://github.com/exem1337/stas-monitor-bot)\n'
    );
  }


  @Hears('📝 Мои подключения')
  async myConnections(ctx: Context) {
    const conns = await this.usersService.findAllUserConnections(String(ctx.from.id));
    if (conns.length > 0) {
      await ctx.reply('Мои подключения:', myConnectsButton(conns))
    }
    else {
      await ctx.reply('У Вас нет подключений, создайте новое', actionButtons());
    }
  }

  @Hears('➕ Создать подключение')
  async createNewConnection(ctx: Scenes.SceneContext) {
    this.logger.debug('Trying to enter the connectionWizard scene');
    await ctx.scene.enter('connectionWizard');
  }


  // @Hears('📈 Показать статус')
  // async getAllHears(ctx: Context) {
  //   const credString = await this.monitoringService.getPostgreCredsByTgId(1111);
  //   const { host, port, username, password } = this.monitoringService.splitCreds(credString);

  //   let partMetricsReport = await this.monitoringService.getDatabasesReport(host, port, username, password);

  //   await ctx.reply(JSON.stringify(partMetricsReport));

  // }

  @Action(/command_(.+)/)
  async onConnectionSelectAction(@Ctx() ctx) {
    console.log(ctx.match[1])
    const connectionId = ctx.match[1];

    const conn = await this.connectionsService.getOne(+connectionId);
    // // Логика обработки выбора подключения

    await ctx.scene.enter('command_sql_scene', { connection: conn });
  }

  @Hears('▶️ Выполнить команду на сервере')
  @Action('SSH_command')
  async executeSSH(ctx: Scenes.SceneContext) {
    this.logger.debug('Trying to enter the command_ssh_scene scene');
    await ctx.scene.enter('command_ssh_scene');
  }


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
        // Текст файла доступен здесь после окончания чтения
        ctx.reply('Файл получен. Производим настройку подключения...');
        // Тут вы можете использовать данные как вам нужно
        this.botService.parseConnectionString(data, ctx.from.id.toString());

        ctx.reply("Подключение добавлено!");
      });

      reader.on('error', (err) => {
        console.error('Ошибка при загрузке файла: ', err);
        ctx.reply('Произошла ошибка при загрузке файла.');
      });

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

      this.logger.debug('Trying to get speech-to-text');

      const response = await axios.post('http://localhost:8000/speech-to-text/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const command = this.voicecommands.find(x => similarity(x.command, response.data.text) >= 0.90);

      switch (command?.command) {
        case "Создать подключение":
          // case "Подключение":
          // case "Подключись":
          // case "Подключи базу":
          ctx.reply('Пожалуйста, отправьте вашу строку подключения в ответном сообщении в виде: host;port;username;password');
          break;
        case "Помощь":
          break;
        case "Мои подключения":
          // case "Покажи мои подключения":
          const conns = await this.usersService.findAllUserConnections(String(ctx.from.id));
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

  voicecommands = [
    {
      command: "Создать подключение",
      description: "Добавить подключение через строку подключения",
    },
    {
      command: "Мои подключения",
      description: "Вывести подключения",
    },
    {
      command: "Помощь",
      description: "Окошко с подсказками",
    },
  ]

  commands = [
    {
      command: "start",
      description: "Начать работу",
    },
    {
      command: "help",
      description: "Показать справку",
    },
    {
      command: "cancel",
      description: "Отмена",
    },
    {
      command: "about",
      description: "О разработчиках",
    },
  ];

}

