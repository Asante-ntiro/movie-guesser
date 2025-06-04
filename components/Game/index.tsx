import React, { useState, useCallback } from 'react';

interface Movie {
  emojis: string;
  answer: string;
  hint: string;
}

const movies: Movie[] = [
  { emojis: "🦁👑", answer: "The Lion King", hint: "Disney animated classic about a young prince" },
  { emojis: "🕷️👨", answer: "Spider-Man", hint: "Marvel superhero who shoots webs" },
  { emojis: "❄️👸", answer: "Frozen", hint: "Let it go, let it go..." },
  { emojis: "🍕🏠", answer: "Home Alone", hint: "Kevin defends his house" },
  { emojis: "🚢🧊💔", answer: "Titanic", hint: "Jack and Rose's tragic love story" },
  { emojis: "🦈", answer: "Jaws", hint: "You're gonna need a bigger boat" },
  { emojis: "🧙‍♂️💍", answer: "Lord of the Rings", hint: "One ring to rule them all" },
  { emojis: "🤖🚗", answer: "Transformers", hint: "Robots in disguise" },
  { emojis: "👻👻👻", answer: "Ghostbusters", hint: "Who you gonna call?" },
  { emojis: "🎪🐘", answer: "Dumbo", hint: "Flying elephant with big ears" }
];

const Game: React.FC = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Movie | null>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('Click "New Puzzle" to start!');
  const [isGameActive, setIsGameActive] = useState(false);

  const startNewPuzzle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    setCurrentPuzzle(movies[randomIndex]);
    setGuess('');
    setHintsUsed(0);
    setFeedback('');
    setIsGameActive(true);
  }, []);

  const checkAnswer = useCallback(() => {
    if (!currentPuzzle || !guess.trim()) {
      setFeedback('Please enter your guess!');
      return;
    }

    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedAnswer = currentPuzzle.answer.toLowerCase();

    if (
      normalizedGuess === normalizedAnswer ||
      normalizedGuess.replace(/[^a-z0-9]/g, '') === normalizedAnswer.replace(/[^a-z0-9]/g, '')
    ) {
      setFeedback(`🎉 Correct! It was "${currentPuzzle.answer}"`);
      setScore(prev => prev + (hintsUsed === 0 ? 10 : 5));
      setStreak(prev => prev + 1);
      setIsGameActive(false);
    } else {
      setFeedback('❌ Not quite right. Try again!');
      setStreak(0);
    }
  }, [currentPuzzle, guess, hintsUsed]);

  const showHint = useCallback(() => {
    if (currentPuzzle) {
      setFeedback(`💡 Hint: ${currentPuzzle.hint}`);
      setHintsUsed(prev => prev + 1);
    }
  }, [currentPuzzle]);

  const skipPuzzle = useCallback(() => {
    if (currentPuzzle) {
      setFeedback(`⏭️ The answer was: "${currentPuzzle.answer}"`);
      setStreak(0);
      setIsGameActive(false);
    }
  }, [currentPuzzle]);

  return (
    <div className="game-container">
      <h1 className="text-center">🔍 Emoji Story Decoder</h1>
      <p className="subtitle text-center">Can you decode the emoji story?</p>

      <div className="score-display">
        <div className="score-item">Score: {score}</div>
        <div className="score-item">Streak: {streak}</div>
      </div>

      <div className="emoji-display">
        {currentPuzzle ? currentPuzzle.emojis : 'Click "New Puzzle" to start!'}
      </div>

      <div className="input-section">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess..."
          disabled={!isGameActive}
          className="guess-input"
        />
      </div>

      <div className="feedback-section">
        {feedback && <p className="feedback">{feedback}</p>}
      </div>

      <div className="button-group">
        <button
          onClick={startNewPuzzle}
          disabled={isGameActive}
          className="game-button"
        >
          New Puzzle
        </button>
        <button
          onClick={checkAnswer}
          disabled={!isGameActive}
          className="game-button"
        >
          Submit Guess
        </button>
        <button
          onClick={showHint}
          disabled={!isGameActive}
          className="game-button"
        >
          Show Hint
        </button>
        <button
          onClick={skipPuzzle}
          disabled={!isGameActive}
          className="game-button"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default Game;