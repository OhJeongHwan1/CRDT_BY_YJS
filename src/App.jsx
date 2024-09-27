// App.js
import React, { useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./App.css";

function App() {
  const quillRef = useRef(null);

  useEffect(() => {
    // 1. Yjs 문서 생성
    const ydoc = new Y.Doc();

    // 2. WebSocket 프로바이더 설정 (서버 주소와 방 이름 지정)
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      "my-room",
      ydoc
    );

    // 3. Yjs 문서에 텍스트 형식 추가
    const ytext = ydoc.getText("quill");

    // 4. Quill 에디터 인스턴스 생성
    const quillInstance = new Quill(quillRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ],
      },
    });

    // 5. Quill 에디터와 Yjs 문서를 바인딩하여 실시간 협업 구현
    const binding = new QuillBinding(ytext, quillInstance);

    // 연결 상태 출력 (디버깅용)
    provider.on("status", (event) => {
      console.log(event.status); // "connected" or "disconnected"
    });

    // Cleanup 함수: 컴포넌트가 언마운트될 때 리소스를 정리합니다.
    return () => {
      binding.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, []);

  return (
    <div className="App" style={{ textAlign: "center", margin: "20px" }}>
      <h1>React Collaborative Editor</h1>
      <div
        style={{
          height: "400px",
          margin: "20px auto",
          maxWidth: "800px",
          background: "#fff",
          border: "1px solid black",
        }}
        ref={quillRef}
        className="editor"
      />
    </div>
  );
}

export default App;
