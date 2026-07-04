import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

// ── Track 2 (original v1) — untouched imports ──
import { CHAPTERS, SCENARIOS } from './gameData';
import { UI_TASKS } from './gameDataExtension';

// ── New track data ──
import { T1_CHAPTERS, T1_SCENARIOS, T1_UI_TASKS, T1_DNA_ADJ, getT1Ending } from './gameDataTrack1';
import { T3_CHAPTERS, T3_SCENARIOS, T3_UI_TASKS, T3_DNA_ADJ, getT3Ending } from './gameDataTrack3';
import { T4_CHAPTERS, T4_SCENARIOS, T4_UI_TASKS, T4_DNA_ADJ, getT4Ending } from './gameDataTrack4';
import { T5_CHAPTERS, T5_SCENARIOS, T5_UI_TASKS, T5_DNA_ADJ, getT5Ending } from './gameDataTrack5';

// ── Persistence ──
import { saveGame, loadGame, clearGame } from './hooks/usePersistence';
import {
  saveTrackGame, loadTrackGame, clearTrackGame, loadAllTrackSaves,
} from './hooks/usePersistenceMultiTrack';

// ── Progression ──
import { getLevel, INITIAL_DNA, updateDNA, computeTitles } from './hooks/useProgression';

// ── Components ──
import ScoreBar          from './components/ScoreBar';
import TrackBackButton   from './components/TrackBackButton';
import TrackSelectScreen from './components/TrackSelectScreen';
import SplashScreen      from './components/SplashScreen';
import ChapterIntro      from './components/ChapterIntro';
import ScenarioScreen    from './components/ScenarioScreen';
import ConsequenceScreen from './components/ConsequenceScreen';
import ChapterSummary    from './components/ChapterSummary';
import FinalScreen       from './components/FinalScreen';
import {
  getChapterUITask,
  resolveChapterSlot,
  getChapterPlayCount,
  countPlaySlotsBeforeChapter,
  getTotalPlaySlots,
  buildMissedItems,
} from './lib/uiTasks';
import { prepareResumeState } from './lib/resumeState';

// ── Constants ──
const SCREEN = {
  TRACK_SELECT:    'TRACK_SELECT',
  SPLASH:          'SPLASH',
  REFRESH_GUARD:   'REFRESH_GUARD',
  CHAPTER_INTRO:   'CHAPTER_INTRO',
  SCENARIO:        'SCENARIO',
  CONSEQUENCE:     'CONSEQUENCE',
  CHAPTER_SUMMARY: 'CHAPTER_SUMMARY',
  FINAL:           'FINAL',
};

// ── Track config ──────────────────────────────────────────────────────────────
const TRACK_CONFIG = {
  1: {
    label: 'Track 1 — Visual Foundations',
    chapters: T1_CHAPTERS,
    scenarios: T1_SCENARIOS,
    uiTasks:  T1_UI_TASKS,
    dnaAdj:   T1_DNA_ADJ,
    getEnding: getT1Ending,
    saveKey:  'track1',
  },
  2: {
    label: 'Track 2 — UX Thinking',
    chapters: CHAPTERS,
    scenarios: SCENARIOS,
    uiTasks:  UI_TASKS,
    dnaAdj:   null, // v1 DNA_ADJ lives in useProgression.js
    getEnding: null,
    saveKey:  'track2',
  },
  3: {
    label: 'Track 3 — UI Craft',
    chapters: T3_CHAPTERS,
    scenarios: T3_SCENARIOS,
    uiTasks:  T3_UI_TASKS,
    dnaAdj:   T3_DNA_ADJ,
    getEnding: getT3Ending,
    saveKey:  'track3',
  },
  4: {
    label: 'Track 4 — Systems Thinking',
    chapters: T4_CHAPTERS,
    scenarios: T4_SCENARIOS,
    uiTasks:  T4_UI_TASKS,
    dnaAdj:   T4_DNA_ADJ,
    getEnding: getT4Ending,
    saveKey:  'track4',
  },
  5: {
    label: 'Track 5 — The Studio',
    chapters: T5_CHAPTERS,
    scenarios: T5_SCENARIOS,
    uiTasks:  T5_UI_TASKS,
    dnaAdj:   T5_DNA_ADJ,
    getEnding: getT5Ending,
    saveKey:  'track5',
  },
};

