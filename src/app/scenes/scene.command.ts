import { Scene, SceneEnter, Ctx, SceneLeave, On, Hears, Message, Command } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { BotService } from '../bot.service';
import { MonitoringService } from 'src/monitoring/monitoring.service';

@Scene('command_sql_scene')
export class SQLCommandScene {
  constructor(private readonly botService: BotService,
    private readonly monitoringService: MonitoringService) { }

  @SceneEnter()
  onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    ctx.reply('Для выхода выполните команду /cancel');
    const initialParams = ctx.session.__scenes.state;
    ctx.reply(`Выбран сервер ${initialParams['connection']['name']}`);
    ctx.reply('Введите комманду на исполнение');
  }

  @Command('cancel')
  async cancel(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply('Команда отменена.');
    await ctx.scene.leave();
  }

  @On('text') // Будет реагировать на любой текст
  async onText(@Message() message: any, @Ctx() ctx: Scenes.SceneContext) {
    // this.monitoringService.executeCommand()

    const sqlCommand = message.text;
    const initialParams = ctx.session.__scenes.state;
    try {
      await ctx.reply(`Выполняю SQL команду: SELECT ${sqlCommand}`);
      const result = await this.monitoringService.executeCommand(
        initialParams['connection']['host'],
        initialParams['connection']['port'],
        initialParams['connection']['username'],
        initialParams['connection']['password'],
        sqlCommand)

      await ctx.reply(`Результат: ${JSON.stringify(result[0])}`);
    }
    catch (error) {
      await ctx.reply("Ошибка выполнения, неверная команда")
    }
    // TODO: выполнение SQL команды

    // ctx.scene.leave();
    ctx.reply('Для выхода выполните команду /cancel');
  }

  @SceneLeave()
  onSceneLeave(): string {
    return 'Вы покинули сцену.';
  }
}