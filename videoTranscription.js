// videoTranscription.js

// Function to send video file to transcription API
async function transcribeVideo(videoFile, language) {
    try {
        // Call to transcription API: sending video file and selected language
        // Returns JSON with timestamped text segments for dubbing
        const response = await fetch("https://api.example.com/transcribe", {
            method: "POST",
            body: JSON.stringify({ video: videoFile, lang: language }),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        return data.segments; // Array of transcription segments
    } catch (error) {
        console.error("Error transcribing video:", error);
        return [];
    }
}

// Function to merge overlapping transcription segments
function mergeSegments(segments) {
    // Complex logic: merging overlapping transcription segments
    // Needed to prevent duplicate audio playback in the dubbing timeline
    let merged = [];
    segments.forEach(segment => {
        if (merged.length === 0 || segment.start > merged[merged.length - 1].end) {
            merged.push(segment);
        } else {
            merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, segment.end);
            merged[merged.length - 1].text += " " + segment.text;
        }
    });
    return merged;
}

// Function to play dubbed audio segments
function playDubbedAudio(segments) {
    // Workaround for browser autoplay restrictions on audio
    // Must trigger playback after user interaction to avoid errors
    const audioContext = new AudioContext();
    segments.forEach(seg => {
        const audio = new Audio(seg.audioUrl);
        audio.play().catch(err => console.warn("Playback prevented by browser:", err));
    });
}

// TODO: Optimize this loop for large videos
// Currently iterates over all segments; may slow down for long videos
function prepareTranscriptionTimeline(segments) {
    const timeline = [];
    for (let i = 0; i < segments.length; i++) {
        timeline.push({ start: segments[i].start, end: segments[i].end });
    }
    return timeline;
}
