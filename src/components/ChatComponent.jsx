import React, { useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { SceneContext } from "../context/SceneContext";
import styles from "./ChatBox.module.css";

export default function ChatBox() {

    const {lipSync} = React.useContext(SceneContext);
    const [input, setInput] = React.useState("");
    
    const [messages, setMessages] = React.useState([]);
    const handleChange = async (event) => {
        event.preventDefault();
        setInput(event.target.value);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'c') {
                setMessages([]);
                // spacebar
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSubmit = async (event) => {
        if(event.preventDefault) event.preventDefault();
        // Get the value of the input element
        const input = event.target.elements.message;
        const value = input.value;

        // Send the message to the localhost endpoint
        const client = "charactercreator_page";
        const channelId = "three";
        const speaker = "moon";
        const agent = "Eliza";
        const channel = "homepage";
        const spell_handler = "charactercreator";

        // get the first 5 messages
        const newMessages = [...messages];
        newMessages.push("Speaker: " + value)
        setInput("");
        setMessages(newMessages);

        try {
            // TODO: Use environment variable for API endpoint
            const apiUrl = import.meta.env.VITE_CHAT_API_URL || "http://localhost:8001";
            const url = encodeURI(`${apiUrl}/spells/${spell_handler}`)

            const driveId = '1QnOliOAmerMUNuo2wXoH-YoainoSjZen'

            axios.post(`${url}`, {
                Input: {
                    input: value,
                    speaker: speaker,
                    agent: agent,
                    client: client,
                    channelId: channelId,
                    channel: channel,
                }
            }).then((response) => {
                const data = response.data;

                const outputs = data.outputs;

                const outputKey = Object.keys(outputs)[0];

                const output = outputs[outputKey];



                const ttsEndpoint = `https://voice.webaverse.com/tts?s=${output}&voice=${driveId}`

                // fetch the audio file from ttsEndpoint

                fetch(ttsEndpoint).then(async (response) => {
                    const blob = await response.blob();
                    
                    // convert the blob to an array buffer
                    const arrayBuffer = await blob.arrayBuffer();

                    lipSync.startFromAudioFile(arrayBuffer);
                });

                setMessages([...newMessages, agent + ": " + output]);
            });
        } catch (error) {
            console.error(error);
            // Show user-friendly error message
            setMessages([...newMessages, "System: Error processing your message. Please try again."]);
        }
    };

    return (
        <div className={styles['chatBox']}>
            <div className={styles["messages"]}>
                {messages.map((message, index) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }}></div>
                ))}
            </div>

            <form className={styles['send']} onSubmit={handleSubmit}>
                <input
                    autoComplete="off"
                    type="text"
                    name="message"
                    value={input}
                    onInput={handleChange}
                    onChange={handleChange}
                    maxLength={500}
                    pattern={'^[^<>"\'&]+$'}
                    title="Message should not contain HTML tags or special characters"
                />
                <button className={styles["button"]} onSubmit={handleSubmit} type="submit">Send</button>
            </form>
        </div>
        );
    }

// export default ChatBox; // (already exported at top)