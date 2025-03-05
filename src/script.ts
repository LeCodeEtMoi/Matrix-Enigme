const files = document.querySelectorAll<HTMLDivElement>('.file');
const contentDisplay = document.querySelector('.content-display') as HTMLPreElement;
const element = document.querySelector('.player') as HTMLElement;
const button = document.getElementById('button') as HTMLButtonElement;
const searchInput = document.querySelector('input[name="search"]') as HTMLInputElement;
const info_search = document.querySelector('.info_search');


let dico: { [key: string]: string } = {
  "artiste.txt": "fichiers/texte/artiste.txt",
  "song.mp3": "fichiers/audio/All in the Run of A Day [828478153].mp3",
  "video.mp4": "fichiers/video/video.mp4",
};

// script.ts

// 1. Initialize the canvas and its context
const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// 2. Set canvas dimensions to cover the full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.querySelector(".matrix")?.appendChild(canvas);

// 3. Characters to display in the Matrix effect
const letters: string = "abcdefghijklmnopqrstuvwxyz0123456789";
const fontSize: number = 16; // Size of each character in pixels
const columns: number = Math.floor(canvas.width / fontSize); // Number of columns across the screen

// 4. Initialize the Y positions of each column (drops)
const drops: number[] = Array.from({ length: columns }, () => 1);

const frameDelay: number = 50; // Délai entre les frames en millisecondes

function drawMatrix(): void {
  setTimeout(() => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f0";
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((yPosition, xIndex) => {
      const text: string = letters.charAt(
        Math.floor(Math.random() * letters.length)
      );

      ctx.fillText(text, xIndex * fontSize, yPosition * fontSize);

      if (yPosition * fontSize > canvas.height || Math.random() > 0.95) {
        drops[xIndex] = 0;
      }

      drops[xIndex]++;
    });

    requestAnimationFrame(drawMatrix); // Continue l'animation
  }, frameDelay); // Ajoute un délai avant la prochaine frame
}


// 6. Start the animation
drawMatrix();

// 7. Handle window resizing to adjust the canvas size
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Recalculate columns and reset drops
  const newColumns = Math.floor(canvas.width / fontSize);
  drops.length = newColumns;
  for (let i = 0; i < newColumns; i++) {
    drops[i] = 1;
  }
});



