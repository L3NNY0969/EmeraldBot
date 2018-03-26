import discord
import asyncio
from discord.ext import commands
from utils.VideoDownloader import Downloader
import os

client = commands.Bot(command_prefix=commands.when_mentioned_or('e.', 'E.'), description="A discord bot!")

@client.event
async def on_ready():
    print("-+-+-{ Loaded }+-+-+")
    print("User: "+client.user.name)
    print("Id: "+str(client.user.id))
    print("Discriminator: "+client.user.discriminator)
    if not discord.opus.is_loaded():
        discord.opus.load_opus('libopus.so')
        print("Opus Loaded: "+str(discord.opus.is_loaded()))

class Audio:
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

client.add_cog(Audio(client))
client.run(os.environ.get('DISCORD'))