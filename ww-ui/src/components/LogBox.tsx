import { useCallback, useEffect, useRef, useState } from "react";

export const LogBox = ({ messages }: { messages: string[] }) => {
  const logBoxRef = useRef<HTMLDivElement>(null);
  const endOfBox = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = useCallback((smooth?: boolean) => {
    endOfBox.current?.scrollIntoView({
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
    scrollToBottom();
  }, [scrollToBottom, messages]);

  return (
    <div id="logBoxContainer">
      <div id="logBox" ref={logBoxRef} onScroll={handleScroll}>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
        <div ref={endOfBox} />
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
