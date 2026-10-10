"""Original background track for the intro film: warm lo-fi, 92 BPM, F major.
Follows the film: soft intro (walking in), groove (the office), a breath on "what's your call?",
a lift with bells for the reveal, and a ringing final chord on the end card.
Writes film/out/music.wav (48 kHz stereo).
"""
import os
import numpy as np
import wave

import sys
CUT = sys.argv[1] if len(sys.argv) > 1 else 'intro'
SR = 48000
BPM = 100 if CUT == 'hook' else 92
BEAT = 60 / BPM
DUR = {'hook': 37.5, 'summary': 41}.get(CUT, 54)
N = int(DUR * SR)
rng = np.random.default_rng(7)
OUT = os.path.join(os.path.dirname(__file__), 'out' if CUT == 'intro' else f'out-{CUT}')

L = np.zeros(N)
R = np.zeros(N)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def _fft_filter(x, f, kind):
    """Gentle filter in the frequency domain (a smooth 12 dB/oct style roll-off)."""
    x = np.asarray(x, dtype=float)
    spec = np.fft.rfft(x, axis=-1)
    freqs = np.fft.rfftfreq(x.shape[-1], 1 / SR)
    r = (freqs / f) ** 2
    gain = 1 / np.sqrt(1 + r ** 2) if kind == 'low' else r / np.sqrt(1 + r ** 2)
    return np.fft.irfft(spec * gain, n=x.shape[-1], axis=-1)


def lp(x, f, order=2):
    return _fft_filter(x, f, 'low')


def hp(x, f, order=2):
    return _fft_filter(x, f, 'high')


