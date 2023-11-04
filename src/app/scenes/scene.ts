import { Scene, SceneEnter, Ctx, SceneLeave, On, Hears, Message, Command } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { BotService } from '../bot.service';

@Scene('my_scene')
export class MyScene {
    constructor(private readonly botService: BotService) { }

  @SceneEnter()
  onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    ctx.reply('Для отмены выполните команду /cancel');
    ctx.reply('Пожалуйста, отправьте вашу строку подключения в ответном сообщении в виде: host;port;username;password');
  }

  @Command('cancel')
  async cancel(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply('Настройка подключения отменена.');
    await ctx.scene.leave();
  } 

  @On('text') // Будет реагировать на любой текст
  async onUserReply(@Message() message: any, @Ctx() ctx: Scenes.SceneContext) {
    if (message.reply_to_message && message.reply_to_message.text.includes('отправьте вашу строку подключения')) {
        const result = this.botService.parseConnectionString(message.text, ctx.from.id.toString());
        if(result) ctx.reply("Подключение добавлено!");
        else ctx.reply("Произошла ошибка!");
        ctx.scene.leave();
    }   
    else {
        ctx.reply('Пожалуйста, отправьте вашу строку подключения в ответном сообщении в виде: host;port;username;password');
    }
  }





  @SceneLeave()
  onSceneLeave(): string {
    return 'Вы покинули сцену.';
  }
}