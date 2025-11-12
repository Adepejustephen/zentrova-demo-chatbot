import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, PhoneOff, Loader2, PhoneCall } from "lucide-react";
import { config } from "@/config";

export default function LiveCall({
    brandColor,
    chatbotID,
    onBack,
    onEnd,
}: {
    brandColor: string;
    chatbotID: string;
    onBack: () => void;
    onEnd: () => void;
}) {
    const assistantAudioRef = useRef < HTMLAudioElement | null > (null);
    const peerConnectionRef = useRef < RTCPeerConnection | null > (null);
    const localStreamRef = useRef < MediaStream | null > (null);
    const dataChannelRef = useRef < RTCDataChannel | null > (null);

    const [isConnecting, setIsConnecting] = useState(false);
    const [isStreaming, setIsStreaming] = useState < boolean > (false);
    const [isEnding, setIsEnding] = useState(false);
    const [headerText, setHeaderText] = useState < string > ("Calling...");

    const audioActivityRafRef = useRef < number | null > (null);
    const lastActivityAtRef = useRef < number > (Date.now());
    const inactivityIntervalRef = useRef < number | null > (null);
    const endAndCloseRef = useRef < () => void> (() => { });
    const audioContextRef = useRef < AudioContext | null > (null);
    const analyserRef = useRef < AnalyserNode | null > (null);
    const audioSourceRef = useRef < MediaStreamAudioSourceNode | null > (null);

    const BASE_URL = config.baseUrl;
    const CHATBOT_BASE_URL = config.chatbotBaseUrl
    const [transferPhoneNumber, setTransferPhoneNumber] = useState < string | null > (
        null
    );
    const [showTransferPrompt, setShowTransferPrompt] = useState < boolean > (false);

    useEffect(() => {
        try {
            const tpn = localStorage.getItem("chatbot_transfer_phone_number");
            if (tpn) setTransferPhoneNumber(tpn);
        } catch { }
    }, []);

    const hasEndedRef = useRef < boolean > (false);

    const startAudioActivityMonitor = useCallback((stream: MediaStream) => {
        try {
            const AudioCtxCtor =
                (window as any).AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtxCtor) return;

            const audioCtx = new AudioCtxCtor();
            audioContextRef.current = audioCtx;

            const source = audioCtx.createMediaStreamSource(stream);
            audioSourceRef.current = source;

            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);
            analyserRef.current = analyser;

            const buffer = new Float32Array(analyser.fftSize);
            const loop = () => {
                analyser.getFloatTimeDomainData(buffer);
                let sum = 0;
                for (let i = 0; i < buffer.length; i++) {
                    sum += buffer[i] * buffer[i];
                }
                const rms = Math.sqrt(sum / buffer.length);
                const speaking = rms > 0.02;
                setIsStreaming(speaking);
                if (speaking) {
                    lastActivityAtRef.current = Date.now();
                }
                audioActivityRafRef.current = requestAnimationFrame(loop);
            };
            loop();
        } catch { }
    }, []);

    const stopAudioActivityMonitor = useCallback(() => {
        try {
            if (audioActivityRafRef.current != null) {
                cancelAnimationFrame(audioActivityRafRef.current);
                audioActivityRafRef.current = null;
            }
            if (audioSourceRef.current) {
                try {
                    audioSourceRef.current.disconnect();
                } catch { }
                audioSourceRef.current = null;
            }
            if (analyserRef.current) {
                try {
                    analyserRef.current.disconnect();
                } catch { }
                analyserRef.current = null;
            }
            const ctx = audioContextRef.current;
            if (ctx) {
                try {
                    ctx.close();
                } catch { }
                audioContextRef.current = null;
            }
        } catch { }
    }, []);

    const markError = useCallback((_: unknown = null) => {
        setHeaderText("Failed to process call");
        setIsStreaming(false);
        setIsConnecting(false);
    }, []);

    const stopRemoteAudioPlayback = useCallback(() => {
        const audioEl = assistantAudioRef.current;
        if (!audioEl) return;
        try {
            audioEl.pause();
            // Detach and flush any buffered audio
            audioEl.srcObject = null;
            audioEl.removeAttribute("src");
            audioEl.currentTime = 0;
            audioEl.load();
        } catch { }
    }, []);

    const cleanup = useCallback(() => {
        try {
            const s = localStreamRef.current;
            if (s) {
                try {
                    s.getTracks().forEach((t) => t.stop()); // stop microphone
                } catch { }
                localStreamRef.current = null;
            }

            const pc = peerConnectionRef.current;
            if (pc) {
                // stop remote receivers if present
                try {
                    pc.getReceivers().forEach((receiver) => {
                        try {
                            receiver.track?.stop();
                        } catch { }
                    });
                } catch { }
                try {
                    pc.getSenders().forEach((sender) => {
                        try {
                            sender.track?.stop();
                        } catch { }
                    });
                } catch { }
                try {
                    pc.close();
                } catch { }
                peerConnectionRef.current = null;
            }

            const dc = dataChannelRef.current;
            if (dc) {
                try {
                    dc.close();
                } catch { }
                dataChannelRef.current = null;
            }

            // Ensure audio element is fully reset
            stopRemoteAudioPlayback();

            // Clear inactivity checker
            if (inactivityIntervalRef.current != null) {
                clearInterval(inactivityIntervalRef.current);
                inactivityIntervalRef.current = null;
            }

            setIsStreaming(false);
            stopAudioActivityMonitor();
        } catch { }
    }, [stopAudioActivityMonitor, stopRemoteAudioPlayback]);

    const handleFunctionCall = useCallback(
        async (functionName: string, functionCallId: string, args: string) => {
            try {
                const parsedArgs = JSON.parse(args || "{}");

                if (parsedArgs?.transfer_phone_number) {
                    const num = String(parsedArgs.transfer_phone_number);
                    setTransferPhoneNumber(num);
                    try {
                        localStorage.setItem("chatbot_transfer_phone_number", num);
                    } catch { }
                }

                const response = await fetch(
                    `${CHATBOT_BASE_URL}realtime/function-call`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            function_name: functionName,
                            arguments: parsedArgs,
                        }),
                    }
                );
                if (!response.ok)
                    throw new Error(`Function call failed: ${response.statusText}`);
                const result = await response.json();

                const dc = dataChannelRef.current;
                if (dc && dc.readyState === "open") {
                    const outputEvent = {
                        type: "conversation.item.create",
                        item: {
                            type: "function_call_output",
                            call_id: functionCallId,
                            output: JSON.stringify(result),
                        },
                    };
                    dc.send(JSON.stringify(outputEvent));
                    dc.send(JSON.stringify({ type: "response.create" }));
                }
            } catch (error: any) {
                markError(error);
                const dc = dataChannelRef.current;
                if (dc && dc.readyState === "open") {
                    const outputEvent = {
                        type: "conversation.item.create",
                        item: {
                            type: "function_call_output",
                            call_id: functionCallId,
                            output: JSON.stringify({
                                error: error?.message || "Function call error",
                            }),
                        },
                    };
                    dc.send(JSON.stringify(outputEvent));
                }
            }
        },
        [markError]
    );

    const startRTCSession = useCallback(async () => {
        setIsConnecting(true);
        hasEndedRef.current = false;

        // Initialize inactivity tracking at session start
        lastActivityAtRef.current = Date.now();
        if (inactivityIntervalRef.current == null) {
            inactivityIntervalRef.current = window.setInterval(() => {
                if (hasEndedRef.current) return;
                const idleMs = Date.now() - lastActivityAtRef.current;
                if (idleMs >= 10000) {
                    try {
                        endAndCloseRef.current();
                    } catch { }
                }
            }, 1000);
        }

        try {
            const tokenUrl =
                `${CHATBOT_BASE_URL}realtime/token`;
            const voice = localStorage.getItem("chatbot_bot_voice");
            const language = localStorage.getItem("chatbot_bot_language");
            const welcomeMessage = localStorage.getItem(
                "chatbot_bot_welcome_message"
            );

            let customApis: any[] | null = null;
            try {
                const raw = localStorage.getItem("chatbot_custom_apis");
                const parsed = raw ? JSON.parse(raw) : null;
                customApis = Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
            } catch {
                customApis = null;
            }

            const tokenPayloadBody: Record<string, any> = { agent_id: chatbotID };
            if (voice) tokenPayloadBody.voice = voice;
            if (language) tokenPayloadBody.language = language;
            if (welcomeMessage) tokenPayloadBody.welcome_message = welcomeMessage;
            if (customApis) tokenPayloadBody.custom_apis = customApis;

            const tokenRes = await fetch(tokenUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tokenPayloadBody),
            });
            if (!tokenRes.ok) throw new Error("Failed to obtain token");
            const tokenPayload = await tokenRes.json();
            const ephemeralKey = tokenPayload.value;

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });
            peerConnectionRef.current = pc;

            pc.ontrack = (event) => {
                const stream = event.streams && event.streams[0];
                if (stream && assistantAudioRef.current) {
                    assistantAudioRef.current.srcObject = stream;
                    assistantAudioRef.current.play().catch(() => { });
                    startAudioActivityMonitor(stream);

                    const [track] = stream.getAudioTracks();
                    if (track) {
                        track.onunmute = () => {
                            setIsStreaming(true);
                            lastActivityAtRef.current = Date.now();
                        };
                        track.onmute = () => setIsStreaming(false);
                    }
                }
            };

            pc.oniceconnectionstatechange = () => {
                if (
                    pc.iceConnectionState === "disconnected" ||
                    pc.iceConnectionState === "failed"
                ) {
                    markError();
                    cleanup();
                }
            };

            pc.onicecandidate = () => { };

            const dc = pc.createDataChannel("oai-events");
            dataChannelRef.current = dc;

            dc.onopen = () => {
                try {
                    dc.send(JSON.stringify({ type: "response.create" }));
                } catch (e) {
                    markError(e);
                }
            };

            dc.onmessage = (event) => {
                // Any data activity resets inactivity
                lastActivityAtRef.current = Date.now();
                try {
                    const payload = JSON.parse(event.data);
                    if (payload.type === "response.function_call_arguments.done") {
                        const functionName = payload.name;
                        const callId = payload.call_id;
                        const args = payload.arguments || "{}";
                        handleFunctionCall(functionName, callId, args);
                    }
                } catch (e) {
                    markError(e);
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const modelUrl = "https://api.openai.com/v1/realtime/calls";
            const sdpRes = await fetch(modelUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${ephemeralKey}`,
                    "Content-Type": "application/sdp",
                },
                body: pc.localDescription?.sdp || "",
            });
            if (!sdpRes.ok) throw new Error("SDP exchange failed");

            const answerSdp = await sdpRes.text();
            const remoteDesc = new RTCSessionDescription({
                type: "answer",
                sdp: answerSdp,
            });
            await pc.setRemoteDescription(remoteDesc);

            setIsConnecting(false);
        } catch (err) {
            console.error("LiveCall start error:", err);
            markError(err);
            cleanup();
        }
    }, [
        chatbotID,
        cleanup,
        handleFunctionCall,
        markError,
        startAudioActivityMonitor,
    ]);

    useEffect(() => {
        startRTCSession();
        return cleanup;
    }, [startRTCSession, cleanup]);

    const endAndClose = useCallback(async () => {
        if (hasEndedRef.current) return;
        hasEndedRef.current = true;
        setIsEnding(true);

        // Immediately stop audio and media regardless of network result
        try {
            stopRemoteAudioPlayback();
            cleanup();
        } catch { }

        try {
            const conversationId = localStorage.getItem("chatbot_conversation_id");
            if (conversationId) {
                await fetch(
                    `${BASE_URL}chatbots/call/${encodeURIComponent(
                        conversationId
                    )}/complete/`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
        } catch (e) {
            console.error("End conversation error:", e);
            markError(e);
        } finally {
            try {
                localStorage.removeItem("chatbot_conversation_id");
            } catch { }
            setIsEnding(false);

            setHeaderText("Call ended");
            if (transferPhoneNumber) {
                setShowTransferPrompt(true);
            } else {
                onEnd();
            }
        }
    }, [cleanup, onEnd, markError, stopRemoteAudioPlayback, transferPhoneNumber]);

    useEffect(() => {
        endAndCloseRef.current = endAndClose;
    }, [endAndClose]);

    const handleBack = useCallback(async () => {
        if (isEnding) return;
        await endAndClose();
        onBack();
    }, [endAndClose, onBack, isEnding]);

    return (
        <div className="flex flex-col h-full min-h-[400px]">
            <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ backgroundColor: brandColor }}
            >
                <button
                    onClick={handleBack}
                    disabled={isEnding}
                    className="text-white flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-white font-semibold">{headerText}</span>
            </div>

            <div className="flex-1 items-center flex flex-col justify-center p-4">
                {showTransferPrompt ? (
                    <div className="max-w-md w-full mx-auto  p-6 bg-white dark:bg-neutral-900">
                        <div className="flex items-center justify-center mb-4 relative">
                            <div
                            // className="absolute rounded-full border-2 animate-ping"
                            // style={{
                            //   width: 160,
                            //   height: 160,
                            //   borderColor: brandColor,
                            //   opacity: 0.25,
                            // }}
                            />
                            <div
                                className="absolute rounded-full border-2 animate-ping"
                                style={{
                                    // width: 220,
                                    // height: 220,
                                    borderColor: brandColor,
                                    opacity: 0.15,
                                    animationDelay: "0.2s",
                                }}
                            />
                            <div
                                className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full shadow-lg"
                                style={{ backgroundColor: brandColor }}
                            >
                                <PhoneCall className="w-10 h-10 text-white animate-bounce" />
                            </div>
                        </div>

                        <h2 className="text-lg text-center font-semibold text-gray-900 dark:text-gray-100 ">
                            Not satisfied?
                        </h2>
                        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                            Speak to us directly.
                        </p>

                        {/* {transferPhoneNumber && (
              <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">Call:</span>{" "}
                <a
                  className="underline text-blue-600"
                  href={`tel:${transferPhoneNumber}`}
                >
                  {transferPhoneNumber}
                </a>
              </div>
            )} */}

                        <div className="mt-6 flex gap-3 justify-center ">
                            {transferPhoneNumber && (
                                <a
                                    href={`tel:${transferPhoneNumber}`}
                                    className="rounded-md cursor-pointer text-sm px-4 py-2 text-white"
                                    style={{ backgroundColor: brandColor }}
                                    onClick={() => {
                                        setShowTransferPrompt(false);
                                        onEnd();
                                    }}
                                >
                                    Call Now
                                </a>
                            )}
                            <button
                                className="rounded-md text-sm px-4 cursor-pointer py-2 border dark:border-neutral-700 dark:text-gray-100"
                                onClick={() => {
                                    setShowTransferPrompt(false);
                                    onEnd();
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div
                            className={`mx-auto mb-8 h-40 w-40 rounded-full border-4 ${isStreaming ? "animate-pulse" : ""
                                }`}
                            style={{ borderColor: brandColor, backgroundColor: brandColor }}
                        />
                        <audio ref={assistantAudioRef} autoPlay className="hidden" />
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={endAndClose}
                                disabled={isEnding || isConnecting}
                                className="rounded-full px-4 py-2 text-white bg-slate-800 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isEnding ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Ending...</span>
                                    </>
                                ) : isConnecting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Connecting...</span>
                                    </>
                                ) : (
                                    <>
                                        <PhoneOff className="w-4 h-4" />
                                        <span>End Conversation</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
