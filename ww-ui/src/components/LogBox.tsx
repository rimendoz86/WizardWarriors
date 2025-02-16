import { useCallback, useEffect, useRef, useState } from "react";

export const LogBox = ({ messages }: { messages: string[] }) => {
  const logBoxRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = useCallback((smooth?: boolean) => {
    if (!logBoxRef.current) return;

    logBoxRef.current.scrollTo({
      top: logBoxRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const isAtBottom =
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) < 1;

    setAutoScroll(isAtBottom);
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [autoScroll, scrollToBottom, messages]);

  return (
    <div id="logBoxContainer">
      <div id="logBox" ref={logBoxRef} onScroll={handleScroll}>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      {!autoScroll && (
        <button
          className="jumpToBottom"
          onClick={() => {
            scrollToBottom(true);
            setAutoScroll(true);
          }}
          style={{ visibility: autoScroll ? "hidden" : "visible" }}
        >
          Scroll to Bottom
        </button>
      )}
    </div>
  );
};
