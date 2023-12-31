const {
    inrl,
    fetchJson,
    getBuffer,
    sendUrl,
    AudioMetaData,
    getLang,
    toAudio
} = require('../lib');
let lang = getLang()
const {AUDIO_DATA,STICKER_DATA} = require('../config');
const fs = require('fs');
inrl({
    pattern: 'url',
    desc: lang.GENERAL.URL_DESC,
    react: "⛰️",
    type: "converter"
}, async (message, match) => {
    if (!message.client.isMedia) return message.reply(lang.BASE.NEED.format('image/sticker/video/audio'));
    return await sendUrl(message, message.client);
});

inrl({
    pattern: 'take',
    desc: lang.GENERAL.TAKE_DESC,
    react: "⚒️",
    type: "utility"
}, async (message, match) => {
    try {
        if (!message.quoted.sticker && !message.quoted.audio) return message.reply('reply to a sticker/audio');
        if (message.quoted.stickerMessage) {
            match = match || STICKER_DATA;
            let media = await message.quoted.download();
            return await message.sendSticker(message.jid, media, {
                packname: match.split(/[|,;]/)[0] || match,
                author: match.split(/[|,;]/)[1]
            });
        } else if (message.quoted.audioMessage) {
            match = (match||'').split(/[|,;]/);
            match =`${match[0]||AUDIO_DATA.split(/[|,;]/)[0]};${match[1]||AUDIO_DATA.split(/[|,;]/)[1]}`;
            if(!img) return await message.send('_no images found_\n_use setvar audio_data and update it_');
            const AudioMeta = await AudioMetaData(await getBuffer((match[2] || AUDIO_DATA.split(/[|,;]/)[2] || 'https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg').trim()), await toAudio(await message.quoted.download()), match);
            return await message.conn.sendMessage(message.jid, {
                audio: AudioMeta,
                mimetype: 'audio/mpeg',
                fileName: text.replaceAll(' ', '-') + ".mp3"
            }, {
                quoted: message
            });
        }
    } catch (e) {
        return await message.reply(e.toString());
    }
})
inrl({
    pattern: 'emix',
    desc: lang.GENERAL.EMIX_DESC,
    react: "🤌",
    type: "create"
}, async (message, match, data) => {
    let {
        STICKER_DATA
    } = data;
    if (!match) return message.send(lang.GENERAL.NEED_EMOJI.format("emix"));
    if (!match.includes(/[|,;]/)) return message.send(lang.GENERAL.NEED_EMOJI.format("emix"));
    let emoji1, emoji2;
    if (match.includes(/[|,;]/)) {
        let split = match.split(/[|,;]/);
        emoji1 = split[0];
        emoji2 = split[1];
    }
    let md = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
    for (let res of md.results) {
        return await message.sendSticker(message.jid, res.url, {
                packname: STICKER_DATA.split(/[|,;]/)[0] || STICKER_DATA,
                author: STICKER_DATA.split(/[|,;]/)[1]
        });
    }
})
