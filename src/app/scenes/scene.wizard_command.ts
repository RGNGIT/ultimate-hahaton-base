import { Message, Scene, Wizard, WizardStep, Ctx, SceneEnter, Command, On } from 'nestjs-telegraf';
import { SshService } from 'src/monitoring/ssh.service';
import { Scenes } from 'telegraf';


@Wizard('command_ssh_scene')
export class CommandWizardScene {

  constructor(
    private readonly sshService: SshService,

  ) { }
  private sshDetails = {
    host: '',
    username: '',
    password: '',
  };

  @WizardStep(1)
  async step1(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply('Для отмены выполните команду /cancel');

    await ctx.reply('Введите хост для SSH подключения:');
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Ctx() ctx: Scenes.WizardContext, @Message('text') message: string) {
    this.sshDetails.host = message;
    await ctx.reply('Введите имя пользователя:');
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Ctx() ctx: Scenes.WizardContext, @Message('text') message: string) {
    this.sshDetails.username = message;
    await ctx.reply('Введите пароль:');
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Ctx() ctx: Scenes.WizardContext, @Message('text') message: string) {
    // Здесь можно добавить логику сохранения данных и их валидации перед тем, как покинуть сцену
    this.sshDetails.password = message;
    await ctx.reply('Устанавливаем соединение...');
    try{
      const result = await this.sshService.checkOS(this.sshDetails.host, this.sshDetails.username, this.sshDetails.password);
      console.log(result);

      if(result){
        await ctx.reply(`Соединение установлено, определена ОС: ${result}`);
        await ctx.reply('Введите команду');
        ctx.wizard.next();
        }
    } catch(error){
      await ctx.reply('Ошибка подключения');
      await ctx.reply('Для отмены выполните команду /cancel');
      await ctx.reply('Введите хост для SSH подключения:');
      ctx.wizard.selectStep(1);
    }
   

    // const createConnectionDto:CreateConnectionDto = {
    //   ...this.connectionDetails,
    //   telegram_id: ctx.from.id.toString(),
    //   name: `${this.connectionDetails.username}@${this.connectionDetails.host}`
    // };

    // const result = await this.connectionsService.create(createConnectionDto);
    // if(result) await ctx.reply('Спасибо! Ваши данные были сохранены');
    // ctx.scene.leave();
  }

  @WizardStep(5)
  async step5(@Ctx() ctx: Scenes.WizardContext, @Message('text') message: string) {
    // Здесь можно добавить логику сохранения данных и их валидации перед тем, как покинуть сцену
    const command = message;
    await ctx.reply('Идёт выполнение команды');
    try{
      const result = await this.sshService.connectAndExecute(this.sshDetails.host, this.sshDetails.username, this.sshDetails.password, command)
      if(result){
        await ctx.reply(`Результат: ${result}`);

        }
      console.log(result);
    } catch (error){
      await ctx.reply(`Ошибка выполнения: ${error}`);
    }
    await ctx.reply('Можете ввести новую команду или сбросить соединение, выполнив команду /cancel');

  }

 
  // Обработчик команды /cancel
  @Command('cancel')
  async cancel(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply('Подключение сброшено');
    await ctx.scene.leave();
  }
}