// Fonction pour gérer l'affichage d'un fichier
async function displayFileContent(fileName: string) {
  const isTextFile = fileName.endsWith('.txt');
  const isSongFile = fileName.endsWith('.mp3');
  const isVideoFile = fileName.endsWith('.mp4');

  contentDisplay.classList.remove("visible", "invisible");
  element.classList.remove("visible", "invisible");

  if (isTextFile) {
    try {
      const response = await fetch(fileName);
      if (!response.ok) throw new Error(`Cannot fetch ${fileName}`);
      const fileContent = await response.text();
      contentDisplay.textContent = fileContent;
      contentDisplay.classList.add("visible");
    } catch (error) {
      console.error("Error fetching text file:", error);
      contentDisplay.textContent = "Error loading file.";
    }
  } else if (isSongFile) {
    console.log("Playing audio file...");
    element.classList.add("visible");
    // Logique pour les fichiers audio
    console.log("On a un fichier audio");
    contentDisplay.classList.remove("visible");
    contentDisplay.classList.add("invisible");
    // Changer l'ID de l'élément pour le rendre visible
    if (element) {
      element.classList.remove("invisible");
      element.classList.add("visible");
    }

    // Initialiser les variables pour l'audio
    const audio = new Audio(fileName);  // Crée un élément audio avec le fichier
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // DOM Elements
    const playBtn: HTMLButtonElement | null = document.getElementById("play-btn") as HTMLButtonElement;
    const pauseBtn: HTMLButtonElement | null = document.getElementById("pause-btn") as HTMLButtonElement;
    const prevBtn: HTMLButtonElement | null = document.getElementById("prev-btn") as HTMLButtonElement;
    const nextBtn: HTMLButtonElement | null = document.getElementById("next-btn") as HTMLButtonElement;
    const currentSongElement: HTMLElement | null = document.getElementById("current-song");
    const progressBar: HTMLInputElement | null = document.getElementById("progress-bar") as HTMLInputElement;
    const volumeControl: HTMLInputElement | null = document.getElementById("volume-control") as HTMLInputElement;
    const canvas: HTMLCanvasElement | null = document.getElementById("audio-visualizer") as HTMLCanvasElement;

    let currentSongIndex = 0;  // Définir un index de chanson initial, à ajuster
    const songs = [fileName];  // Tableau de chansons, initialisé avec le fichier courant

    // Fonction pour mettre à jour le nom de la chanson
    function updateSongName(): void {
      if (currentSongElement) {
        const songName = songs[currentSongIndex].split("/").pop() || "Unknown song";
        currentSongElement.textContent = `🎶 Now playing: ${songName}`;
      }
    }

    // Fonction pour initialiser les connexions audio
    function initializeAudio(): void {
      const audioSource = audioContext.createMediaElementSource(audio);
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);

      audio.addEventListener("timeupdate", () => {
        if (progressBar) {
          const progress = (audio.currentTime / audio.duration) * 100 || 0;
          progressBar.value = progress.toString();
        }
      });
    }

    // Bouton "Lecture"
    playBtn?.addEventListener("click", () => {
      audioContext.resume().then(() => {
        initializeAudio();
        audio.play();
        updateSongName();
      });
    });

    // Bouton "Pause"
    pauseBtn?.addEventListener("click", () => {
      audio.pause();
    });

    // Bouton "Précédent"
    prevBtn?.addEventListener("click", () => {
      audio.pause();
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      audio.src = songs[currentSongIndex];
      initializeAudio();
      audio.play();
      updateSongName();
    });

    // Bouton "Suivant"
    nextBtn?.addEventListener("click", () => {
      audio.pause();
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      audio.src = songs[currentSongIndex];
      initializeAudio();
      audio.play();
      updateSongName();
    });

    // Contrôle du volume
    volumeControl?.addEventListener("input", () => {
      if (volumeControl) {
        audio.volume = parseFloat(volumeControl.value);
      }
    });

    // Fonction pour dessiner le spectre audio
    function drawVisualizer(): void {
      if (!canvas) return;
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      analyser.getByteFrequencyData(dataArray);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      requestAnimationFrame(drawVisualizer);
    }

    // Lancer le visualiseur lorsque la chanson commence
    audio.addEventListener('play', () => {
      drawVisualizer();
    });
  } else if (isVideoFile) {
    console.log("Playing video file...");
    contentDisplay.innerHTML = `<video src="${fileName}" controls autoplay style="width: 100%;"></video>`;
    contentDisplay.classList.add("visible");
  } else {
    contentDisplay.textContent = "Unsupported file type.";
    contentDisplay.classList.add("visible");
  }
}

// Fonction pour ajouter les événements de clic aux fichiers
function addFileClickEvent(file: HTMLElement, fileName: string) {
  file.addEventListener('click', () => {
    console.log(`Clicked file: ${fileName}`);
    displayFileContent(fileName);
  });
}

// Ajouter un événement de clic au bouton de recherche
button.addEventListener('click', function (event) {
  event.preventDefault();
  const searchValue = searchInput.value.toLowerCase().trim();

  // Filtrer les clés du dictionnaire par rapport à la recherche
  const result = Object.keys(dico).filter(key => key.toLowerCase().includes(searchValue));

  // Effacer les résultats précédents
  info_search.innerHTML = '';

  if (result.length > 0) {
    result.forEach(key => {
      const resultDiv = document.createElement('div');
      resultDiv.textContent = key;
      resultDiv.classList.add('file');
      resultDiv.id = dico[key];
      resultDiv.setAttribute('data-type', 'text');

      // Ajouter l'événement de clic pour afficher le contenu
      addFileClickEvent(resultDiv, dico[key]);

      info_search.appendChild(resultDiv);
    });
  } else {
    const noResultDiv = document.createElement('div');
    noResultDiv.textContent = "Aucun résultat trouvé.";
    noResultDiv.classList.add('no-result');
    info_search.appendChild(noResultDiv);
  }
});

