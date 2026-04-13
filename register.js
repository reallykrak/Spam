const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('mesaj')
        .setDescription('Döngüsel mesaj gönderme sistemini başlatır.')
        .addStringOption(option =>
            option.setName('icerik')
                .setDescription('Sürekli gönderilecek mesaj')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('pro')
        .setDescription('Aynı anda hem metin hem de dosya/gif gönderir.')
        .addStringOption(option =>
            option.setName('metin')
                .setDescription('Mesaj içeriği')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('ek')
                .setDescription('Eklenecek dosya veya GIF')
                .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Komutlar güncelleniyor...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Komutlar başarıyla yüklendi!');
    } catch (error) {
        console.error(error);
    }
})();
