import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { QUESTIONS, matchPlants } from '../data/plantFinder';
import { useLanguage } from '../context/LanguageContext';

// Maps each QUESTIONS entry (data/plantFinder.js, English source of truth
// for the matching logic) to its translation keys in
// src/i18n/translations.js's `finder` section, so the quiz UI is fully
// translated while the matching logic itself stays keyed on the stable
// English `value`s.
const QUESTION_KEYS = {
  space: { question: 'qSpace', options: { indoor: ['qSpaceIndoor', 'qSpaceIndoorHint'], outdoor: ['qSpaceOutdoor', 'qSpaceOutdoorHint'] } },
  size: { question: 'qSize', options: { small: ['qSizeSmall', 'qSizeSmallHint'], medium: ['qSizeMedium', 'qSizeMediumHint'], large: ['qSizeLarge', 'qSizeLargeHint'] } },
  experience: { question: 'qExperience', options: { beginner: ['qExperienceBeginner', 'qExperienceBeginnerHint'], experienced: ['qExperienceExperienced', 'qExperienceExperiencedHint'] } },
  budget: { question: 'qBudget', options: { low: ['qBudgetLow', null], mid: ['qBudgetMid', null], high: ['qBudgetHigh', null] } },
};

function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="finder-progress" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={total}>
      <div className="finder-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function PlantFinder() {
  const { t } = useLanguage();
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
  const keys = question ? QUESTION_KEYS[question.id] : null;
  const { results, widened } = isResults ? matchPlants(answers) : { results: [], widened: false };

  return (
    <div className="category-page finder-page">
      <div className="category-hero">
        <p className="eyebrow">{t('finder.eyebrow')}</p>
        <h1>{isResults ? t('finder.resultsTitle') : t('finder.questionsTitle')}</h1>
        <p className="category-tagline">
          {isResults
            ? t('finder.resultsSummary').replace('{count}', results.length).replace('{plural}', results.length === 1 ? '' : 's')
            : t('finder.questionsTagline')}
        </p>
      </div>

      {!isResults && (
        <div className="finder-quiz">
          <ProgressBar step={step} total={QUESTIONS.length} />
          <p className="finder-step-count">{t('finder.questionOf').replace('{n}', step + 1).replace('{total}', QUESTIONS.length)}</p>
          <h2 className="finder-question">{t(`finder.${keys.question}`)}</h2>
          <div className="finder-options">
            {question.options.map((opt) => {
              const [labelKey, hintKey] = keys.options[opt.value];
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`finder-option ${answers[question.id] === opt.value ? 'finder-option-selected' : ''}`}
                  onClick={() => selectAnswer(question.id, opt.value)}
                >
                  <span className="finder-option-label">{t(`finder.${labelKey}`)}</span>
                  {hintKey && <span className="finder-option-hint">{t(`finder.${hintKey}`)}</span>}
                </button>
              );
            })}
          </div>
          <div className="finder-quiz-footer">
            {step > 0 && (
              <button type="button" className="finder-back" onClick={goBack}>
                {t('finder.back')}
              </button>
            )}
            <Link to="/category/indoor-plants" className="finder-skip">
              {t('finder.skipQuiz')}
            </Link>
          </div>
        </div>
      )}

      {isResults && (
        <div className="finder-results">
          {widened && (
            <p className="finder-widened-note">
              {t('finder.widenedNote')}
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
              {t('finder.noResults')}
            </p>
          )}
          <div className="finder-results-footer">
            <button type="button" className="btn-load-more" onClick={startOver}>
              {t('finder.startOver')}
            </button>
            <Link to="/category/indoor-plants" className="finder-skip">
              {t('finder.browseAll')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantFinder;
