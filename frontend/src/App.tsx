import {
    ChangeEventHandler,
    FormEventHandler,
    useEffect,
    useState,
} from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function App() {
    interface Message {
        body: string;
        from: string;
    }

    const [message, setMessage] = useState<Message>({
        body: "",
        from: "Me",
    });
    const [messages, setMessages] = useState<Array<Message>>([]);

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setMessage((prev) => ({ ...prev, body: e.target.value }));
    };

    const saveMessage = (message: Message) => {
        setMessages((state) => [...state, message]);
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        socket.emit("message", { ...message, from: socket.id });
        saveMessage(message);
    };

    useEffect(() => {
        socket.on("message", saveMessage);

        return () => {
            socket.off("message", saveMessage);
        };
    }, []);

    return (
        <div>
            <h1 className="mb-6 text-yellow-200">Xat</h1>
            <form action="" onSubmit={handleSubmit} className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={message.body}
                    placeholder="Your message"
                    onChange={handleInputChange}
                    className="text-center"
                />
                <button>Send</button>
            </form>
            <ul className="list-none shadow-2xl min-h-[300px] p-4 bg-[#242424]">
                {messages.map((message, i) => (
                    <li
                        key={i}
                        className={
                            message.from === "Me"
                                ? "text-end text-green-300"
                                : "text-start text-purple-500"
                        }
                    >
                        <span className="font-bold">{message.from}</span>:{" "}
                        {message.body}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