def env(n, a, d, sustain=0.0, curve=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    return e * (sustain + (1 - sustain) * np.exp(-curve * t / d))


def rhodes(m, length, vel=1.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = hz(m)
    mod = np.sin(2 * np.pi * f * 14 * t) * np.exp(-t * 9) * 0.9          # the bell-ish tine attack
    tone = np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.8 * t)
    return tone * env(n, 0.004, 1.6, 0.15, 2.2) * trem * vel * 0.16


def bell(m, length=1.6, vel=1.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12)
    return s * env(n, 0.002, 0.9, 0.0, 3.5) * vel * 0.09


def pad(ms, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in ms:
        for det in (-0.07, 0.07):
            f = hz(m) * 2 ** (det / 12)
            s += 2 * ((t * f) % 1) - 1                                           # saw
    s = lp(s, 900)
    a = np.minimum(1, t / 1.2) * np.minimum(1, (length - t) / 1.0)
    return s * np.clip(a, 0, 1) * 0.018


def bass(m, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * hz(m) * t) + 0.2 * np.sin(2 * np.pi * hz(m) * 2 * t)
    return s * env(n, 0.01, length * 1.2, 0.5, 1.5) * 0.22


def kick():
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 0.55


def snare():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    noise = hp(lp(rng.standard_normal(n), 6000), 1200)
    body = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 30)
    return (noise * np.exp(-t * 16) * 0.22 + body * 0.15)


def hat(open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t * (14 if open_ else 70)) * 0.05


# F major: Fmaj9 / Am7 / Dm9 / Bbmaj7 (I iii vi IV), one bar each
CHORDS = [
    (41, [57, 60, 64, 67]),   # F  : A C E G
    (45, [55, 60, 64, 67]),   # Am : G C E G (Am7 voicing)
    (38, [57, 60, 64, 65]),   # Dm : A C E F (Dm9-ish)
    (46, [57, 62, 65, 69]),   # Bb : A D F A
]
BAR = 4 * BEAT
SWING = 0.06

# sections (seconds)
if CUT == 'summary':
    # soft keys under the opening, groove from the logo, bells for 'how it works', ring out on the end card
    DRUMS_IN, BREAK_A, BREAK_B, LIFT, END = 6.2, 99, 99, 21.6, 35.4
elif CUT == 'hook':
    # hits straight away, holds its breath for the 3-2-1, lands on the reveal
    DRUMS_IN, BREAK_A, BREAK_B, LIFT, END = 0.0, 12.3, 15.6, 15.6, 30.6
else:
    DRUMS_IN, BREAK_A, BREAK_B, LIFT, END = 5.3, 21.4, 24.6, 24.6, 46.9

bar_start = 0.0
b = 0
while bar_start < DUR:
    root, notes = CHORDS[b % 4]
    end_section = bar_start >= END
    # chords: on 1, and a soft push on the "and" of 2
    if bar_start < DUR - 1:
        ring = 6.0 if end_section else BAR + 0.4
        for k, m in enumerate(notes):
            add(rhodes(m, ring, 0.9 if k else 1.0), bar_start + k * 0.012, pan=-0.3 + k * 0.2)
        if not end_section and not (BREAK_A <= bar_start < BREAK_B):
            for k, m in enumerate(notes[1:]):
                add(rhodes(m, BEAT * 1.6, 0.55), bar_start + 1.5 * BEAT + SWING + k * 0.01, pan=0.2)
        add(pad([n - 12 for n in notes[:3]], BAR + 1.0), bar_start, pan=0)
    # bass
    if bar_start >= DRUMS_IN - 0.1 and not end_section:
        add(bass(root, BEAT * 1.8), bar_start)
        add(bass(root + 7 if b % 2 else root + 12, BEAT * 0.9), bar_start + 2.5 * BEAT + SWING)
    # drums
    for beat in range(4):
        t = bar_start + beat * BEAT
        if t < DRUMS_IN or t >= END or BREAK_A <= t < BREAK_B:
            continue
        if beat in (0, 2):
            add(kick(), t)
        if beat == 2 and b % 2:
            add(kick(), t + BEAT * 0.5 + SWING, gain=0.6)
        if beat in (1, 3):
            add(snare(), t, pan=0.05)
        add(hat(), t, pan=0.35)
        add(hat(beat == 3 and b % 2 == 1), t + BEAT / 2 + SWING, pan=0.35, gain=0.8)
    # bells from the reveal onwards
    if LIFT <= bar_start < END:
        mel = [72, 76, 79, 77] if b % 2 == 0 else [74, 72, 69, 72]
        for k, m in enumerate(mel):
            add(bell(m), bar_start + k * BEAT + (SWING if k % 2 else 0), pan=0.4 - k * 0.25)
    bar_start += BAR
    b += 1

# a gentle riser into "what's your call?" and a soft swell into the reveal
for start, length in ((BREAK_A - 1.6, 1.6), (BREAK_B - 1.4, 1.4)):
    n = int(length * SR)
    t = np.arange(n) / SR
    sw = hp(rng.standard_normal(n), 2000) * (t / length) ** 2 * 0.05
    add(sw, start)
# final sparkle on the end card
for k, m in enumerate([77, 81, 84, 88]):
    add(bell(m, 3.0, 0.9), END + 0.5 + k * 0.11, pan=-0.3 + k * 0.2)

if CUT == 'hook':
    for k in range(3):                                   # clock ticks on 3, 2, 1
        n = int(0.08 * SR)
        tt = np.arange(n) / SR
        tick = np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 60) * 0.25
        add(tick, 12.5 + k)
        add(tick * 0.5, 13.0 + k)
    n = int(1.2 * SR)                                    # the reveal: a soft boom
    tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-tt * 20)) / SR) * np.exp(-tt * 3) * 0.6, BREAK_B)

# a whisper of vinyl so it feels warm, not sterile
crackle = (rng.random(N) > 0.9993) * rng.standard_normal(N) * 0.05
hiss = lp(rng.standard_normal(N), 4000) * 0.0025
L += crackle + hiss
R += crackle + hiss

mix = np.stack([L, R], axis=1)
mix = lp(mix.T, 11000).T                       # soften the top end (lo-fi)
fade_in = np.minimum(1, np.arange(N) / (SR * 1.2))
fade_out = np.clip((DUR - np.arange(N) / SR) / 3.0, 0, 1)
mix *= (fade_in * fade_out)[:, None]
mix = np.tanh(mix * 1.4) / 1.4                  # gentle glue
mix /= np.max(np.abs(mix)) / 0.89
os.makedirs(OUT, exist_ok=True)
with wave.open(os.path.join(OUT, 'music.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('music.wav', DUR, 's')
