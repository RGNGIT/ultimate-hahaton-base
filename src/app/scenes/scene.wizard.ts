import { Message, Scene, Wizard, WizardStep, Ctx, SceneEnter, Command } from 'nestjs-telegraf';
import { ConnectionsService } from 'src/connections/connections.service';
import { CreateConnectionDto } from 'src/connections/dto/create-connection.dto';
import { Scenes } from 'telegraf';


@Wizard('connectionWizard')
export class ConnectionWizardScene {

  constructor(
  private readonly connectionsService: ConnectionsService){}
  private connectionDetails = {
    host: '',
    port: '',
    username: '',
    password: '',
  };

  @WizardStep(1)
  async step1(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply('Для отмены выполните команду /cancel');
    await ctx.reply('Введите хост:');
     ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Ctx() ctx: Scenes.WizardContext, @Message('text') message: string ) {
    // const message = ctx.message;
    this.connectionDetails.host = message;
    await ctx.reply('Введите порт:');
     ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Ctx() ctx: Scenes.WizardContext, @Message('text') message: string) {
    this.connectionDetails.port = message;
    await ctx.reply('Введите имя пользователя:');
     ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Ctx() ctx: Scenes.WizardContext, @Message('text') message: string) {
    this.connectionDetails.username = message;
    await ctx.reply('Введите пароль:');
     ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(@Ctx() ctx: Scenes.WizardContext, @Message('text') message: string) {
    // Здесь можно добавить логику сохранения данных и их валидации перед тем, как покинуть сцену
    this.connectionDetails.password = message;
   
    const createConnectionDto:CreateConnectionDto = {
      ...this.connectionDetails,
      telegram_id: ctx.from.id.toString(),
      name: `${this.connectionDetails.username}@${this.connectionDetails.host}`
    };

    const result = await this.connectionsService.create(createConnectionDto);
    if(result) await ctx.reply('Спасибо! Ваши данные были сохранены');
    ctx.scene.leave();
  }

  // Обработчик команды /cancel
  @Command('cancel')
  async cancel(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply('Настройка подключения отменена.');
    await ctx.scene.leave();
  }
}
