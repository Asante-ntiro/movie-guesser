import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

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
  const [feedback, setFeedback] = useState('Guess the movie from the emojis!');
  const [isGameActive, setIsGameActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctAnimation, setCorrectAnimation] = useState(false);

  // Start a new puzzle when component mounts
  useEffect(() => {
    startNewPuzzle();
  }, []);

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
      setShowConfetti(true);
      setCorrectAnimation(true);
      // Load next puzzle after a short delay
      setTimeout(() => {
        setShowConfetti(false);
        setCorrectAnimation(false);
        startNewPuzzle();
      }, 2000);
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
      // Load next puzzle after a short delay
      setTimeout(() => {
        startNewPuzzle();
      }, 1500);
    }
  }, [currentPuzzle]);

  return (
    <div className="game-container">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <div className="text-center space-y-4 mb-8">
        <h1 className="flex items-center justify-center gap-3 text-4xl font-bold bg-white/50 backdrop-blur-sm rounded-lg p-4 inline-flex mx-auto text-gray-800">
          <span className="text-4xl">🔍</span>
          Emoji Story Decoder
        </h1>
        <p className="subtitle text-lg text-gray-600 font-medium bg-white/30 backdrop-blur-sm rounded-lg p-3 inline-block">
          Can you decode the emoji story?
        </p>
      </div>

      <div className="score-display bg-white/50 backdrop-blur-sm rounded-lg p-4">
        <div className="score-item flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-sm text-gray-600">Score</div>
            <div className="font-bold text-xl">{score}</div>
          </div>
        </div>
        <div className="score-item flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-sm text-gray-600">Streak</div>
            <div className="font-bold text-xl">{streak}</div>
          </div>
        </div>
      </div>

      <div className={`emoji-display ${correctAnimation ? 'emoji-correct' : ''}`}>
        {currentPuzzle ? currentPuzzle.emojis : 'Get ready to guess!'}
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
        <button
          onClick={checkAnswer}
          disabled={!isGameActive}
          className="game-button"
        >
          Submit
        </button>
      </div>

      <div className="feedback-section">
        {feedback && <p className="feedback">{feedback}</p>}
      </div>

      <div className="button-group">
        {!isGameActive && !currentPuzzle && (
          <button
            onClick={startNewPuzzle}
            className="game-button"
          >
            Start Game
          </button>
        )}

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