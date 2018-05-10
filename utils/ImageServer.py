import websockets
import asyncio
import json
import wand
import requests
from array import array
from io import StringIO, BytesIO
from wand.image import Image

async def ImageSocket(websocket, path):
    while True:
        data = await websocket.recv()
        await handle(data, websocket)

async def handle(data, websocket):
    resp = json.loads(data)
    avatar = resp.get("avatar")
    depth = resp.get("depth")

    if avatar:
        print(f"Loading magik with avatar: {avatar} and depth: {int(depth)}");
        r = requests.get(avatar)
        img = Image(file=BytesIO(r.content))
        img.liquid_rescale(width=int(img.width * 0.5), height=int(img.height * 0.5), delta_x=int(depth), rigidity=0)
        img.liquid_rescale(width=int(img.width * 1.5), height=int(img.height * 1.5), delta_x=int(depth), rigidity=0)
        img_byte = BytesIO()
        img.save(file=img_byte)
        img_byte.seek(0)
        print("Magik complete returning the image.")
        return await websocket.send(img_byte.read())

print("Starting websocket.")
run = websockets.serve(ImageSocket, "127.0.0.1", 25)
print("Complete.")
asyncio.get_event_loop().run_until_complete(run)
asyncio.get_event_loop().run_forever()