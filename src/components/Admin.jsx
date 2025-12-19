import { useState, useEffect } from "react";
import { testAPI, resultAPI } from "../services/api";
import questionBank from "../data/questionBank";

function AdminLeaderboard({ availableTests }) {
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [testScores, setTestScores] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLeaderboard = async (testId) => {
    setLoading(true);
    try {
      const results = await resultAPI.getLeaderboard(testId);
      setTestScores(results);
    } catch (error) {
      setTestScores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTestId) loadLeaderboard(selectedTestId);
  }, [selectedTestId]);

  const selectedTest = availableTests.find(t => t._id === selectedTestId);

  return (
    <div>
      <h3>Test-wise Leaderboard</h3>
      {availableTests.length === 0 ? (
        <p>No tests available</p>
      ) : (
        <div>
          <div className="admin-tabs">
            {availableTests.map(test => (
              <button 
                key={test._id}
                className={`tab-btn ${selectedTestId === test._id ? "active" : ""}`}
                onClick={() => setSelectedTestId(test._id)}
              >
                {test.title}
              </button>
            ))}
          </div>
          
          {selectedTestId && (
            <div>
              <h4>{selectedTest?.title}</h4>
              {loading ? (
                <p>Loading leaderboard...</p>
              ) : testScores.length === 0 ? (
                <p>No scores for this test yet</p>
              ) : (
                <div>
                  {testScores.map((entry, index) => (
                    <div key={index} className="test-card">
                      <div className="test-title">#{index + 1} {entry.user.username}</div>
                      <div className="test-info">
                        Score: {entry.score}/{entry.totalQuestions} ({Math.round((entry.score/entry.totalQuestions)*100)}%) • {new Date(entry.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Admin() {
  const [activeTab, setActiveTab] = useState("generate");
  const [count, setCount] = useState(10);
  const [customTest, setCustomTest] = useState({ title: "", questions: [] });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: ""
  });

  const [testName, setTestName] = useState("");
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const createTest = async () => {
    setLoading(true);
    try {
      const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
      const questions = shuffled.slice(0, count);
      const title = testName || `Random Test (${count} questions)`;
      
      const testData = {
        title,
        questions,
        createdBy: localStorage.getItem("userId")
      };
      
      await testAPI.create(testData);
      setTestName("");
      alert("Test created successfully!");
      loadTests();
    } catch (error) {
      alert("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.answer || currentQuestion.options.some(opt => !opt)) {
      alert("Please fill all fields");
      return;
    }
    
    setCustomTest(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }]
    }));
    
    setCurrentQuestion({ question: "", options: ["", "", "", ""], answer: "" });
  };

  const createCustomTest = async () => {
    if (!customTest.title || customTest.questions.length === 0) {
      alert("Please add a title and at least one question");
      return;
    }
    
    setLoading(true);
    try {
      const testData = {
        title: customTest.title,
        questions: customTest.questions,
        createdBy: localStorage.getItem("userId")
      };
      
      await testAPI.create(testData);
      setCustomTest({ title: "", questions: [] });
      alert("Custom test created successfully!");
      loadTests();
    } catch (error) {
      alert("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  const loadTests = async () => {
    try {
      const tests = await testAPI.getAll();
      setAvailableTests(tests);
    } catch (error) {
      console.error("Failed to load tests");
    }
  };

  const deleteTest = async (testId) => {
    try {
      await testAPI.delete(testId);
      alert("Test deleted successfully!");
      loadTests();
    } catch (error) {
      alert("Failed to delete test");
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  return (
    <div className="container">
      <div className="card admin-panel">
        <h2>Admin Panel</h2>
        
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === "generate" ? "active" : ""}`} onClick={() => setActiveTab("generate")}>
            Generate Test</button>
          <button 
            className={`tab-btn ${activeTab === "custom" ? "active" : ""}`} onClick={() => setActiveTab("custom")}>
            Create Custom Test
          </button>
          <button 
            className={`tab-btn ${activeTab === "manage" ? "active" : ""}`} onClick={() => setActiveTab("manage")}>
            Manage Tests
          </button>
          <button 
            className={`tab-btn ${activeTab === "leaderboard" ? "active" : ""}`} onClick={() => setActiveTab("leaderboard")}>
            Leaderboard
          </button>
        </div>

        {activeTab === "generate" && (
          <div>
            <h3>Generate Random Test</h3>
            <div className="form-group">
              <label>Test Name (optional):</label>
              <input 
                className="input-field"
                value={testName}
                onChange={e => setTestName(e.target.value)}
                placeholder="Enter custom name or leave blank for default"
              />
            </div>
            <div className="admin-controls">
              <label>Number of questions:</label>
              <input 
                className="input-field" 
                type="number" 
                value={count} 
                onChange={e => setCount(e.target.value)}
                min="1"
                max={questionBank.length}
              />
              <button className="btn btn-success" onClick={createTest}>Generate Test</button>
            </div>
            <p>Total available questions: {questionBank.length}</p>
          </div>
        )}

        {activeTab === "custom" && (
          <div className="question-form">
            <h3>Create Custom Test</h3>
            
            <div className="form-group">
              <label>Test Title:</label>
              <input 
                className="input-field"
                value={customTest.title}
                onChange={e => setCustomTest(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter test title"
              />
            </div>
            <div className="form-group">
              <label>Question:</label>
              <textarea 
                className="textarea-field"
                value={currentQuestion.question}
                onChange={e => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question"
              />
            </div>

            <div className="form-group">
              <label>Options:</label>
              <div className="options-input">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <input 
                      className="input-field"
                      value={option}
                      onChange={e => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <input 
                      type="radio"
                      name="correctAnswer"
                      checked={currentQuestion.answer === option}
                      onChange={() => setCurrentQuestion(prev => ({ ...prev, answer: option }))}
                    />
                    <label>Correct</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-controls">
              <button className="btn btn-secondary" onClick={addQuestion}>Add Question</button>
              <button className="btn btn-success" onClick={createCustomTest}>Create Test</button>
            </div>

            <p>Questions added: {customTest.questions.length}</p>
          </div>
        )}

        {activeTab === "manage" && (
          <div>
            <h3>Available Tests</h3>
            <div className="test-list">
              {availableTests.map(test => (
                <div key={test._id} className="test-card">
                  <div className="test-title">{test.title}</div>
                  <div className="test-info">
                    {test.questions.length} questions • Created: {new Date(test.createdAt).toLocaleDateString()}
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={() => deleteTest(test._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <AdminLeaderboard availableTests={availableTests} />
        )}
      </div>
    </div>
  );
}

export default Admin;
