from discord.ext import commands
from utils.VideoDownloader import Downloader

class Music:
    def __init__(self, client):
        self.client = client

    @commands.command()
    async def play(self, ctx, *, search):
        """Plays something in your voice channel!"""
        if ctx.voice_client is None:
            if ctx.author.voice:
                await ctx.author.voice.channel.connect()
            else:
                await ctx.send("You are not connected to a voice channel.")
        async with ctx.typing():
            player = await Downloader.download(url=search, loop=self.client.loop)
            ctx.voice_client.play(player)

        await ctx.send("Currently playing **{}**".format(player.title))

def setup(client):
    client.add_cog(Music(client))