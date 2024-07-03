import os
import base64
# import torch
import whisper
from pydub import AudioSegment
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import numpy
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import aiofiles
from pydub.utils import mediainfo

app = FastAPI()

os.environ["PATH"] += os.pathsep + rf"C:\ffmpeg\bin"

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
class AudioInput(BaseModel):
    audio: str

model = whisper.load_model("base")

# def convert_audio_to_wav(audio_file_path):
#     audio = AudioSegment.from_file(audio_file_path)
#     wav_file_path = "temp_audio.wav"
#     audio.export(wav_file_path, format="wav")
#     return wav_file_path

def convert_audio_to_text(audio_file_path):
    # wav_file_path = convert_audio_to_wav(audio_file_path)

    result = model.transcribe(audio_file_path)
    text = result['text']

    # if os.path.exists(wav_file_path):
    #     os.remove(wav_file_path)

    return text

@app.post("/transcript-audio")
async def transcribe_audio(audio_input: AudioInput):
    try:
        audio_data = base64.b64decode(audio_input.audio)

        # mp3_file_path = "temp_audio.mp3"
        # async with aiofiles.open(mp3_file_path, "wb") as mp3_file:
        #     await mp3_file.write(audio_data)
            
        mp3_file_path = os.path.join(os.getcwd(), "temp_audio.mp3")
        with open(mp3_file_path, "wb") as mp3_file:
            mp3_file.write(audio_data)
        print(mp3_file_path)

        text = convert_audio_to_text(mp3_file_path)

        # if os.path.exists(mp3_file_path):
        #     os.remove(mp3_file_path)

        return JSONResponse(content={"transcription": text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the audio file: {e}")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
