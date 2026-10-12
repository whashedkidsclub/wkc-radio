// ========================================
// WKC RADIO PLAYER
// ========================================

const audio = new Audio();

const playButton = document.querySelector(".play");
const previousButton = document.querySelector(".controls button:nth-child(1)");
const nextButton = document.querySelector(".controls button:nth-child(3)");
const repeatButton = document.querySelector(".controls button:nth-child(4)");

const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");

const currentTimeDisplay = document.querySelector(".time span:first-child");
const durationDisplay = document.querySelector(".time span:last-child");

const trackTitle = document.querySelector(".track-title");
const artistDisplay = document.querySelector(".artist");

const playlistTracks = document.querySelectorAll(".track");


// ========================================
// PLAYLIST
// ========================================

const tracks = [
    {
        title: "WKC Radio — Welcome",
        artist: "Whashed Kids Club",
        file: "audio/wkc-welcome.mp3"
    },

    {
        title: "The Velvet Suns — Static Dreams",
        artist: "The Velvet Suns",
        file: "audio/static-dreams.mp3"
    },

    {
        title: "Sunshine Static",
        artist: "WKC Radio",
        file: "audio/sunshine-static.mp3"
    },

    {
        title: "WKC After Hours",
        artist: "Whashed Kids Club",
        file: "audio/wkc-after-hours.mp3"
    }
];


// ========================================
// PLAYER STATE
// ========================================

let currentTrack = 0;
let repeat = false;


// ========================================
// LOAD TRACK
// ========================================

function loadTrack(index) {

    currentTrack = index;

    const track = tracks[currentTrack];

    audio.src = track.file;

    trackTitle.textContent = track.title;
    artistDisplay.textContent = track.artist;

    currentTimeDisplay.textContent = "00:00";
    durationDisplay.textContent = "00:00";

    progressBar.style.width = "0%";

    updatePlaylist();

}


// ========================================
// PLAY / PAUSE
// ========================================

async function togglePlay() {

    if (audio.paused) {

        try {

            await audio.play();

            playButton.textContent = "❚❚";

        } catch (error) {

            console.log("Unable to play audio:", error);

        }

    } else {

        audio.pause();

        playButton.textContent = "▶";

    }

}


// ========================================
// PREVIOUS TRACK
// ========================================

function previousTrack() {

    if (currentTrack > 0) {

        loadTrack(currentTrack - 1);

    } else {

        loadTrack(tracks.length - 1);

    }

    audio.play();

    playButton.textContent = "❚❚";

}


// ========================================
// NEXT TRACK
// ========================================

function nextTrack() {

    if (currentTrack < tracks.length - 1) {

        loadTrack(currentTrack + 1);

    } else {

        loadTrack(0);

    }

    audio.play();

    playButton.textContent = "❚❚";

}


// ========================================
// UPDATE PLAYLIST
// ========================================

function updatePlaylist() {

    playlistTracks.forEach((track, index) => {

        track.classList.toggle(
            "active",
            index === currentTrack
        );

    });

}


// ========================================
// CLICK PLAYLIST TRACK
// ========================================

playlistTracks.forEach((track, index) => {

    track.addEventListener("click", () => {

        loadTrack(index);

        audio.play();

        playButton.textContent = "❚❚";

    });

});


// ========================================
// 10 SECOND SKIP BACK
// ========================================

function skipBackward() {

    audio.currentTime = Math.max(
        0,
        audio.currentTime - 10
    );

}


// ========================================
// 10 SECOND SKIP FORWARD
// ========================================

function skipForward() {

    audio.currentTime = Math.min(
        audio.duration || 0,
        audio.currentTime + 10
    );

}


// ========================================
// PROGRESS BAR
// ========================================

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    const percentage =
        (audio.currentTime / audio.duration) * 100;

    progressBar.style.width = percentage + "%";

    currentTimeDisplay.textContent =
        formatTime(audio.currentTime);

});


audio.addEventListener("loadedmetadata", () => {

    durationDisplay.textContent =
        formatTime(audio.duration);

});


// ========================================
// CLICK / SEEK PROGRESS BAR
// ========================================

progress.addEventListener("click", (event) => {

    if (!audio.duration) return;

    const width = progress.clientWidth;

    const clickPosition =
        event.offsetX;

    const percentage =
        clickPosition / width;

    audio.currentTime =
        percentage * audio.duration;

});


// ========================================
// TRACK ENDS
// ========================================

audio.addEventListener("ended", () => {

    if (repeat) {

        audio.currentTime = 0;

        audio.play();

    } else {

        nextTrack();

    }

});


// ========================================
// REPEAT
// ========================================

repeatButton.addEventListener("click", () => {

    repeat = !repeat;

    repeatButton.style.background =
        repeat ? "#d58cab" : "#707ba8";

});


// ========================================
// BUTTON EVENTS
// ========================================

playButton.addEventListener(
    "click",
    togglePlay
);

previousButton.addEventListener(
    "click",
    previousTrack
);

nextButton.addEventListener(
    "click",
    nextTrack
);


// ========================================
// FORMAT TIME
// ========================================

function formatTime(seconds) {

    if (!isFinite(seconds)) {
        return "00:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );

}


// ========================================
// INITIALIZE
// ========================================

loadTrack(0);
