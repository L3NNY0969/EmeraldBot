import discord
import asyncio
from discord.ext import commands
import os

client = commands.Bot(command_prefix=commands.when_mentioned_or('e.', 'E.'), description="A discord bot!")
client.load_extension('extentions.Music')

@client.event
async def on_ready():
    print("-+-+-{ Loaded }+-+-+")
    print("User: "+client.user.name)
    print("Id: "+str(client.user.id))
    print("Discriminator: "+client.user.discriminator)
    if not discord.opus.is_loaded():
        discord.opus.load_opus('libopus.so')
        print("Opus Loaded: "+str(discord.opus.is_loaded()))

client.run(os.environ.get('DISCORD'))