// Ajouter les événements de clic aux fichiers existants
files.forEach(file => {
  const fileName = file.id; // On suppose que l'ID du fichier correspond à son chemin
  addFileClickEvent(file, fileName);
});



// Ajoute un événement de clic à chaque élément <li>
files.forEach(file => {
  file.addEventListener('click', function() {
      // Retirer la classe 'clicked' de tous les éléments
      files.forEach(f => f.classList.remove('clicked'));
      
      // Ajouter la classe 'clicked' sur l'élément cliqué
      file.classList.add('clicked');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Fonction pour basculer la visibilité des enfants
  const toggleVisibility = (element) => {
    if (element.classList.contains("invisible")) {
      element.classList.remove("invisible");
      element.classList.add("visible");
    } else {
      element.classList.remove("visible");
      element.classList.add("invisible");
    }
  };

  // Fonction principale pour gérer les clics sur les <span>
  const handleDossierClick = (span) => {
    const parentDossier = span.parentElement; // Trouve le parent <li> ou <ul>

    // Sélectionne uniquement les enfants directs (li ou ul) sous ce parent
    const children = parentDossier.querySelectorAll(":scope > ul > li, :scope > li");

    // Bascule la visibilité des enfants
    children.forEach((child) => {
      toggleVisibility(child);
    });
  };

  // Sélectionne tous les <span> des dossiers (et sous-dossiers)
  const dossierSpans = document.querySelectorAll(".dossier > span");

  // Ajoute un écouteur d'événement à chaque <span>
  dossierSpans.forEach((span) => {
    span.addEventListener("click", (event) => {
      event.stopPropagation(); // Empêche la propagation
      handleDossierClick(span);
    });
  });
});




files.forEach((file) => {
  file.addEventListener('click', async () => {
    const fileName = file.querySelector('span')?.id;
    const titreElement = document.getElementById("content-display") as HTMLHeadingElement;

    console.log(`Clicked file: ${fileName}`); // Log pour confirmer le fichier cliqué

    if (fileName) {
      try {
        // Vérifier si le fichier est un fichier texte, audio, pdf ou vidéo
        const isTextFile = fileName.endsWith('.txt');
        const isSongFile = fileName.endsWith('.mp3');
        const isMP4File = fileName.endsWith('.mp4');
        
        // Modifier l'ID de l'élément pour le cacher
        contentDisplay.classList.remove("invisible");
        contentDisplay.classList.add("visible");
        element.classList.remove("visible");
        element.classList.add("invisible");

        if (isTextFile) {
          // Fetch the file content for text files
          console.log(`Fetching content of ${fileName}...`);
          const response = await fetch(fileName);
          if (!response.ok) throw new Error(`Cannot fetch ${fileName}`);
          const fileContent = await response.text();

          console.log(`File content fetched successfully:`, fileContent);
          titreElement.textContent = fileContent;

          // Update the <pre> element with the file's content
          if (contentDisplay) {
            contentDisplay.textContent = fileContent;
            console.log('Content successfully inserted into <pre> element.');
          } else {
            console.error('Content display element not found!');
          }

        } else if (isSongFile) {
          // Logique pour les fichiers audio
          console.log("On a un fichier audio");
          contentDisplay.classList.remove("visible");
          contentDisplay.classList.add("invisible");
          // Changer l'ID de l'élément pour le rendre visible
          if (element) {
            element.classList.remove("invisible");
            element.classList.add("visible");
          }

          // Initialiser les variables pour l'audio
          const audio = new Audio(fileName);  // Crée un élément audio avec le fichier
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          // DOM Elements
          const playBtn: HTMLButtonElement | null = document.getElementById("play-btn") as HTMLButtonElement;
          const pauseBtn: HTMLButtonElement | null = document.getElementById("pause-btn") as HTMLButtonElement;
          const prevBtn: HTMLButtonElement | null = document.getElementById("prev-btn") as HTMLButtonElement;
          const nextBtn: HTMLButtonElement | null = document.getElementById("next-btn") as HTMLButtonElement;
          const currentSongElement: HTMLElement | null = document.getElementById("current-song");
          const progressBar: HTMLInputElement | null = document.getElementById("progress-bar") as HTMLInputElement;
          const volumeControl: HTMLInputElement | null = document.getElementById("volume-control") as HTMLInputElement;
          const canvas: HTMLCanvasElement | null = document.getElementById("audio-visualizer") as HTMLCanvasElement;

          let currentSongIndex = 0;  // Définir un index de chanson initial, à ajuster
          const songs = [fileName];  // Tableau de chansons, initialisé avec le fichier courant

          // Fonction pour mettre à jour le nom de la chanson
          function updateSongName(): void {
            if (currentSongElement) {
              const songName = songs[currentSongIndex].split("/").pop() || "Unknown song";
              currentSongElement.textContent = `🎶 Now playing: ${songName}`;
            }
          }

          // Fonction pour initialiser les connexions audio
          function initializeAudio(): void {
            const audioSource = audioContext.createMediaElementSource(audio);
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);

            audio.addEventListener("timeupdate", () => {
              if (progressBar) {
                const progress = (audio.currentTime / audio.duration) * 100 || 0;
                progressBar.value = progress.toString();
              }
            });
          }

          // Bouton "Lecture"
          playBtn?.addEventListener("click", () => {
            audioContext.resume().then(() => {
              initializeAudio();
              audio.play();
              updateSongName();
            });
          });

          // Bouton "Pause"
          pauseBtn?.addEventListener("click", () => {
            audio.pause();
          });

          // Bouton "Précédent"
          prevBtn?.addEventListener("click", () => {
            audio.pause();
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            audio.src = songs[currentSongIndex];
            initializeAudio();
            audio.play();
            updateSongName();
          });

          // Bouton "Suivant"
          nextBtn?.addEventListener("click", () => {
            audio.pause();
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            audio.src = songs[currentSongIndex];
            initializeAudio();
            audio.play();
            updateSongName();
          });

          // Contrôle du volume
          volumeControl?.addEventListener("input", () => {
            if (volumeControl) {
              audio.volume = parseFloat(volumeControl.value);
            }
          });

          // Fonction pour dessiner le spectre audio
          function drawVisualizer(): void {
            if (!canvas) return;
            const canvasCtx = canvas.getContext('2d');
            if (!canvasCtx) return;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            analyser.getByteFrequencyData(dataArray);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              barHeight = dataArray[i] / 2;
              canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
              canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
              x += barWidth + 1;
            }

            requestAnimationFrame(drawVisualizer);
          }

          // Lancer le visualiseur lorsque la chanson commence
          audio.addEventListener('play', () => {
            drawVisualizer();
          });
        } else if (isMP4File) {
          // Logique pour les fichiers vidéo MKV
          console.log("On a un fichier vidéo");

          element.classList.remove("visible");
          element.classList.add("invisible");
        
          // Créer un élément vidéo pour lire le fichier
          const videoElement = document.createElement('video');
          videoElement.src = fileName; // Chemin du fichier vidéo
          videoElement.controls = true; // Ajoute les contrôles de lecture (lecture/pause/volume)
          videoElement.autoplay = true; // Lance automatiquement la lecture
          videoElement.style.width = '100%'; // Adapte la taille de la vidéo à l'écran
        
          // Vider le conteneur actuel et afficher la vidéo
          if (contentDisplay) {
            contentDisplay.innerHTML = ''; // Nettoyer le contenu précédent
            contentDisplay.appendChild(videoElement); // Ajouter l'élément vidéo
          } else {
            console.error("Impossible de trouver l'élément 'content-display' pour afficher la vidéo.");
          }
        } else {
          // Fichier non pris en charge
          console.log("Cannot read file: Not a supported file type.");
        
          // Afficher un message à l'utilisateur pour indiquer que le fichier n'est pas pris en charge
          if (contentDisplay) {
            contentDisplay.textContent = `The file type of "${fileName}" is not supported.`;
            contentDisplay.style.color = 'red'; // Changer la couleur du texte pour attirer l'attention
          } else {
            console.error("Impossible d'afficher le message d'erreur dans 'content-display'.");
          }
        }
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    } else {
      console.error('No ID found for the clicked file');
    }
  });
});

