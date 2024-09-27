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
      signaling: ["wss://192.168.203.193:4444"],
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
