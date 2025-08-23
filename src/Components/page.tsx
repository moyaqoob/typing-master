import { useCallback, useEffect, useRef, useState } from "react";
import { chunkWords, sampleTexts } from "./lib/utils";
export const TypingTest = () => {
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);

  const [currentLine, setCurrentLine] = useState(0);

  const words = currentText.split(" ");
  const lines = chunkWords(words, 8);

  const inputRef = useRef(null);
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize with random text
  useEffect(() => {
    resetTest();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isStarted && !isFinished && timeLeft > 0) {
      timeRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted) {
      finishTest();
    }
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, [isStarted, isFinished, timeLeft]);

  const resetTest = useCallback(() => {
    const randomText =
      sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setCurrentText(randomText);
    setUserInput("");
    setCurrentIndex(0);
    setIsStarted(false);
    setIsFinished(false);
    setErrors(0);
    setTimeLeft(timeLimit);
    setStartTime(0);
    setEndTime(0);
  }, [timeLimit]);

  const finishTest = () => {
    setIsFinished(true);
    setIsStarted(false);
    setEndTime(Date.now());
  };
  const startTest = () => {
    if (!isStarted) {
      setIsStarted(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      // only allow normal typing keys
      if (e.key.length === 1) {
        const expectedChar = currentText[currentIndex];
        const isCorrect = e.key === expectedChar;

        if (!isCorrect) {
          setErrors((prev) => prev + 1);
        }

        setUserInput((prev) => prev + e.key);
        setCurrentIndex((prev) => prev + 1);
      }

      if (e.key === "Backspace" && currentIndex > 0) {
        setUserInput((prev) => prev.slice(0, -1));
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentText, isFinished]);

  return (
    <div>
      <div className="flex mx-15 my-15 ">
        <div className="flex flex-col space-y-2">
          {lines.slice(currentLine, currentLine + 3).map((line, lineIndex) => (
            <div key={lineIndex} className="flex">
              {line.map((char, index) => {
                let error = "text-red-400"
                const isTyped = index<currentIndex;
                
                let color =" "
                let correct = "text-orange-500"
                if(isTyped){
                  color =  char == userInput[index] ? correct : error
                }

                return (
                  <span
                    key={index}
                    className={`text-xl font-bold font-rubik mr-3 $ ${color}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
