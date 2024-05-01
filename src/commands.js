const { player } = require(".");

module.exports = async (client, msg, args, command) => {
  if (command === "play") {
    const channel = msg.member.voice.channel;
    if (!channel)
      return msg.channel.send(`Primeiro entre em algum canal de voz, que eu vou correndo tocar uma pra você! (tô falando de música, hein)  👀`);

    const search_music = args.join(" ");
    if (!search_music)
      return msg.channel.send(`Opa! Você precisa me informar uma música, doido(a)! 🤪`);

    const queue = player.createQueue(msg.guild.id, {
      metadata: {
        channel: msg.channel,
      },
    });

    try {
      if (!queue.connection) await queue.connect(channel);
    } catch (error) {
      queue.destroy();
      return await msg.reply({
        content: `Ops... Não consegui entrar no servidor. 🙁`,
        ephemeral: true,
      });
    }

    const song = await player
      .search(search_music, {
        requestedBy: msg.author,
      })
      .then((x) => x.tracks[0]);

    client.user.setActivity(song.title, { type: "LISTENING" });
    if (!song) return msg.reply(`Ops... Não achei a música **${search_music}** 🙁`);
    queue.play(song);

    msg.channel.send({ content: `Beleza! Procurando a música **${song.title}** 🔍 ` });
  } else if (command === "skip") {
    const queue = player.getQueue(msg.guild.id);
    queue.skip();
    msg.channel.send(`Proxima música... ⏭️`);
  } else if (command === "stop") {
    const queue = player.getQueue(msg.guild.id);
    queue.stop();
    msg.channel.send(`Você que manda! Desliguei o som. ⏹️`);
  } else if (command === "pause") {
    const queue = player.getQueue(msg.guild.id);
    queue.setPaused(true);
    msg.channel.send(`Música pausada! Mas dá /back logo porque eu respiro música. ⏸️`);
  } else if (command === "back") {
    const queue = player.getQueue(msg.guild.id);
    queue.setPaused(false);
    msg.channel.send(`Aê... Voltando ao som! ⏮️`);
  }
};
