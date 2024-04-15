"use client";
import React, { useEffect, useState } from "react";
import quizData from "../../public/quiz.json";
import "daisyui/dist/full.css";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [violations, setViolations] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [marks, setMarks] = useState(0);
  const [storedData, setStoredData] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("quizData");
      return stored ? JSON.parse(stored) : null;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (storedData) {
      setCurrentQuestion(storedData.currentQuestion);
      setSelectedOption(storedData.selectedOption);
      setViolations(storedData.violations);
      setMarks(storedData.marks);
    }
  }, [storedData]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!isFullScreen);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [isFullScreen]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setViolations(violations + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [violations]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    if (selectedOption === quizData[currentQuestion].answer) {
      console.log(selectedOption);
      console.log(quizData[currentQuestion].answer);
      setMarks(marks + 1);
    }

    setCurrentQuestion(currentQuestion + 1);
    setSelectedOption(null);

    localStorage.setItem(
      "quizData",
      JSON.stringify({
        currentQuestion,
        selectedOption,
        violations,
        marks,
      })
    );
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Show a blocker pop if the test is not in full screen
  if (!isFullScreen) {
    return (
      <div className="fullscreen-blocker">
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-bold">
              Please take the test in full view mode.
            </h3>
          </div>
          <button className="btn btn-sm" onClick={handleFullScreen}>
            Enter Full Screen
          </button>
        </div>
      </div>
    );
  }

  // Show a violation count if the tab is not in focus
  if (document.visibilityState === "hidden") {
    return (
      <div role="alert" className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          You have {violations} violation(s) for moving from the screen. Try
          reloading or Esc
        </span>
      </div>
    );
  }

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setViolations(0);
    setMarks(0);
    localStorage.removeItem("quizData");
  };

  if (currentQuestion >= quizData.length) {
    return (
      <div className="quiz-container">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quiz Completed!</h2>
            <p>Your marks: {marks} / 10</p>
            <p>Violations: {violations}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={handleRestart}>
                Restart Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{quizData[currentQuestion].question}</h2>
          <p className="p-4 lg:p-8">
            {" "}
            {quizData[currentQuestion].options.map((option) => (
              <button
                className="p-2 btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
                key={option}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary "
              disabled={!selectedOption}
              onClick={handleNextQuestion}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
