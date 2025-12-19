import { useState, useEffect } from "react";
import { testAPI, resultAPI } from "../services/api";

function TestLeaderboard({ testId, availableTests }) {
  const [testScores, setTestScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLeaderboard = async () => {
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

    if (testId) loadLeaderboard();
  }, [testId]);

  const selectedTest = availableTests.find(t => t._id === testId);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div>
      <h4>{selectedTest?.title}</h4>
      {testScores.length === 0 ? (
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
  );
}

function User({ start, setSelectedTest }) {
  const [activeTab, setActiveTab] = useState("tests");
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  const loadTests = async () => {
    try {
      const tests = await testAPI.getAll();
      setAvailableTests(tests);
    } catch (error) {
      console.error("Failed to load tests");
    }
  };

  const loadUserResults = async () => {
    try {
      const results = await resultAPI.getUserResults(userId);
      setUserResults(results);
    } catch (error) {
      console.error("Failed to load user results");
    }
  };

  const hasUserTakenTest = (testId) => {
    return userResults.some(result => result.test && result.test._id === testId);
  };

  const startTest = (test) => {
    if (hasUserTakenTest(test._id)) {
      alert("You have already taken this test!");
      return;
    }
    localStorage.setItem("activeTest", JSON.stringify(test.questions));
    setSelectedTest(test);
    start();
  };



  useEffect(() => {
    loadTests();
    if (userId) loadUserResults();
  }, [userId]);

  return (
    <div className="container">
      <div className="card user-dashboard">
        <h2>User Dashboard</h2>
        
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === "tests" ? "active" : ""}`}
            onClick={() => setActiveTab("tests")}
          >
            Tests
          </button>
          <button 
            className={`tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
        </div>

        {activeTab === "tests" && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{availableTests.length}</div>
                <div className="stat-label">Available Tests</div>
              </div>
            </div>

            {!availableTests.length ? (
              <div>
                <p className="no-test-message">No tests available</p>
                <p>Please wait for an admin to create tests</p>
              </div>
            ) : (
              <div>
                <h3>Available Tests</h3>
                <div className="test-list">
                  {availableTests.map(test => (
                    <div key={test._id} className="test-card">
                      <div className="test-title">{test.title}</div>
                      <div className="test-info">
                        {test.questions.length} questions • Created: {new Date(test.createdAt).toLocaleDateString()}
                      </div>
                      {hasUserTakenTest(test._id) ? (
                        <button className="btn btn-secondary" disabled>
                          Already Taken
                        </button>
                      ) : (
                        <button 
                          className="btn btn-success" 
                          onClick={() => startTest(test)}
                        >
                          Start Test
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "leaderboard" && (
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
                
                {selectedTestId && <TestLeaderboard testId={selectedTestId} availableTests={availableTests} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