const INITIAL_SCORE = 100;

function getTrackData(trackId) {
  return TRACK_CONFIG[trackId] || TRACK_CONFIG[2];
}

function getMaxScore(trackId) {
  const track = getTrackData(trackId);
  return INITIAL_SCORE + getTotalPlaySlots(track.chapters, track.scenarios, track.uiTasks) * 15;
}

const createChapterScoreMap = (chapters) =>
  chapters.reduce((acc, ch) => { acc[ch.id] = 0; return acc; }, {});

const getInitialGameState = (trackId) => {
  const { chapters } = getTrackData(trackId);
  return {
    screen:         SCREEN.SPLASH,
    score:          INITIAL_SCORE,
    chapter:        chapters[0]?.id || 1,
    scenarioIndex:  0,
    lastDelta:      null,
    showDelta:      false,
    selectedChoice: null,
    principles:     [],
    chapterScores:  createChapterScoreMap(chapters),
    choices:        [],
    dna:            { ...INITIAL_DNA },
    titles:         [],
    level:          'Junior Designer',
    activeUITask:   null,
    started:        false,
    activeTrack:    trackId,
  };
};

export default function App() {
  // Top-level screen: start at TRACK_SELECT
  const [activeTrack, setActiveTrack] = useState(null);
  const [topScreen, setTopScreen]     = useState(SCREEN.TRACK_SELECT);
  const [state, setState]             = useState(null);
  const [savedGame, setSavedGame]     = useState(null);

  // ── Load save when track is selected ────────────────────────────────────────
  const loadSaveForTrack = useCallback((trackId) => {
    if (trackId === 2) {
      return loadGame(); // v1 original save
    }
    return loadTrackGame(trackId);
  }, []);

  const saveSaveForTrack = useCallback((trackId, s) => {
    if (trackId === 2) {
      saveGame(s);
    } else {
      saveTrackGame(trackId, s);
    }
  }, []);

  const clearSaveForTrack = useCallback((trackId) => {
    if (trackId === 2) {
      clearGame();
    } else {
      clearTrackGame(trackId);
    }
  }, []);

  // ── Auto-save on state change ────────────────────────────────────────────────
  useEffect(() => {
    if (!state) return;
    if (state.started && state.screen !== SCREEN.SPLASH && state.screen !== SCREEN.REFRESH_GUARD) {
      saveSaveForTrack(state.activeTrack, state);
    }
  }, [state, saveSaveForTrack]);

  // ── beforeunload guard ───────────────────────────────────────────────────────
  useEffect(() => {
    const onBeforeUnload = () => {
      if (state?.started && state.screen !== SCREEN.SPLASH && state.screen !== SCREEN.FINAL) {
        saveSaveForTrack(state.activeTrack, state);
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [state, saveSaveForTrack]);

  // ── Derived values ───────────────────────────────────────────────────────────
  const trackData = activeTrack ? getTrackData(activeTrack) : null;
  const maxScore  = activeTrack ? getMaxScore(activeTrack) : 700;

  const narrativeChapterScenarios = state && trackData
    ? trackData.scenarios.filter(s => s.chapter === state.chapter)
    : [];
  const chapterUITask = state && trackData
    ? getChapterUITask(state.chapter, trackData.uiTasks)
    : null;
  const narrativeCount = narrativeChapterScenarios.length;
  const playIndex = state?.scenarioIndex ?? 0;
  const chapterSlot = resolveChapterSlot(playIndex, narrativeChapterScenarios, chapterUITask);
  const isOnUITask = chapterSlot.type === 'uitask';
  const currentScenario = chapterSlot.type === 'narrative' ? chapterSlot.scenario : null;
  const currentChapterTotal = getChapterPlayCount(narrativeCount, chapterUITask);
  const globalScenarioNumber = state && trackData
    ? countPlaySlotsBeforeChapter(trackData.chapters, state.chapter, trackData.scenarios, trackData.uiTasks) + playIndex + 1
    : 0;
  const totalPlayableCount = trackData
    ? getTotalPlaySlots(trackData.chapters, trackData.scenarios, trackData.uiTasks)
    : 0;

  const hasCompletedSave = Boolean(
    savedGame && (
      savedGame.completed ||
      savedGame.screen === SCREEN.FINAL ||
      (savedGame.choices?.length || 0) >= totalPlayableCount
    ),
  );

  const clampScore = useCallback((s) => Math.min(Math.max(s, 0), maxScore), [maxScore]);

  // Recover from invalid scenario slot (e.g. legacy saves) — avoid blank screen
  useEffect(() => {
    if (!state || !trackData || state.screen !== SCREEN.SCENARIO) return;
    if (currentScenario || isOnUITask) return;
    setState(prev => prev ? ({
      ...prev,
      screen: SCREEN.CHAPTER_SUMMARY,
      scenarioIndex: Math.max(0, currentChapterTotal - 1),
    }) : prev);
  }, [state, trackData, currentScenario, isOnUITask, currentChapterTotal]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleTrackSelect = useCallback((trackId) => {
    setActiveTrack(trackId);
    const save = loadSaveForTrack(trackId);
    setSavedGame(save);
    setState(getInitialGameState(trackId));
    setTopScreen(SCREEN.SPLASH);
  }, [loadSaveForTrack]);

  const handleBackToTrackSelect = useCallback(() => {
    if (state?.started && state.screen !== SCREEN.SPLASH) {
      saveSaveForTrack(state.activeTrack, state);
    }
    setActiveTrack(null);
    setState(null);
    setSavedGame(null);
    setTopScreen(SCREEN.TRACK_SELECT);
  }, [state, saveSaveForTrack]);

  const handleStart = useCallback(() => {
    clearSaveForTrack(activeTrack);
    setSavedGame(null);
    const { chapters } = getTrackData(activeTrack);
    setState({
      ...getInitialGameState(activeTrack),
      screen:  SCREEN.CHAPTER_INTRO,
      started: true,
    });
  }, [activeTrack, clearSaveForTrack]);

  const handleResume = useCallback(() => {
    if (!savedGame) return;
    const prepared = prepareResumeState(savedGame, getTrackData(activeTrack));
    setState({
      ...getInitialGameState(activeTrack),
      ...prepared,
      started: true,
      activeTrack,
    });
    setSavedGame(null);
  }, [savedGame, activeTrack]);

  const handleViewFinalReport = useCallback(() => {
    if (!savedGame) return;
    const prepared = prepareResumeState(
      { ...savedGame, screen: SCREEN.FINAL },
      getTrackData(activeTrack),
    );
    setState({
      ...getInitialGameState(activeTrack),
      ...prepared,
      screen: SCREEN.FINAL,
      activeUITask: null,
      started: true,
      activeTrack,
    });
    setSavedGame(null);
  }, [savedGame, activeTrack]);

  const handleChapterIntroContinue = useCallback(() => {
    setState(prev => ({ ...prev, screen: SCREEN.SCENARIO }));
  }, []);

  const handleChoiceSelected = useCallback((choiceId, uiTaskOverride) => {
    if (!state) return;

    const isBonusTask = Boolean(uiTaskOverride);
    const scenario = isBonusTask ? null : currentScenario;
    if (!isBonusTask && !scenario) return;

    let delta, consequence;
    if (uiTaskOverride) {
      const deltasMap = { A: 15, B: 5, C: -10 };
      delta       = deltasMap[choiceId] ?? 5;
      consequence = uiTaskOverride.consequences[choiceId];
    } else {
      const choice = scenario.choices.find(c => c.id === choiceId);
      if (!choice) return;
      delta       = choice.delta;
      consequence = scenario.consequences[choiceId];
    }

    if (!consequence) return;

    const recordId = isBonusTask ? uiTaskOverride.id : scenario.id;
    const newScore  = clampScore(state.score + delta);
    // For track 2 (v1) pass null externalAdj so useProgression uses its internal DNA_ADJ
    const dnaAdj    = trackData?.dnaAdj || null;
    const newDNA    = updateDNA(state.dna, recordId, choiceId, dnaAdj);
    const newLevel  = getLevel(newScore).name;
    const newPrinciples = [
      ...state.principles,
      { principle: consequence.principle, lesson: consequence.lesson },
    ];
    const newTitles = computeTitles(newDNA, newPrinciples);

    setState(prev => ({
      ...prev,
      screen:         SCREEN.CONSEQUENCE,
      score:          newScore,
      lastDelta:      delta,
      showDelta:      true,
      selectedChoice: choiceId,
      chapterScores: {
        ...prev.chapterScores,
        [prev.chapter]: (prev.chapterScores[prev.chapter] || 0) + Math.max(0, delta),
      },
      principles:   newPrinciples,
      choices:      [...prev.choices, { scenarioId: recordId, choiceId, isUITask: isBonusTask }],
      dna:          newDNA,
      level:        newLevel,
      titles:       newTitles,
      activeUITask: uiTaskOverride || null,
    }));

    setTimeout(() => setState(prev => prev ? { ...prev, showDelta: false } : prev), 3000);
  }, [currentScenario, state, trackData, clampScore]);

  const handleConsequenceNext = useCallback(() => {
    const nextIndex = (state?.scenarioIndex || 0) + 1;
    if (nextIndex >= currentChapterTotal) {
      setState(prev => prev ? ({
        ...prev,
        screen:        SCREEN.CHAPTER_SUMMARY,
        scenarioIndex: Math.max(0, currentChapterTotal - 1),
        activeUITask:  null,
      }) : prev);
    } else {
      setState(prev => prev ? ({
        ...prev,
        screen:         SCREEN.SCENARIO,
        scenarioIndex:  nextIndex,
        lastDelta:      null,
        selectedChoice: null,
        activeUITask:   null,
      }) : prev);
    }
  }, [currentChapterTotal, state?.scenarioIndex]);

  const handleChapterSummaryContinue = useCallback(() => {
    const totalChapters = trackData?.chapters.length || 0;
    const chapterIdx    = trackData?.chapters.findIndex(c => c.id === state?.chapter) ?? -1;
    const isLastChapter = chapterIdx >= totalChapters - 1;

    if (!isLastChapter && trackData) {
      const nextChapter = trackData.chapters[chapterIdx + 1];
      setState(prev => prev ? ({
        ...prev,
        chapter:        nextChapter.id,
        scenarioIndex:  0,
        screen:         SCREEN.CHAPTER_INTRO,
        selectedChoice: null,
        lastDelta:      null,
        activeUITask:   null,
      }) : prev);
    } else {
      setState(prev => prev ? ({ ...prev, screen: SCREEN.FINAL }) : prev);
    }
  }, [state?.chapter, trackData]);

  const handlePlayAgain = useCallback(() => {
    clearSaveForTrack(activeTrack);
    setSavedGame(null);
    setState(getInitialGameState(activeTrack));
  }, [activeTrack, clearSaveForTrack]);

  // ── Effective consequence for ConsequenceScreen ──────────────────────────────
  const consequenceSlot = state?.screen === SCREEN.CONSEQUENCE
    ? resolveChapterSlot(state.scenarioIndex ?? 0, narrativeChapterScenarios, chapterUITask)
    : chapterSlot;
  const consequenceScenario = consequenceSlot.type === 'narrative' ? consequenceSlot.scenario : null;

  const effectiveConsequence = state?.activeUITask
    ? state.activeUITask.consequences?.[state.selectedChoice]
    : consequenceScenario?.consequences?.[state?.selectedChoice]
      ?? currentScenario?.consequences?.[state?.selectedChoice];

  const showScoreBar = state &&
    state.screen !== SCREEN.SPLASH &&
    state.screen !== SCREEN.REFRESH_GUARD;

  // ── Render ───────────────────────────────────────────────────────────────────

  // Track select is handled at the top level, before any game state
  if (topScreen === SCREEN.TRACK_SELECT) {
    return (
      <TrackSelectScreen
        onSelectTrack={handleTrackSelect}
        savedTracks={loadAllTrackSaves()}
      />
    );
  }

  if (!state || !trackData) return null;

  const { chapters, scenarios, uiTasks } = trackData;
  const TOTAL_CHAPTERS  = chapters.length;
  const TOTAL_SCENARIOS = getTotalPlaySlots(chapters, scenarios, uiTasks);

  // 1-based sequential chapter display number (101 → 1, 102 → 2, etc.)
  const chapterDisplayNum = chapters.findIndex(c => c.id === state?.chapter) + 1;

  return (
    <>
      {showScoreBar && (
        <ScoreBar
          score={state.score}
          maxScore={maxScore}
          delta={state.lastDelta}
          showDelta={state.showDelta}
          onBack={handleBackToTrackSelect}
        />
      )}

      {state.screen === SCREEN.SPLASH && (
        <SplashScreen
          onStart={handleStart}
          onResume={handleResume}
          onViewFinalReport={handleViewFinalReport}
          canViewFinalReport={hasCompletedSave}
          savedGame={savedGame}
          chapterCount={TOTAL_CHAPTERS}
          scenarioCount={TOTAL_SCENARIOS}
          principleCount={TOTAL_SCENARIOS}
          maxRep={maxScore}
          onBackToTracks={handleBackToTrackSelect}
          chapters={chapters}
          scenarios={scenarios}
        />
      )}

      {state.screen === SCREEN.REFRESH_GUARD && (
        <div className="refresh-screen">
          <TrackBackButton onBack={handleBackToTrackSelect} className="track-back-btn--splash" />
          <div className="refresh-screen__icon" aria-hidden="true">🔄</div>
          <h1 className="refresh-screen__title">Page was refreshed</h1>
          <p className="refresh-screen__desc">Your progress was saved. Resume right where you left off.</p>
          <button className="btn btn-primary" onClick={handleResume}>Resume Game →</button>
          <button className="btn btn-ghost" onClick={handlePlayAgain} style={{ marginTop: 12 }}>Start Over</button>
        </div>
      )}

      {state.screen === SCREEN.CHAPTER_INTRO && (
        <ChapterIntro
          key={`ci-${state.chapter}`}
          chapter={chapters.find(c => c.id === state.chapter)}
          chapterNumber={chapterDisplayNum}
          totalChapters={TOTAL_CHAPTERS}
          onContinue={handleChapterIntroContinue}
        />
      )}

      {state.screen === SCREEN.SCENARIO && (currentScenario || isOnUITask) && (
        <ScenarioScreen
          key={`sc-${state.chapter}-${state.scenarioIndex}`}
          scenario={currentScenario}
          scenarioIndex={playIndex}
          chapterScenarioCount={currentChapterTotal}
          chapterNum={state.chapter}
          globalScenarioNumber={globalScenarioNumber}
          totalScenarios={TOTAL_SCENARIOS}
          onChoose={handleChoiceSelected}
          uiTask={isOnUITask ? chapterUITask : null}
          isUITask={isOnUITask}
        />
      )}

      {state.screen === SCREEN.CONSEQUENCE && effectiveConsequence && (
        <ConsequenceScreen
          key={`con-${state.chapter}-${state.scenarioIndex}-${state.selectedChoice}`}
          scenario={state.activeUITask ? null : consequenceScenario}
          consequence={effectiveConsequence}
          choiceId={state.selectedChoice}
          delta={state.lastDelta}
          onNext={handleConsequenceNext}
          uiTask={state.activeUITask}
        />
      )}

      {state.screen === SCREEN.CHAPTER_SUMMARY && (
        <ChapterSummary
          key={`cs-${state.chapter}`}
          chapterNum={chapterDisplayNum}
          chapterId={state.chapter}
          chapterTitle={chapters.find(c => c.id === state.chapter)?.title}
          trackId={activeTrack}
          trackLabel={trackData.label}
          totalScore={state.score}
          maxScore={maxScore}
          chapterScore={state.chapterScores[state.chapter] || 0}
          chapterScenarioCount={currentChapterTotal}
          totalChapters={TOTAL_CHAPTERS}
          dna={state.dna}
          titles={state.titles}
          onContinue={handleChapterSummaryContinue}
        />
      )}

      {state.screen === SCREEN.FINAL && (
        <FinalScreen
          totalScore={state.score}
          maxScore={maxScore}
          principles={state.principles}
          totalScenarios={TOTAL_SCENARIOS}
          dna={state.dna}
          titles={state.titles}
          choices={state.choices}
          scenarios={scenarios}
          uiTasks={uiTasks}
          onPlayAgain={handlePlayAgain}
          getEnding={trackData?.getEnding || undefined}
          trackId={activeTrack}
          trackLabel={trackData.label}
        />
      )}
    </>
  );
}
