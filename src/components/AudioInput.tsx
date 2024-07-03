'use client';
import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';

const AudioInput = () => {
    const trascriptionText: React.CSSProperties = {
        display: 'grid',
        placeItems:'center',
        // height: '60px',
        backgroundColor: '#2a2a2a',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
      };


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
        <div style={{display:"grid", placeItems:"center"}}>
            <form onSubmit={handleSubmit} style={{display:'flex' , gap:'2rem', marginBottom:'3rem'}}>
                <input type="file" accept="audio/*" onChange={handleFileChange} />
                <button type="submit" style={{width:'200px',border:'2px solid black', borderRadius:'20px', backgroundColor:'#2a2a2a', fontSize:'19px', padding:'5px'}}>{loading ? "loading" : "Upload and convert"}</button>

            </form>
            <div style={{borderRadius:"20px"}}>
            {transcription && <div style={trascriptionText}><strong>Transcription:</strong> <p style={{position:"relative", border:'2px solid black', borderRadius:'20px', padding:'2rem'}}>{transcription}</p></div>}
            {error && <div><strong>Error:</strong> <p>{error}</p></div>}
            {loading && <div><strong>Loading...</strong></div>}
            </div>
        </div>
    );
};

export default AudioInput;
