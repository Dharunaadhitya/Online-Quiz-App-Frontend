import { useState } from "react";

function Quiz({ finish, testTitle }) {
  const questions = JSON.parse(localStorage.getItem("activeTest")) || [];
  const [i, setI] = useState(0);
  const [ans, setAns] = useState({});

  const submit = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (ans[idx] === q.answer) score++;
    });
    finish(score);
  };

  if (!questions.length) return <div className="container"><div className="card"><h3>No test available</h3></div></div>;

  return (
    <div className="container">
      <div className="card quiz-container">
        {testTitle && <h2 style={{textAlign: 'center', marginBottom: '20px', color: '#667eea'}}>{testTitle}</h2>}
        <div className="question-header">
          <div className="question-number">Question {i + 1} of {questions.length}</div>
          <div className="question-text">{questions[i].question}</div>
        </div>
        
        <div className="options-container">
          {questions[i].options.map(option => (
            <label 
              key={option} 
              className={`option-item ${ans[i] === option ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`question-${i}`}
                value={option}
                checked={ans[i] === option}
                onChange={() => setAns({ ...ans, [i]: option })}
                className="option-radio"
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>

        <div className="quiz-navigation">
          {i > 0 && <button className="btn btn-secondary" onClick={() => setI(i - 1)}>Previous</button>}
          {i < questions.length - 1
            ? <button className="btn btn-primary" onClick={() => setI(i + 1)}>Next Question</button>
            : <button className="btn btn-success" onClick={submit}>Submit Test</button>}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
