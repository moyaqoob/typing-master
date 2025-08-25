import { useCallback, useEffect, useRef, useState } from "react";
import { chunkWords, sampleTexts } from "./lib/utils";

// Sample texts for the typing test

// Utility function to chunk words into lines

export const TypingTest = () => {
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentLine, setCurrentLine] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);

  const words = currentText.split(" ");
  const lines = chunkWords(words, 10);

  const timeRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    resetTest();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isStarted && !isFinished && timeLeft > 0) {
      //@ts-ignore
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

  // Calculate current line based on character position
  useEffect(() => {
    let charCount = 0;
    let lineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i].join(" ") + (i < lines.length - 1 ? " " : "");
      if (charCount + lineText.length > currentIndex) {
        lineIndex = i;
        break;
      }
      charCount += lineText.length;
    }

    setCurrentLine(Math.max(0, lineIndex - 1));
  }, [currentIndex, lines]);

  // Real-time WPM and accuracy calculation
  useEffect(() => {
    if (isStarted && currentIndex > 0) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      const wordsTyped = correctChars / 5; // standard: 5 characters = 1 word
      const currentWpm =
        timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
      const currentAccuracy =
        Math.round((correctChars / currentIndex) * 100) || 100;

      setWpm(currentWpm);
      setAccuracy(currentAccuracy);
    }
  }, [currentIndex, correctChars, startTime, isStarted]);

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
    setCurrentLine(0);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);

    // Focus input after reset
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current;
      }
    }, 100);
  }, [timeLimit]);

  const finishTest = () => {
    setIsFinished(true);
    setIsStarted(false);

    // Final calculations
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const finalWpm =
      timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0;
    const finalAccuracy =
      Math.round((correctChars / currentIndex) * 100) || 100;

    setWpm(finalWpm);
    setAccuracy(finalAccuracy);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;

    // Start test on first keystroke
    if (!isStarted && !isFinished) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    // Prevent typing beyond text length
    if (value.length > currentText.length) return;

    setUserInput(value);
    setCurrentIndex(value.length);

    // Count correct characters
    let correct = 0;
    let errorCount = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentText[i]) {
        correct++;
      } else {
        errorCount++;
      }
    }

    setCorrectChars(correct);
    setErrors(errorCount);

    // Check if test is complete
    if (value.length === currentText.length) {
      finishTest();
    }
  };

  const getCharacterColor = (charIndex: number, char: any) => {
    if (charIndex >= userInput.length) {
      return charIndex === currentIndex ? " text-black" : "text-gray-700";
    }

    if (userInput[charIndex] === char) {
      return "text-black";
    } else {
      return "text-red-400 bg-red-900/20";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent default behavior for certain keys
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#d8d2c3] text-white p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50"></div>
      </div>

      <div className="relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-1">
            <div className="flex p-3 items-center font-mono">
              <p
                className="text-3xl cursor-pointer font-bold bg-gradient-to-r from-cyan-600 via-black/45  to-pink-600 bg-clip-text text-transparent "
                onClick={resetTest}
              >
                typing master
              </p>
            </div>
           
          </div>
        </div>

        <div className="max-w-6xl mx-auto ">
          {/* Header Stats */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex space-x-12">
              <div className="text-center group">
                <div className="text-4xl font-bold text-[#916846] ">{wpm}</div>
                <div className="text-sm text-gray-900 font-medium">WPM</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-[#916846] ">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-900 font-medium">
                  Accuracy
                </div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-[#916846] ">
                  {errors}
                </div>
                <div className="text-sm text-gray-900 font-medium">Errors</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-[#916846] ">
                  {timeLeft}
                </div>
                <div className="text-sm text-gray-900 font-medium">Time</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setTimeLimit(30)}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  timeLimit === 30
                    ? "bg-gradient-to-r from-[#a68a64] to-[#b08968] text-white shadow-lg shadow-[#a68a64]/40"
                    : "bg-[#cfc8b8] text-gray-700 hover:bg-[#bfb7a4] border border-gray-400"
                }`}
              >
                30s
              </button>

              <button
                onClick={() => setTimeLimit(60)}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  timeLimit === 60
                    ? "bg-gradient-to-r from-[#a68a64] to-[#b08968] text-white shadow-lg shadow-[#d4a373]/40"
                    : "bg-[#cfc8b8] text-gray-700 hover:bg-[#bfb7a4] border border-gray-400"
                }`}
              >
                60s
              </button>

              <button
                onClick={() => setTimeLimit(120)}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  timeLimit === 120
                    ? "bg-gradient-to-r from-[#a68a64] to-[#b08968] text-white shadow-lg shadow-[#b5838d]/40"
                    : "bg-[#cfc8b8] text-gray-700 hover:bg-[#bfb7a4] border border-gray-400"
                }`}
              >
                120s
              </button>
            </div>
          </div>

          {/* Text Display */}
          <div className=" rounded-2xl  mb-8 min-h-40 border border-white/10 ">
            {!isStarted && !isFinished && (
              <div className="text-center text-gray-300 font-mono mb-6 text-lg ">
                Click on the input field below and start typing to begin the
                test
              </div>
            )}

            <div className="text-3xl min-w-6xl font-mono selection:bg-purple-500/30 overflow-hidden">
              {lines
                .slice(currentLine, currentLine + 3)
                .map((line, lineIndex) => {
                  const lineStart = lines
                    .slice(0, currentLine + lineIndex)
                    .reduce(
                      (acc, l) =>
                        acc + l.join(" ").length + (l.length > 0 ? 1 : 0),
                      0
                    );

                  const lineText = line.join(" ");

                  return (
                    <div key={lineIndex} className="leading-loose mb-2 h-10">
                      {lineText.split("").map((char, charIndex) => {
                        const globalIndex = lineStart + charIndex;

                        return (
                          <span
                            key={globalIndex}
                            className={`${getCharacterColor(
                              globalIndex,
                              char
                            )} transition-all  duration-75 ${
                              globalIndex === currentIndex
                                ? "border-l-3 animate-pulse shadow-lg"
                                : ""
                            }`}
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Input Field */}
          {!isFinished && (
            <div className="mb-8">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isFinished}
                placeholder={
                  isFinished ? " Test completed! " : "Start typing here..."
                }
                className="w-full p-4 text-2xl font-mono text-amber-950 bg-black/20 backdrop-blur-xl border-2 border-white/20 rounded-2xl  focus:outline-none disabled:opacity-50 placeholder:text-gray-500  transition-all duration-300 focus:shadow-2xl focus:shadow-cyan-400/10"
                autoFocus
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-6 mb-8">
            <button
              onClick={() => {
                resetTest();
                setTimeLeft(timeLimit);
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#540213] to-[#870509] text-white rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg "
            >
              Reset Test
            </button>

            {isFinished && (
              <button
                onClick={resetTest}
                className="px-8 py-4 bg-gradient-to-r from-[#540213] to-[#581214] text-white rounded-2xl hover:scale-105 transition-all duration-300 transform  font-semibold shadow-lg"
              >
                Try Again
              </button>
            )}
          </div>

          {/* Results */}
          {isFinished && (
            <div className="mt-12 p-3 rounded-2xl  border border-white/10 shadow-2xl animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="p-6 rounded-xl border border-yellow-400/50">
                  <div className="text-5xl font-bold text-black mb-2">
                    {wpm}
                  </div>
                  <div className="text-amber-800 font-medium">
                    Words per Minute
                  </div>
                </div>
                <div className="p-6 rounded-xl border border-green-400/50">
                  <div className="text-5xl font-bold text-black mb-2">
                    {accuracy}%
                  </div>
                  <div className="text-amber-800 font-medium">Accuracy</div>
                </div>
                <div className="p-6 rounded-xl border border-red-400/50">
                  <div className="text-5xl font-bold text-black mb-2">
                    {errors}
                  </div>
                  <div className="text-amber-800 font-medium">Errors</div>
                </div>
                <div className="p-6 rounded-xl border border-blue-400/50">
                  <div className="text-5xl font-bold text-black mb-2">
                    {correctChars}
                  </div>
                  <div className="text-amber-800 font-medium">
                    Correct Characters
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
