import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { QUESTIONS, matchPlants } from '../data/plantFinder';

function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="finder-progress" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={total}>
      <div className="finder-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function PlantFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const isResults = step === QUESTIONS.length;

  function selectAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setStep((s) => s + 1);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function startOver() {
    setAnswers({});
    setStep(0);
  }

  const question = QUESTIONS[step];
  const { results, widened } = isResults ? matchPlants(answers) : { results: [], widened: false };

  return (
    <div className="category-page finder-page">
      <div className="category-hero">
        <p className="eyebrow">FIND YOUR PLANT</p>
        <h1>{isResults ? 'Your matches' : 'A few quick questions'}</h1>
        <p className="category-tagline">
          {isResults
            ? `Based on your answers, we picked ${results.length} plant${results.length === 1 ? '' : 's'} from our catalogue for you.`
            : "Answer four short questions and we'll point you to plants that actually fit your space."}
        </p>
      </div>

      {!isResults && (
        <div className="finder-quiz">
          <ProgressBar step={step} total={QUESTIONS.length} />
          <p className="finder-step-count">Question {step + 1} of {QUESTIONS.length}</p>
          <h2 className="finder-question">{question.question}</h2>
          <div className="finder-options">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`finder-option ${answers[question.id] === opt.value ? 'finder-option-selected' : ''}`}
                onClick={() => selectAnswer(question.id, opt.value)}
              >
                <span className="finder-option-label">{opt.label}</span>
                {opt.hint && <span className="finder-option-hint">{opt.hint}</span>}
              </button>
            ))}
          </div>
          <div className="finder-quiz-footer">
            {step > 0 && (
              <button type="button" className="finder-back" onClick={goBack}>
                ← Back
              </button>
            )}
            <Link to="/category/indoor-plants" className="finder-skip">
              Skip the quiz, browse everything →
            </Link>
          </div>
        </div>
      )}

      {isResults && (
        <div className="finder-results">
          {widened && (
            <p className="finder-widened-note">
              We didn&apos;t have a tight match on every answer, so we widened your results to our best picks for the space and budget you chose.
            </p>
          )}
          {results.length > 0 ? (
            <div className="product-grid" style={{ padding: '0 48px 48px' }}>
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="empty-state">
              We couldn&apos;t find a plant for that combination yet. Try different answers, or browse the full catalogue.
            </p>
          )}
          <div className="finder-results-footer">
            <button type="button" className="btn-load-more" onClick={startOver}>
              Start over
            </button>
            <Link to="/category/indoor-plants" className="finder-skip">
              Browse all plants →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantFinder;
