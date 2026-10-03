import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneCall,
  X,
} from "lucide-react";
import {
  sendCallOffer,
  sendCallAnswer,
  sendCallReject,
  sendIceCandidate,
  sendCallEnd,
} from "../../services/socket";

// ── ICE servers (STUN) ─────────────────────────────────────────────────────
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

/**
 * VideoCallModal
 *
 * Props:
 *   mode         : "outgoing" | "incoming" | "active"
 *   callType     : "video" | "audio"
 *   localUserId  : number
 *   localName    : string
 *   remoteUser   : { id, firstName, lastName, username }
 *   incomingSignal : CallSignalDTO (only for incoming)
 *   onClose      : () => void   — called when modal should unmount
 */
const VideoCallModal = ({
  mode: initialMode,
  callType: initialCallType,
  localUserId,
  localName,
  remoteUser,
  incomingSignal,
  conversationId,
  onCallEnded,
  onClose,
  onSignal, // (signal) => void  — parent forwards incoming WebSocket signals here
}) => {
  const [mode, setMode] = useState(initialMode);           // "outgoing"|"incoming"|"active"
  const [callType, setCallType] = useState(initialCallType);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(initialCallType === "video");
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState(
    initialMode === "outgoing" ? "Calling…" : "Incoming call"
  );

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);           // RTCPeerConnection
  const localStreamRef = useRef(null);  // local MediaStream
  const timerRef = useRef(null);
  const icePendingRef = useRef([]);     // buffer ICE candidates before remote desc is set
  const durationRef = useRef(0);
  const loggedRef = useRef(false);

  // ── Format call duration ──────────────────────────────────────────────────
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Start duration timer ──────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDuration((d) => {
        const next = d + 1;
        durationRef.current = next;
        return next;
      });
    }, 1000);
  }, []);

  const recordCallEnded = useCallback((callStatus) => {
    if (loggedRef.current) return;
    loggedRef.current = true;
    if (onCallEnded) {
      onCallEnded({
        callType: incomingSignal?.callType || callType,
        callStatus, // "COMPLETED", "MISSED", "REJECTED"
        duration: durationRef.current,
        conversationId: conversationId || incomingSignal?.conversationId,
        receiverId: remoteUser?.id,
        isCaller: initialMode === "outgoing",
      });
    }
  }, [onCallEnded, incomingSignal, callType, conversationId, remoteUser, initialMode]);

  // ── Cleanup resources ─────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    clearInterval(timerRef.current);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
  }, []);

  // ── Reject an incoming call ───────────────────────────────────────────────
  const rejectCall = useCallback(() => {
    sendCallReject(localUserId, remoteUser.id);
    recordCallEnded("REJECTED");
    cleanup();
    onClose();
  }, [localUserId, remoteUser, recordCallEnded, cleanup, onClose]);

  // ── Hang up ───────────────────────────────────────────────────────────────
  const handleHangUp = useCallback((notify = true) => {
    if (notify) sendCallEnd(localUserId, remoteUser.id);
    const finalStatus = mode === "active" ? "COMPLETED" : "MISSED";
    recordCallEnded(finalStatus);
    cleanup();
    onClose();
  }, [localUserId, remoteUser, mode, recordCallEnded, cleanup, onClose]);

  // ── Get local media stream ────────────────────────────────────────────────
  const getLocalStream = useCallback(async (video = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error("Media access denied:", err);
      setStatus("Camera/mic access denied");
      return null;
    }
  }, []);

  // ── Create RTCPeerConnection ──────────────────────────────────────────────
  const createPC = useCallback((stream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    // Add local tracks
    stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Forward ICE candidates to remote peer via STOMP
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendIceCandidate(localUserId, remoteUser.id, candidate);
      }
    };

    // Receive remote stream
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        handleHangUp(false);
      }
    };

    return pc;
  }, [localUserId, remoteUser, handleHangUp]);

  // ── OUTGOING: create offer ────────────────────────────────────────────────
  const startOutgoingCall = useCallback(async () => {
    const stream = await getLocalStream(callType === "video");
    if (!stream) return;

    const pc = createPC(stream);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendCallOffer(localUserId, remoteUser.id, localName, callType, offer, conversationId);
    setStatus("Ringing…");
  }, [callType, localUserId, remoteUser, localName, conversationId, getLocalStream, createPC]);

  // ── INCOMING: answer the call ─────────────────────────────────────────────
  const answerCall = useCallback(async () => {
    setMode("active");
    setStatus("Connecting…");

    const ct = incomingSignal?.callType || callType;
    setCallType(ct);
    setCamOn(ct === "video");

    const stream = await getLocalStream(ct === "video");
    if (!stream) return;

    const pc = createPC(stream);

    // Set remote offer
    const offerSdp = JSON.parse(incomingSignal.payload);
    await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));

    // Flush any buffered ICE candidates
    for (const c of icePendingRef.current) {
      await pc.addIceCandidate(new RTCIceCandidate(c));
    }
    icePendingRef.current = [];

    // Create and send answer
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendCallAnswer(localUserId, remoteUser.id, answer);

    setStatus("Connected");
    startTimer();
  }, [incomingSignal, callType, localUserId, remoteUser, getLocalStream, createPC, startTimer]);

  // ── Toggle mic ────────────────────────────────────────────────────────────
  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  // ── Toggle camera ─────────────────────────────────────────────────────────
  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  };

  // ── Handle incoming WebRTC signals forwarded by parent ───────────────────
  useEffect(() => {
    if (!onSignal) return;
    // Parent calls onSignal setter; we expose our handler via prop callback pattern
  }, [onSignal]);

  // Expose signal handler to parent via a ref-like callback
  // Parent passes signals via the `incomingSignal` prop after initial mount
  // We watch it for changes:
  const prevSignalRef = useRef(null);
  useEffect(() => {
    if (!incomingSignal || incomingSignal === prevSignalRef.current) return;
    prevSignalRef.current = incomingSignal;

    const { type, payload } = incomingSignal;

    (async () => {
      if (type === "CALL_ANSWER" && pcRef.current) {
        const sdp = JSON.parse(payload);
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        // Flush buffered ICE
        for (const c of icePendingRef.current) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(c));
        }
        icePendingRef.current = [];
        setMode("active");
        setStatus("Connected");
        startTimer();
      } else if (type === "ICE_CANDIDATE" && pcRef.current) {
        const candidate = JSON.parse(payload);
        if (pcRef.current.remoteDescription) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          icePendingRef.current.push(candidate);
        }
      } else if (type === "CALL_REJECT") {
        setStatus("Call rejected");
        recordCallEnded("REJECTED");
        setTimeout(() => { cleanup(); onClose(); }, 1500);
      } else if (type === "CALL_END") {
        setStatus("Call ended");
        const finalStatus = mode === "active" ? "COMPLETED" : "MISSED";
        recordCallEnded(finalStatus);
        setTimeout(() => { cleanup(); onClose(); }, 1200);
      }
    })();
  }, [incomingSignal, mode, recordCallEnded, startTimer, cleanup, onClose]);

  // ── Init on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialMode === "outgoing") {
      startOutgoingCall();
    }
    return () => cleanup();
  }, []); // eslint-disable-line

  // ── Remote user display name ──────────────────────────────────────────────
  const remoteName = remoteUser
    ? `${remoteUser.firstName || ""} ${remoteUser.lastName || ""}`.trim() || remoteUser.username
    : "";
  const remoteInitial = (remoteUser?.firstName?.[0] || remoteUser?.username?.[0] || "?").toUpperCase();

  // ── INCOMING ringing UI ───────────────────────────────────────────────────
  if (mode === "incoming") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 w-[320px] border border-white/10">
          {/* Animated ring */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-ping" />
            <div className="absolute w-24 h-24 rounded-full bg-blue-500/30 animate-pulse" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {remoteInitial}
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/60 text-sm mb-1">
              {(incomingSignal?.callType || callType) === "video" ? "📹 Incoming video call" : "📞 Incoming audio call"}
            </p>
            <h2 className="text-white text-xl font-bold">{remoteName}</h2>
          </div>

          {/* Action buttons */}
          <div className="flex gap-8 mt-2">
            <button
              onClick={rejectCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all active:scale-95"
              title="Reject"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={answerCall}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shadow-lg transition-all active:scale-95"
              title="Answer"
            >
              <Phone className="w-7 h-7 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── OUTGOING / ACTIVE call UI ─────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div
        className="pointer-events-auto bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
        style={{ width: callType === "video" && mode === "active" ? 480 : 320, minHeight: callType === "video" && mode === "active" ? 400 : 200 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              {remoteInitial}
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">{remoteName}</p>
              <p className="text-white/50 text-xs">
                {mode === "active" ? fmt(duration) : status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {callType === "video" ? (
              <Video className="w-4 h-4 text-blue-400" />
            ) : (
              <PhoneCall className="w-4 h-4 text-blue-400" />
            )}
          </div>
        </div>

        {/* Video area */}
        {callType === "video" && (
          <div className="relative flex-1 bg-[#0D1117] min-h-[280px]">
            {/* Remote video (full) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Remote placeholder when no stream yet */}
            {mode !== "active" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0D1117]">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping scale-110" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                    {remoteInitial}
                  </div>
                </div>
                <p className="text-white/70 text-sm">{status}</p>
              </div>
            )}
            {/* Local video (PiP) */}
            <div className="absolute bottom-3 right-3 w-28 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!camOn && (
                <div className="absolute inset-0 bg-[#1E293B] flex items-center justify-center">
                  <VideoOff className="w-5 h-5 text-white/40" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Audio-only placeholder */}
        {callType === "audio" && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
            {mode === "active" ? (
              <>
                <div className="flex gap-1 items-end h-8">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                      style={{ height: `${20 + Math.random() * 20}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <p className="text-white/50 text-sm">{fmt(duration)}</p>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping scale-125" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                    {remoteInitial}
                  </div>
                </div>
                <p className="text-white/60 text-sm">{status}</p>
              </>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 px-4 py-4 bg-white/5 border-t border-white/10">
          <button
            onClick={toggleMic}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              micOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {callType === "video" && (
            <button
              onClick={toggleCam}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                camOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              title={camOn ? "Turn off camera" : "Turn on camera"}
            >
              {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          )}

          {/* Hang-up */}
          <button
            onClick={() => handleHangUp(true)}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all active:scale-95"
            title="End call"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
