let currentsong = new Audio();
let songs;
let currentfolder;


function seconds_to_minute_seconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);
    const formattedminutes = String(minutes).padStart(2, '0');
    const formattedseconds = String(remainingseconds).padStart(2, '0');
    return `${formattedminutes} : ${formattedseconds}`;
}

async function getsongs(folder) {
    currentfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    // show all the song in the playlist 
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + `<li>
        
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
    // Attach event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
 return songs
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currentfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}
async function displayalbum() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array =  Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        
        if (e.href.includes("/songs")) {
         let folder = e.href.split("/").slice(-2)[0]
         // get meta data of every folder
         let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json` )

         let response = await a.json();
         console.log(response)
         cardcontainer.innerHTML = cardcontainer.innerHTML +` <div data-folder="${folder}" class="card">
                               <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"
                                fill="none">
                                <defs>
                                    <linearGradient id="blueGreenGradient" x1="0" y1="0" x2="48" y2="48"
                                        gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stop-color="#4facfe" /> <!-- Light Blue -->
                                        <stop offset="100%" stop-color="#1DB954" /> <!-- Spotify Green -->
                                    </linearGradient>
                                </defs>
                                <circle cx="24" cy="24" r="24" fill="url(#blueGreenGradient)" />
                                <polygon points="19,16 19,32 33,24" fill="white" />
                            </svg>
                        </div>
                         <img src="/songs/${folder}/cover.jpg" alt="">
                        <h1>${response.title} </h1>
                        <p>${response.description}</p>
                    </div>`
        }
    }
      // load playlist when card is clicked
      Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
    })
}

async function main() {
     
    await getsongs("songs/mymusic")
    playmusic(songs[0], true)

    // display all the album to the page
    displayalbum()


    // Attach an event listener to play next and prev
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })
    // listen timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${seconds_to_minute_seconds(currentsong.currentTime)} / ${seconds_to_minute_seconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    // add eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    // add an eventlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    // add an eventlistener for closing the left part in small screen
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })
    // add event listener for prev and next
    previous.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }

    })
    //add eventlistener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
   if(currentsong.volume >0)
   {
     document.querySelector(".volume>img").src=  document.querySelector(".volume>img").src.replace( "mute.svg","volume.svg")
   }
   if(currentsong.volume==0)
   {
    document.querySelector(".volume>img").src=  document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg")

   }
    })
  // add eventlistener to mute 
  document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg"))
    {
        e.target.src= e.target.src.replace ("volume.svg","mute.svg");
        currentsong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    } 
     else{
        e.target.src=e.target.src.replace ("mute.svg","volume.svg");
        currentsong.volume=0.1;
        document.querySelector(".range").getElementsByTagName("input")[0].value=10;
     }
  })

}
main()