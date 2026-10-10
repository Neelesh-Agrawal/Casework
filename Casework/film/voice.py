"""Generate the intro film voice-over: one clip per line, plus word timings for captions.

Run from the Casework folder:  python film/voice.py
Writes film/out/vo_XX.mp3 and film/out/vo.json (line durations + word offsets in seconds).
"""
import asyncio, json, os, subprocess
import edge_tts
import imageio_ffmpeg

VOICE = 'en-US-AndrewMultilingualNeural'
RATE = '+6%'   # a normal, conversational pace
import sys
CUT = sys.argv[1] if len(sys.argv) > 1 else 'intro'
OUT = os.path.join(os.path.dirname(__file__), 'out' if CUT == 'intro' else f'out-{CUT}')

HOOK_LINES = [
    "Your CEO wants three more fields on the signup form. By lunch.",
    "Every extra field costs you four to seven percent of signups.",
    "So what do you do? Pick one. Three seconds.",
    "It's B. Ask later, inside onboarding, after their first win. Same data. No lost signups.",
    "That's Casework. Two hundred and twenty-six real design calls like this one, from UX to designing for AI.",
    "It's free, no sign-up. Try your first case. Link's in the comments.",
]

SUMMARY_LINES = [
    "Good design isn't just pixels. It's the calls you make when everyone wants something different.",
    "Casework is a game that trains exactly that.",
    "You join a startup called Launchly as their product designer, and work through real situations, from UX and visual design, to UI craft, design systems and AI.",
    "Every decision shows you what happened next, and the principle behind it. So you don't just memorise design laws. You learn when to use them.",
    "Five tracks. Over two hundred real cases. And a new one every day.",
    "Casework. Sharpen your design judgment.",
]

LINES = [
    "It's your first day as a product designer at Launchly.",
    "Forty people. Eighteen thousand users. And everyone has an opinion about design.",
    "By ten a.m., the CEO wants three more fields on the signup form.",
    "Research says every field costs you signups. Sales says they need the data.",
    "So... what's your call?",
    "That's Casework. Real situations from a real product team. You make the call, see what happens, and learn the principle behind it.",
    "Five tracks. Over two hundred cases. From UX thinking to designing for AI.",
    "And a fresh case every day, so the habit sticks.",
    "Casework. Sharpen your design judgment.",
]


def duration(path):
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    r = subprocess.run([ff, '-i', path, '-f', 'null', '-'], capture_output=True, text=True)
    t = [l for l in r.stderr.splitlines() if 'time=' in l][-1]
    hms = t.split('time=')[1].split()[0]
    h, m, s = hms.split(':')
    return int(h) * 3600 + int(m) * 60 + float(s)


async def one(i, text):
    path = os.path.join(OUT, f'vo_{i:02d}.mp3')
    words = []
    com = edge_tts.Communicate(text, VOICE, rate=RATE, boundary='WordBoundary')
    with open(path, 'wb') as f:
        async for chunk in com.stream():
            if chunk['type'] == 'audio':
                f.write(chunk['data'])
            elif chunk['type'] == 'WordBoundary':
                words.append({'w': chunk['text'], 't': chunk['offset'] / 1e7, 'd': chunk['duration'] / 1e7})
    return {'text': text, 'file': os.path.basename(path), 'dur': duration(path), 'words': words}


async def main():
    os.makedirs(OUT, exist_ok=True)
    src = {'hook': HOOK_LINES, 'summary': SUMMARY_LINES}.get(CUT, LINES)
    lines = [await one(i, t) for i, t in enumerate(src)]
    with open(os.path.join(OUT, 'vo.json'), 'w', encoding='utf-8') as f:
        json.dump(lines, f, indent=1)
    for l in lines:
        print(f"{l['dur']:.2f}s  {l['text']}")

asyncio.run(main())
