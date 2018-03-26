import discord
import youtube_dl
import asyncio
import os
from concurrent.futures import ThreadPoolExecutor

ytdl = youtube_dl.YoutubeDL({
    'format':'worstaudio',
    'outtmpl': os.path.join('songs', '%(title)s-%(id)s.mp3'),
    'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0' # bind to ipv4 since ipv6 addresses cause issues sometimes
})
ffmpeg_options = {
    'before_options': '-nostdin',
    'options': '-vn'
}

class Downloader(discord.PCMVolumeTransformer):
    def __init__(self, source, *, data):
        super().__init__(source, 0.5)
        self.title = data.get('title')
        self.url = data.get('url')
    
    @classmethod
    async def download(cls, url, *, loop=None, stream=False):
        loop = loop  or asyncio.get_event_loop()
        data = await loop.run_in_executor(ThreadPoolExecutor(max_workers=3), lambda: ytdl.extract_info(url, download=not stream))
        if 'entries' in data:
            data = data['entries'][0]
        
        filename = data['url'] if False else ytdl.prepare_filename(data)
        return cls(discord.FFmpegPCMAudio(filename, **ffmpeg_options), data=data)