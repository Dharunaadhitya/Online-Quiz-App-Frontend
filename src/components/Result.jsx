import { useEffect } from "react";
import { resultAPI } from "../services/api";

function Result({ score, testTitle, goHome, selectedTest }) {
  const test = JSON.parse(localStorage.getItem("activeTest")) || [];
  const percentage = test.length ? Math.round((score / test.length) * 100) : 0;
  const userId = localStorage.getItem("userId");
  
  useEffect(() => {
    const submitResult = async () => {
      if (userId && selectedTest) {
        try {
          const resultData = {
            user: userId,
            test: selectedTest._id,
            score,
            totalQuestions: test.length,
            answers: []
          };
          
          await resultAPI.submit(resultData);
          console.log("Result submitted successfully");
        } catch (error) {
          console.error("Failed to submit result:", error);
        }
      }
    };
    
    submitResult();
  }, []);
  
  return (
    <div className="container">
      <div className="card result-container">
        <h2>Quiz Complete!</h2>
        {testTitle && <h3 style={{color: '#2c5aa0', marginBottom: '20px'}}>{testTitle}</h3>}
        <div className="score-display">{score}/{test.length}</div>
        <p style={{fontSize: '20px', margin: '20px 0'}}>You scored {percentage}%</p>
        <p style={{fontSize: '18px', marginBottom: '30px'}}>
          {percentage >= 70 ? "Great job! " : "Keep practicing! "}
        </p>
        <button className="btn btn-primary" onClick={goHome}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Result;
