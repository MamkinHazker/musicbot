import fetch from 'node-fetch'

type yandexTrack = {
    artists: [{ name: string }],
    title: string
}

function getParamsString(params: Record<string, any>) {
    let paramsString = '?';
    const entries = Object.entries(params);
    entries.forEach(row => {
        paramsString += `${row[0]}=${row[1]}&`
    });
    return paramsString.substring(0, paramsString.length - 1)
}

export class Adapter {
    async parseTracksFromYandexLink(link: string): Promise<string[]> {
        const owner = 'kukaraches48';
        const playlist_id = '3';
        let params = { owner, kinds: playlist_id };
        let paramsString = getParamsString(params);
        let tracks = (await (await fetch(`https://music.yandex.ru/handlers/playlist.jsx${paramsString}`, {
            headers: {
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 OPR/87.0.4390.25',
                'X-Current-UID': '693274689',
            }
        })).json()).playlist.tracks;
        tracks = tracks.map((track: yandexTrack) => {
            let author = '';
            track.artists.forEach((artist: any) => author += artist.name + ', ');
            return track.title + ' - ' + author;
        });
        return tracks;
    }

    async parse(argsString: string): Promise<string[]> {
        if (argsString.startsWith('https://music.yandex.ru')) {
            return (await this.parseTracksFromYandexLink(argsString));
        }
        return [];
    }
}