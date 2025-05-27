let currentsong = new Audio();
let songs = [
  "Dil Diyan Gallan from Tiger Zinda Hai.mp3",
  "Jannatein Kahan from Jannat 2.mp3",
  "Labon Ko - Bhool Bhulaiyaa - Bhool Bhulaiyaa 2007 320KBPS.mp3",
  "Sajdaa from My Name Is Khan.mp3",
  "Tera Chehra from Sanam Teri Kasam.mp3",
  "Tu jaane na Atif Aslam.mp3",
  "Ankhiyon Ke Jharokhon Se.mp3",
  "Mere Mehboob from  Duplicate.mp3",
  "O Mere Dil Ke Chain from Mere Jeevan Saathi.mp3",
  "Agar Tu Hota - Baaghi - Baaghi 2016 320KBPS.mp3",
  "Dil Ke Arman Ansuon Men Bah Gaye from Nikaah.mp3",
  "Kya Hua Tera Vada from Hum Kisise Kum Naheen.mp3",
  "Shri Krishna Govind Hare Murari - PagalWorld.mp3"
];

let currentfolder = "songs/mymusic";

function seconds_to_minute_seconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingseconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")} : ${String(remainingseconds).padStart(2, "0")}`;
}

const playmusic = (track, pause = false) => {
  currentsong.src = `${currentfolder}/${track}`;
  if (!pause) {
    currentsong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

function populateSongList() {
  let songul = document.querySelector(".songlist ul");
  songul.innerHTML = "";
  for (const song of songs) {
    songul.innerHTML += `
      <li>
        <img class="invert" width="15" src="img/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Unknown artist</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" width="25" src="img/play.svg" alt="">
        </div>
      </li>`;
  }
  Array.from(document.querySelectorAll(".songlist li")).forEach((e) => {
  e.addEventListener("click", () => {
  const songName = e.querySelector(".info div").textContent.trim();
  playmusic(songName);
});

}

function main() {
  populateSongList();
  playmusic(songs[0], true);

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${seconds_to_minute_seconds(currentsong.currentTime)} / ${seconds_to_minute_seconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = `${percent}%`;
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });

  previous.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").pop());
    if (index > 0) playmusic(songs[index - 1]);
  });

  next.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").pop());
    if (index < songs.length - 1) playmusic(songs[index + 1]);
  });

  document.querySelector(".range input").addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
    const volIcon = document.querySelector(".volume > img");
    volIcon.src = currentsong.volume > 0
      ? volIcon.src.replace("mute.svg", "volume.svg")
      : volIcon.src.replace("volume.svg", "mute.svg");
  });

  document.querySelector(".volume > img").addEventListener("click", (e) => {
    const input = document.querySelector(".range input");
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentsong.volume = 0;
      input.value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentsong.volume = 0.1;
      input.value = 10;
    }
  });
}

main();
