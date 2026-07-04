import {
  getChapterUITask,
  getChapterPlayCount,
  getUITaskInsertIndex,
  findUITaskById,
} from './uiTasks';

/** Saves with UI task inserted at play index 3 use this version. */
export const PLAY_SLOT_VERSION = 2;

const LEGACY_UI_SLOT = 2;

const RESUMABLE_SCREENS = new Set([
  'SCENARIO',
  'CONSEQUENCE',
  'CHAPTER_SUMMARY',
  'CHAPTER_INTRO',
  'FINAL',
]);

/** Convert pre-v2 narrative-only index to play-slot index. */
export function migrateLegacyPlayIndex(oldIndex, narrativeCount, uiTask) {
  if (!uiTask) return oldIndex;
  const newInsert = getUITaskInsertIndex(narrativeCount, uiTask);
  if (oldIndex < LEGACY_UI_SLOT) return oldIndex;
  if (oldIndex === LEGACY_UI_SLOT) return newInsert;
  return oldIndex + 1;
}

/**
 * Normalize a loaded save so resume lands on a valid, visible game screen.
 */
export function prepareResumeState(savedGame, trackData) {
  if (!savedGame || !trackData) return savedGame;

  const narratives = trackData.scenarios.filter(s => s.chapter === savedGame.chapter);
  const uiTask = getChapterUITask(savedGame.chapter, trackData.uiTasks);
  const chapterTotal = getChapterPlayCount(narratives.length, uiTask);

  let scenarioIndex = savedGame.scenarioIndex ?? 0;
  let screen = savedGame.screen || 'SCENARIO';

  if (savedGame.playSlotVersion !== PLAY_SLOT_VERSION) {
    scenarioIndex = migrateLegacyPlayIndex(scenarioIndex, narratives.length, uiTask);
  }

  if (!RESUMABLE_SCREENS.has(screen)) {
    screen = 'SCENARIO';
  }

  if (scenarioIndex >= chapterTotal) {
    if (screen === 'SCENARIO' || screen === 'CONSEQUENCE') {
      screen = 'CHAPTER_SUMMARY';
    }
    scenarioIndex = Math.max(0, chapterTotal - 1);
  } else if (scenarioIndex < 0) {
    scenarioIndex = 0;
  }

  if (screen === 'CONSEQUENCE' && !savedGame.selectedChoice) {
    screen = 'SCENARIO';
  }

  const activeUITask = savedGame.activeUITaskId
    ? findUITaskById(trackData.uiTasks, savedGame.activeUITaskId)
    : null;

  return {
    ...savedGame,
    screen,
    scenarioIndex,
    playSlotVersion: PLAY_SLOT_VERSION,
    activeUITask,
    activeUITaskId: savedGame.activeUITaskId ?? null,
  };
}

export function buildGameSavePayload(state) {
  return {
    score:           state.score,
    chapter:         state.chapter,
    scenarioIndex:   state.scenarioIndex,
    screen:          state.screen,
    completed:       state.screen === 'FINAL',
    principles:      state.principles,
    chapterScores:   state.chapterScores,
    choices:         state.choices || [],
    dna:             state.dna || {},
    titles:          state.titles || [],
    level:           state.level || 'Junior Designer',
    selectedChoice:  state.selectedChoice ?? null,
    lastDelta:       state.lastDelta ?? null,
    activeUITaskId:  state.activeUITask?.id ?? null,
    playSlotVersion: PLAY_SLOT_VERSION,
    savedAt:         Date.now(),
  };
}
