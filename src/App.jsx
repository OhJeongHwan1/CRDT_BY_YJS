import { Editor } from "@monaco-editor/react";
import { useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

function App() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    const doc = new Y.Doc();

    const provider = new WebrtcProvider("test-room", doc, {
      signaling: ["ws://192.168.203.193:4002"], // 기본 시그널링 서버
      // 사용자 정의 STUN/TURN 서버 설정
      peerOpts: {
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" }, // Google STUN 서버
            // TURN 서버 설정 필요 시 추가
            // {
            //   urls: "turn:your.turn.server:3478",
            //   username: "your-username",
            //   credential: "your-password"
            // }
          ],
        },
      },
    });
    const type = doc.getText("monaco");

    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    console.log(provider.awareness);
  }

  return (
    <>
      <Editor
        height="100vh"
        width="100vw"
        theme="vs"
        onMount={handleEditorDidMount}
      />
    </>
  );
}

export default App;
