"""
Generate 2 upbeat, clean electronic sample audio tracks (WAV) for testing
FreshersBridge video reels and shorts without external downloads.
"""

import math
import struct
import wave
import os

def generate_beat_track(output_path, tempo_bpm=128, duration_sec=8.0, style="synthwave"):
    sample_rate = 44100
    total_samples = int(sample_rate * duration_sec)
    beat_interval = 60.0 / tempo_bpm
    samples_per_beat = int(sample_rate * beat_interval)
    
    # Precompute frames
    left_channel = [0.0] * total_samples
    right_channel = [0.0] * total_samples
    
    # Chord notes (Hz)
    if style == "synthwave":
        chords = [
            [220.00, 261.63, 329.63], # Am
            [174.61, 220.00, 261.63], # F
            [261.63, 329.63, 392.00], # C
            [196.00, 246.94, 293.66], # G
        ]
        bass_notes = [110.0, 87.31, 130.81, 98.0]
    else: # upbeat tech house
        chords = [
            [293.66, 349.23, 440.00], # Dm
            [220.00, 261.63, 329.63], # Am
            [261.63, 329.63, 392.00], # C
            [246.94, 311.13, 369.99], # Bdim
        ]
        bass_notes = [73.42, 55.0, 65.41, 61.74]
        
    num_beats = int(duration_sec / beat_interval)
    
    for beat in range(num_beats):
        beat_start_sample = beat * samples_per_beat
        chord_idx = (beat // 4) % len(chords)
        chord = chords[chord_idx]
        bass_freq = bass_notes[chord_idx]
        
        # 1. Kick drum on every beat
        kick_samples = min(int(sample_rate * 0.22), total_samples - beat_start_sample)
        for i in range(kick_samples):
            idx = beat_start_sample + i
            if idx < total_samples:
                t = i / sample_rate
                # Frequency drops from 150Hz to 40Hz
                f = 150.0 * math.exp(-t * 28.0) + 40.0
                env = math.exp(-t * 16.0)
                val = math.sin(2.0 * math.pi * f * t) * env * 0.7
                left_channel[idx] += val
                right_channel[idx] += val
                
        # 2. Hi-hat on off-beats (8th notes)
        hat_start = beat_start_sample + samples_per_beat // 2
        hat_samples = min(int(sample_rate * 0.06), total_samples - hat_start)
        for i in range(hat_samples):
            idx = hat_start + i
            if idx < total_samples:
                t = i / sample_rate
                env = math.exp(-t * 45.0)
                # Pseudo noise using high frequency sines
                val = (math.sin(t * 14000) * 0.5 + math.sin(t * 18500) * 0.5) * env * 0.25
                left_channel[idx] += val * 0.8
                right_channel[idx] += val * 1.2

        # 3. Punchy Synth Bassline (16th notes)
        for sub in range(4):
            sub_start = beat_start_sample + (sub * samples_per_beat) // 4
            sub_len = min(int(sample_rate * 0.12), total_samples - sub_start)
            for i in range(sub_len):
                idx = sub_start + i
                if idx < total_samples:
                    t = i / sample_rate
                    env = math.exp(-t * 18.0)
                    val = math.sin(2.0 * math.pi * bass_freq * t) * env * 0.4
                    val += math.sin(4.0 * math.pi * bass_freq * t) * (env ** 2) * 0.15
                    left_channel[idx] += val
                    right_channel[idx] += val

        # 4. Melodic Arp Chords (16th note pattern)
        for sub in range(4):
            arp_note = chord[sub % len(chord)]
            arp_start = beat_start_sample + (sub * samples_per_beat) // 4
            arp_len = min(int(sample_rate * 0.15), total_samples - arp_start)
            pan = 0.5 + 0.4 * math.sin(beat + sub)
            for i in range(arp_len):
                idx = arp_start + i
                if idx < total_samples:
                    t = i / sample_rate
                    env = math.exp(-t * 12.0)
                    val = (math.sin(2.0 * math.pi * arp_note * t) + 
                           0.4 * math.sin(4.0 * math.pi * arp_note * t)) * env * 0.22
                    left_channel[idx] += val * (1.0 - pan)
                    right_channel[idx] += val * pan

    # Apply Master Fade In & Fade Out
    fade_in_len = int(sample_rate * 0.2)
    fade_out_len = int(sample_rate * 0.5)
    for i in range(fade_in_len):
        fade = i / fade_in_len
        left_channel[i] *= fade
        right_channel[i] *= fade
    for i in range(fade_out_len):
        idx = total_samples - 1 - i
        fade = i / fade_out_len
        left_channel[idx] *= fade
        right_channel[idx] *= fade
        
    # Normalize & pack into 16-bit WAV
    max_amp = max(max(abs(x) for x in left_channel), max(abs(x) for x in right_channel), 0.001)
    scale = 32767.0 * 0.90 / max_amp
    
    with wave.open(output_path, 'w') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        
        packed_frames = bytearray()
        for i in range(total_samples):
            l_val = int(max(min(left_channel[i] * scale, 32767), -32768))
            r_val = int(max(min(right_channel[i] * scale, 32767), -32768))
            packed_frames.extend(struct.pack('<hh', l_val, r_val))
        wf.writeframes(packed_frames)

    print(f"Generated clean upbeat track: {output_path} ({duration_sec}s, {tempo_bpm} BPM)")

if __name__ == "__main__":
    audio_dir = os.path.join(os.path.dirname(__file__), "assets", "audio")
    os.makedirs(audio_dir, exist_ok=True)
    
    track1 = os.path.join(audio_dir, "trending_beat_synthwave.wav")
    track2 = os.path.join(audio_dir, "trending_beat_tech_house.wav")
    
    generate_beat_track(track1, tempo_bpm=128, duration_sec=8.0, style="synthwave")
    generate_beat_track(track2, tempo_bpm=126, duration_sec=8.0, style="tech_house")
