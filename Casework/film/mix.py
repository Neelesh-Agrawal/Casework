"""Mix the voice-over over the music (with the music ducking under the voice), then mux with the
rendered video.  Run after voice.py, music.py and record.mjs.
Writes film/out/audio.wav and film/out/casework-intro.mp4.
"""
import json, os, subprocess, wave
import numpy as np

HERE = os.path.dirname(__file__)
import sys
CUT = sys.argv[1] if len(sys.argv) > 1 else 'intro'
OUT = os.path.join(HERE, 'out' if CUT == 'intro' else f'out-{CUT}')
SR = 48000
FF = open(os.path.join(OUT, 'ffmpeg-path.txt')).read().strip()
if CUT == 'summary':
    VO_START = [0.5, 6.2, 10.3, 21.6, 30.0, 35.4]   # keep in sync with Summary.jsx
    DUR = 40
elif CUT == 'hook':
    VO_START = [0.4, 5.0, 9.3, 15.7, 22.9, 30.4]   # keep in sync with Hook.jsx
    DUR = 36.5
else:
    VO_START = [1.5, 5.4, 11.6, 16.4, 21.6, 25.0, 35.3, 42.1, 47.3]   # keep in sync with Film.jsx
    DUR = 53


def decode(path, channels):
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-ar', str(SR), '-ac', str(channels), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype='<i2').astype(float) / 32768
    return a.reshape(-1, channels)


n = int(DUR * SR)
vo = np.zeros(n)
lines = json.load(open(os.path.join(OUT, 'vo.json'), encoding='utf-8'))
for start, line in zip(VO_START, lines):
    clip = decode(os.path.join(OUT, line['file']), 1)[:, 0]
    i = int(start * SR)
    clip = clip[: n - i]
    vo[i:i + len(clip)] += clip
vo /= np.max(np.abs(vo)) / 0.9

music = decode(os.path.join(OUT, 'music.wav'), 2)[:n]
music = np.pad(music, ((0, n - len(music)), (0, 0)))

# Sidechain: follow the voice level (fast attack, slow release) and dip the music under it.
level = np.abs(vo)
block = SR // 100
env = np.repeat([level[i:i + block].max() for i in range(0, n, block)], block)[:n]
smooth = np.zeros_like(env)
k_att, k_rel = 0.6, 0.004
for i in range(0, n, block):
    prev = smooth[i - 1] if i else 0
    target = env[i]
    k = k_att if target > prev else k_rel
    smooth[i:i + block] = prev + (target - prev) * k
duck = 1 - 0.55 * np.clip(smooth / 0.25, 0, 1)
music_gain = 0.42
mix = music * (music_gain * duck)[:, None] + vo[:, None] * 0.95
mix = np.tanh(mix * 1.1) / 1.1
mix /= np.max(np.abs(mix)) / 0.95

with wave.open(os.path.join(OUT, 'audio.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio.wav')

video = os.path.join(OUT, 'video.mp4')
if os.path.exists(video):
    final = os.path.join(OUT, 'casework-intro.mp4' if CUT == 'intro' else f'casework-{CUT}.mp4')
    subprocess.run([FF, '-y', '-v', 'error', '-i', video, '-i', os.path.join(OUT, 'audio.wav'),
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], check=True)
    print(final)
