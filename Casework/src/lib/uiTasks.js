/** Narrative questions to play before the chapter UI task is inserted. */
export const UI_TASK_INSERT_AFTER = 3;

export function getChapterUITask(chapterNum, uiTasks) {
  if (!uiTasks) return null;
  return uiTasks[`uitask_ch${chapterNum}`] ?? null;
}

export function findUITaskById(uiTasks, taskId) {
  if (!uiTasks || !taskId) return null;
  return Object.values(uiTasks).find(t => t.id === taskId) ?? null;
}

export function countUITasks(uiTasks) {
  if (!uiTasks) return 0;
  return Object.keys(uiTasks).length;
}

export function getChapterPlayCount(narrativeCount, uiTask) {
  return narrativeCount + (uiTask ? 1 : 0);
}

export function getUITaskInsertIndex(narrativeCount, uiTask) {
  if (!uiTask) return -1;
  return Math.min(UI_TASK_INSERT_AFTER, narrativeCount);
}

/**
 * Map a chapter play index to either a narrative scenario or a UI task.
 * UI task is inserted after the first N narrative questions without removing any.
 */
export function resolveChapterSlot(playIndex, narrativeScenarios, uiTask) {
  const narrativeCount = narrativeScenarios.length;
  const insertAt = getUITaskInsertIndex(narrativeCount, uiTask);

  if (insertAt >= 0 && playIndex === insertAt) {
    return { type: 'uitask', task: uiTask, narrativeIndex: null };
  }

  const narrativeIndex = insertAt >= 0 && playIndex > insertAt
    ? playIndex - 1
    : playIndex;

  return {
    type: 'narrative',
    scenario: narrativeScenarios[narrativeIndex] || null,
    narrativeIndex,
  };
}

export function isUITaskSlot(playIndex, narrativeCount, uiTask) {
  const insertAt = getUITaskInsertIndex(narrativeCount, uiTask);
  return insertAt >= 0 && playIndex === insertAt;
}

export function countPlaySlotsBeforeChapter(chapters, chapterId, scenarios, uiTasks) {
  let total = 0;
  for (const ch of chapters) {
    if (ch.id >= chapterId) break;
    const narratives = scenarios.filter(s => s.chapter === ch.id);
    const task = getChapterUITask(ch.id, uiTasks);
    total += getChapterPlayCount(narratives.length, task);
  }
  return total;
}

/** Build the full "What You Missed" list — narrative scenarios + UI tasks. */
export function buildMissedItems(choices, scenarios, uiTasks) {
  if (!choices?.length) return [];

  const items = [];

  for (const c of choices) {
    if (c.isUITask) {
      const task = findUITaskById(uiTasks, c.scenarioId);
      if (!task || c.choiceId === 'A') continue;
      const best = task.consequences?.A;
      const yours = task.consequences?.[c.choiceId];
      if (!best || !yours) continue;
      items.push({
        title: `${task.title} (UI Task)`,
        context: (task.narration || task.instruction || '').replace(/\s+/g, ' ').trim(),
        youChose: yours.lesson || yours.story,
        bestWas: best.lesson || 'Perfect performance on this exercise',
        principle: best.principle,
        lesson: best.lesson,
      });
      continue;
    }

    const sc = scenarios.find(s => s.id === c.scenarioId);
    if (!sc?.choices) continue;
    const chosen = sc.choices.find(ch => ch.id === c.choiceId);
    const best = sc.choices.reduce((a, b) => (b.delta > a.delta ? b : a));
    if (!chosen || !best || chosen.id === best.id) continue;

    items.push({
      title: sc.title,
      context: (sc.narration || '').replace(/\s+/g, ' ').trim(),
      youChose: chosen.text,
      bestWas: best.text,
      principle: sc.consequences?.[best.id]?.principle,
      lesson: sc.consequences?.[best.id]?.lesson,
    });
  }

  return items;
}

export function getTotalPlaySlots(chapters, scenarios, uiTasks) {
  return chapters.reduce((sum, ch) => {
    const narratives = scenarios.filter(s => s.chapter === ch.id);
    const task = getChapterUITask(ch.id, uiTasks);
    return sum + getChapterPlayCount(narratives.length, task);
  }, 0);
}
