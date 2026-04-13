const { Client, GatewayIntentBits, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Aktif döngüleri takip etmek için Map
const activeIntervals = new Map();

client.once(Events.ClientReady, c => console.log(`${c.user.tag} aktif ve 1 saniye modunda hazır!`));

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        
        // /mesaj komutu
        if (interaction.commandName === 'mesaj') {
            const icerik = interaction.options.getString('icerik');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('baslat_btn')
                        .setLabel('1sn Aralıkla Başlat')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('durdur_btn')
                        .setLabel('Durdur')
                        .setStyle(ButtonStyle.Danger),
                );

            await interaction.reply({ 
                content: `Mesaj Kuyruğu: **${icerik}**\nSüre: **1 Saniye**`, 
                components: [row],
                ephemeral: true 
            });

            const collector = interaction.channel.createMessageComponentCollector({ 
                componentType: ComponentType.Button, 
                time: 3600000 
            });

            collector.on('collect', async i => {
                if (i.customId === 'baslat_btn') {
                    if (activeIntervals.has(interaction.user.id)) {
                        return i.reply({ content: 'Zaten çalışan bir döngünüz var!', ephemeral: true });
                    }

                    await i.reply({ content: 'Saniyelik gönderim başladı.', ephemeral: true });
                    
                    // Süre 1000ms (1 saniye) olarak ayarlandı
                    const interval = setInterval(() => {
                        interaction.channel.send(icerik).catch(err => console.log("Hata:", err));
                    }, 1000);

                    activeIntervals.set(interaction.user.id, interval);
                }

                if (i.customId === 'durdur_btn') {
                    const interval = activeIntervals.get(interaction.user.id);
                    if (interval) {
                        clearInterval(interval);
                        activeIntervals.delete(interaction.user.id);
                        await i.reply({ content: 'Döngü başarıyla durduruldu.', ephemeral: true });
                    } else {
                        await i.reply({ content: 'Çalışan bir işlem bulunamadı.', ephemeral: true });
                    }
                }
            });
        }

        // /pro komutu (Metin + GIF/Resim)
        if (interaction.commandName === 'pro') {
            const metin = interaction.options.getString('metin');
            const ek = interaction.options.getAttachment('ek');

            await interaction.reply({ content: 'Pro mesaj (Metin+Ek) gönderildi.', ephemeral: true });
            await interaction.channel.send({ 
                content: metin, 
                files: [ek.url] 
            });
        }
    }
});

client.login(process.env.TOKEN);
