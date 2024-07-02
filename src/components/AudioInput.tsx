'use client';
import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';

const AudioInput = () => {
    const [file, setFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        try {
            const base64String = await convertToBase64(file);
            // console.log(base64String);
            const response = await axios.post("http://localhost:3002/transcript-audio", { audio: base64String }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }); 

            if (response.status !== 200) {
                throw new Error(`Error: ${response.statusText}`);
            }
            console.log(response.data.transcription)
            setTranscription(response.data.transcription);
            setError("");
            setLoading(false)
        } catch (error: any) {
            setError(error.message);
            setLoading(false)
            setTranscription("");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="audio/*" onChange={handleFileChange} />
                <button type="submit">Upload and Transcribe</button>
            </form>
            {transcription && <div><strong>Transcription:</strong> <p>{transcription}</p></div>}
            {error && <div><strong>Error:</strong> <p>{error}</p></div>}
            {loading && <div><strong>Loading...</strong></div>}
        </div>
    );
};

export default AudioInput;
