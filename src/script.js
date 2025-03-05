var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
var _this = this;
var files = document.querySelectorAll('.file');
var contentDisplay = document.querySelector('.content-display');
var element = document.querySelector('.player');
var button = document.getElementById('button');
var searchInput = document.querySelector('input[name="search"]');
var info_search = document.querySelector('.info_search');
var dico = {
    "artiste.txt": "fichiers/texte/artiste.txt",
    "song.mp3": "fichiers/audio/All in the Run of A Day [828478153].mp3",
    "video.mp4": "fichiers/video/video.mp4",
};
// script.ts
// 1. Initialize the canvas and its context
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
// 2. Set canvas dimensions to cover the full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
(_a = document.querySelector(".matrix")) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);
// 3. Characters to display in the Matrix effect
var letters = "abcdefghijklmnopqrstuvwxyz0123456789";
var fontSize = 16; // Size of each character in pixels
var columns = Math.floor(canvas.width / fontSize); // Number of columns across the screen
// 4. Initialize the Y positions of each column (drops)
var drops = Array.from({ length: columns }, function () { return 1; });
var frameDelay = 50; // Délai entre les frames en millisecondes
function drawMatrix() {
    setTimeout(function () {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0f0";
        ctx.font = "".concat(fontSize, "px monospace");
        drops.forEach(function (yPosition, xIndex) {
            var text = letters.charAt(Math.floor(Math.random() * letters.length));
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
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalculate columns and reset drops
    var newColumns = Math.floor(canvas.width / fontSize);
    drops.length = newColumns;
    for (var i = 0; i < newColumns; i++) {
        drops[i] = 1;
    }
});
// Fonction pour gérer l'affichage d'un fichier
function displayFileContent(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        // Fonction pour mettre à jour le nom de la chanson
        function updateSongName() {
            if (currentSongElement_1) {
                var songName = songs_1[currentSongIndex_1].split("/").pop() || "Unknown song";
                currentSongElement_1.textContent = "\uD83C\uDFB6 Now playing: ".concat(songName);
            }
        }
        // Fonction pour initialiser les connexions audio
        function initializeAudio() {
            var audioSource = audioContext_1.createMediaElementSource(audio_1);
            audioSource.connect(analyser_1);
            analyser_1.connect(audioContext_1.destination);
            audio_1.addEventListener("timeupdate", function () {
                if (progressBar_1) {
                    var progress = (audio_1.currentTime / audio_1.duration) * 100 || 0;
                    progressBar_1.value = progress.toString();
                }
            });
        }
        // Fonction pour dessiner le spectre audio
        function drawVisualizer() {
            if (!canvas_1)
                return;
            var canvasCtx = canvas_1.getContext('2d');
            if (!canvasCtx)
                return;
            canvas_1.width = canvas_1.offsetWidth;
            canvas_1.height = canvas_1.offsetHeight;
            canvasCtx.clearRect(0, 0, canvas_1.width, canvas_1.height);
            analyser_1.getByteFrequencyData(dataArray_1);
            var barWidth = (canvas_1.width / bufferLength_1) * 2.5;
            var barHeight;
            var x = 0;
            for (var i = 0; i < bufferLength_1; i++) {
                barHeight = dataArray_1[i] / 2;
                canvasCtx.fillStyle = "rgb(".concat(barHeight + 100, ", 50, 150)");
                canvasCtx.fillRect(x, canvas_1.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            requestAnimationFrame(drawVisualizer);
        }
        var isTextFile, isSongFile, isVideoFile, response, fileContent, error_1, audio_1, audioContext_1, analyser_1, bufferLength_1, dataArray_1, playBtn, pauseBtn, prevBtn, nextBtn, currentSongElement_1, progressBar_1, volumeControl_1, canvas_1, currentSongIndex_1, songs_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isTextFile = fileName.endsWith('.txt');
                    isSongFile = fileName.endsWith('.mp3');
                    isVideoFile = fileName.endsWith('.mp4');
                    contentDisplay.classList.remove("visible", "invisible");
                    element.classList.remove("visible", "invisible");
                    if (!isTextFile) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(fileName)];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Cannot fetch ".concat(fileName));
                    return [4 /*yield*/, response.text()];
                case 3:
                    fileContent = _a.sent();
                    contentDisplay.textContent = fileContent;
                    contentDisplay.classList.add("visible");
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error fetching text file:", error_1);
                    contentDisplay.textContent = "Error loading file.";
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    if (isSongFile) {
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
                        audio_1 = new Audio(fileName);
                        audioContext_1 = new AudioContext();
                        analyser_1 = audioContext_1.createAnalyser();
                        bufferLength_1 = analyser_1.frequencyBinCount;
                        dataArray_1 = new Uint8Array(bufferLength_1);
                        playBtn = document.getElementById("play-btn");
                        pauseBtn = document.getElementById("pause-btn");
                        prevBtn = document.getElementById("prev-btn");
                        nextBtn = document.getElementById("next-btn");
                        currentSongElement_1 = document.getElementById("current-song");
                        progressBar_1 = document.getElementById("progress-bar");
                        volumeControl_1 = document.getElementById("volume-control");
                        canvas_1 = document.getElementById("audio-visualizer");
                        currentSongIndex_1 = 0;
                        songs_1 = [fileName];
                        // Bouton "Lecture"
                        playBtn === null || playBtn === void 0 ? void 0 : playBtn.addEventListener("click", function () {
                            audioContext_1.resume().then(function () {
                                initializeAudio();
                                audio_1.play();
                                updateSongName();
                            });
                        });
                        // Bouton "Pause"
                        pauseBtn === null || pauseBtn === void 0 ? void 0 : pauseBtn.addEventListener("click", function () {
                            audio_1.pause();
                        });
                        // Bouton "Précédent"
                        prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener("click", function () {
                            audio_1.pause();
                            currentSongIndex_1 = (currentSongIndex_1 - 1 + songs_1.length) % songs_1.length;
                            audio_1.src = songs_1[currentSongIndex_1];
                            initializeAudio();
                            audio_1.play();
                            updateSongName();
                        });
                        // Bouton "Suivant"
                        nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener("click", function () {
                            audio_1.pause();
                            currentSongIndex_1 = (currentSongIndex_1 + 1) % songs_1.length;
                            audio_1.src = songs_1[currentSongIndex_1];
                            initializeAudio();
                            audio_1.play();
                            updateSongName();
                        });
                        // Contrôle du volume
                        volumeControl_1 === null || volumeControl_1 === void 0 ? void 0 : volumeControl_1.addEventListener("input", function () {
                            if (volumeControl_1) {
                                audio_1.volume = parseFloat(volumeControl_1.value);
                            }
                        });
                        // Lancer le visualiseur lorsque la chanson commence
                        audio_1.addEventListener('play', function () {
                            drawVisualizer();
                        });
                    }
                    else if (isVideoFile) {
                        console.log("Playing video file...");
                        contentDisplay.innerHTML = "<video src=\"".concat(fileName, "\" controls autoplay style=\"width: 100%;\"></video>");
                        contentDisplay.classList.add("visible");
                    }
                    else {
                        contentDisplay.textContent = "Unsupported file type.";
                        contentDisplay.classList.add("visible");
                    }
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Fonction pour ajouter les événements de clic aux fichiers
function addFileClickEvent(file, fileName) {
    file.addEventListener('click', function () {
        console.log("Clicked file: ".concat(fileName));
        displayFileContent(fileName);
    });
}
// Ajouter un événement de clic au bouton de recherche
button.addEventListener('click', function (event) {
    event.preventDefault();
    var searchValue = searchInput.value.toLowerCase().trim();
    // Filtrer les clés du dictionnaire par rapport à la recherche
    var result = Object.keys(dico).filter(function (key) { return key.toLowerCase().includes(searchValue); });
    // Effacer les résultats précédents
    info_search.innerHTML = '';
    if (result.length > 0) {
        result.forEach(function (key) {
            var resultDiv = document.createElement('div');
            resultDiv.textContent = key;
            resultDiv.classList.add('file');
            resultDiv.id = dico[key];
            resultDiv.setAttribute('data-type', 'text');
            // Ajouter l'événement de clic pour afficher le contenu
            addFileClickEvent(resultDiv, dico[key]);
            info_search.appendChild(resultDiv);
        });
    }
    else {
        var noResultDiv = document.createElement('div');
        noResultDiv.textContent = "Aucun résultat trouvé.";
        noResultDiv.classList.add('no-result');
        info_search.appendChild(noResultDiv);
    }
});
// Ajouter les événements de clic aux fichiers existants
files.forEach(function (file) {
    var fileName = file.id; // On suppose que l'ID du fichier correspond à son chemin
    addFileClickEvent(file, fileName);
});
// Ajoute un événement de clic à chaque élément <li>
files.forEach(function (file) {
    file.addEventListener('click', function () {
        // Retirer la classe 'clicked' de tous les éléments
        files.forEach(function (f) { return f.classList.remove('clicked'); });
        // Ajouter la classe 'clicked' sur l'élément cliqué
        file.classList.add('clicked');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Fonction pour basculer la visibilité des enfants
    var toggleVisibility = function (element) {
        if (element.classList.contains("invisible")) {
            element.classList.remove("invisible");
            element.classList.add("visible");
        }
        else {
            element.classList.remove("visible");
            element.classList.add("invisible");
        }
    };
    // Fonction principale pour gérer les clics sur les <span>
    var handleDossierClick = function (span) {
        var parentDossier = span.parentElement; // Trouve le parent <li> ou <ul>
        // Sélectionne uniquement les enfants directs (li ou ul) sous ce parent
        var children = parentDossier.querySelectorAll(":scope > ul > li, :scope > li");
        // Bascule la visibilité des enfants
        children.forEach(function (child) {
            toggleVisibility(child);
        });
    };
    // Sélectionne tous les <span> des dossiers (et sous-dossiers)
    var dossierSpans = document.querySelectorAll(".dossier > span");
    // Ajoute un écouteur d'événement à chaque <span>
    dossierSpans.forEach(function (span) {
        span.addEventListener("click", function (event) {
            event.stopPropagation(); // Empêche la propagation
            handleDossierClick(span);
        });
    });
});
files.forEach(function (file) {
    file.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        // Fonction pour mettre à jour le nom de la chanson
        function updateSongName() {
            if (currentSongElement_2) {
                var songName = songs_2[currentSongIndex_2].split("/").pop() || "Unknown song";
                currentSongElement_2.textContent = "\uD83C\uDFB6 Now playing: ".concat(songName);
            }
        }
        // Fonction pour initialiser les connexions audio
        function initializeAudio() {
            var audioSource = audioContext_2.createMediaElementSource(audio_2);
            audioSource.connect(analyser_2);
            analyser_2.connect(audioContext_2.destination);
            audio_2.addEventListener("timeupdate", function () {
                if (progressBar_2) {
                    var progress = (audio_2.currentTime / audio_2.duration) * 100 || 0;
                    progressBar_2.value = progress.toString();
                }
            });
        }
        // Fonction pour dessiner le spectre audio
        function drawVisualizer() {
            if (!canvas_2)
                return;
            var canvasCtx = canvas_2.getContext('2d');
            if (!canvasCtx)
                return;
            canvas_2.width = canvas_2.offsetWidth;
            canvas_2.height = canvas_2.offsetHeight;
            canvasCtx.clearRect(0, 0, canvas_2.width, canvas_2.height);
            analyser_2.getByteFrequencyData(dataArray_2);
            var barWidth = (canvas_2.width / bufferLength_2) * 2.5;
            var barHeight;
            var x = 0;
            for (var i = 0; i < bufferLength_2; i++) {
                barHeight = dataArray_2[i] / 2;
                canvasCtx.fillStyle = "rgb(".concat(barHeight + 100, ", 50, 150)");
                canvasCtx.fillRect(x, canvas_2.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            requestAnimationFrame(drawVisualizer);
        }
        var fileName, titreElement, isTextFile, isSongFile, isMP4File, response, fileContent, audio_2, audioContext_2, analyser_2, bufferLength_2, dataArray_2, playBtn, pauseBtn, prevBtn, nextBtn, currentSongElement_2, progressBar_2, volumeControl_2, canvas_2, currentSongIndex_2, songs_2, videoElement, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fileName = (_a = file.querySelector('span')) === null || _a === void 0 ? void 0 : _a.id;
                    titreElement = document.getElementById("content-display");
                    console.log("Clicked file: ".concat(fileName)); // Log pour confirmer le fichier cliqué
                    if (!fileName) return [3 /*break*/, 8];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    isTextFile = fileName.endsWith('.txt');
                    isSongFile = fileName.endsWith('.mp3');
                    isMP4File = fileName.endsWith('.mp4');
                    // Modifier l'ID de l'élément pour le cacher
                    contentDisplay.classList.remove("invisible");
                    contentDisplay.classList.add("visible");
                    element.classList.remove("visible");
                    element.classList.add("invisible");
                    if (!isTextFile) return [3 /*break*/, 4];
                    // Fetch the file content for text files
                    console.log("Fetching content of ".concat(fileName, "..."));
                    return [4 /*yield*/, fetch(fileName)];
                case 2:
                    response = _b.sent();
                    if (!response.ok)
                        throw new Error("Cannot fetch ".concat(fileName));
                    return [4 /*yield*/, response.text()];
                case 3:
                    fileContent = _b.sent();
                    console.log("File content fetched successfully:", fileContent);
                    titreElement.textContent = fileContent;
                    // Update the <pre> element with the file's content
                    if (contentDisplay) {
                        contentDisplay.textContent = fileContent;
                        console.log('Content successfully inserted into <pre> element.');
                    }
                    else {
                        console.error('Content display element not found!');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    if (isSongFile) {
                        // Logique pour les fichiers audio
                        console.log("On a un fichier audio");
                        contentDisplay.classList.remove("visible");
                        contentDisplay.classList.add("invisible");
                        // Changer l'ID de l'élément pour le rendre visible
                        if (element) {
                            element.classList.remove("invisible");
                            element.classList.add("visible");
                        }
                        audio_2 = new Audio(fileName);
                        audioContext_2 = new AudioContext();
                        analyser_2 = audioContext_2.createAnalyser();
                        bufferLength_2 = analyser_2.frequencyBinCount;
                        dataArray_2 = new Uint8Array(bufferLength_2);
                        playBtn = document.getElementById("play-btn");
                        pauseBtn = document.getElementById("pause-btn");
                        prevBtn = document.getElementById("prev-btn");
                        nextBtn = document.getElementById("next-btn");
                        currentSongElement_2 = document.getElementById("current-song");
                        progressBar_2 = document.getElementById("progress-bar");
                        volumeControl_2 = document.getElementById("volume-control");
                        canvas_2 = document.getElementById("audio-visualizer");
                        currentSongIndex_2 = 0;
                        songs_2 = [fileName];
                        // Bouton "Lecture"
                        playBtn === null || playBtn === void 0 ? void 0 : playBtn.addEventListener("click", function () {
                            audioContext_2.resume().then(function () {
                                initializeAudio();
                                audio_2.play();
                                updateSongName();
                            });
                        });
                        // Bouton "Pause"
                        pauseBtn === null || pauseBtn === void 0 ? void 0 : pauseBtn.addEventListener("click", function () {
                            audio_2.pause();
                        });
                        // Bouton "Précédent"
                        prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener("click", function () {
                            audio_2.pause();
                            currentSongIndex_2 = (currentSongIndex_2 - 1 + songs_2.length) % songs_2.length;
                            audio_2.src = songs_2[currentSongIndex_2];
                            initializeAudio();
                            audio_2.play();
                            updateSongName();
                        });
                        // Bouton "Suivant"
                        nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener("click", function () {
                            audio_2.pause();
                            currentSongIndex_2 = (currentSongIndex_2 + 1) % songs_2.length;
                            audio_2.src = songs_2[currentSongIndex_2];
                            initializeAudio();
                            audio_2.play();
                            updateSongName();
                        });
                        // Contrôle du volume
                        volumeControl_2 === null || volumeControl_2 === void 0 ? void 0 : volumeControl_2.addEventListener("input", function () {
                            if (volumeControl_2) {
                                audio_2.volume = parseFloat(volumeControl_2.value);
                            }
                        });
                        // Lancer le visualiseur lorsque la chanson commence
                        audio_2.addEventListener('play', function () {
                            drawVisualizer();
                        });
                    }
                    else if (isMP4File) {
                        // Logique pour les fichiers vidéo MKV
                        console.log("On a un fichier vidéo");
                        element.classList.remove("visible");
                        element.classList.add("invisible");
                        videoElement = document.createElement('video');
                        videoElement.src = fileName; // Chemin du fichier vidéo
                        videoElement.controls = true; // Ajoute les contrôles de lecture (lecture/pause/volume)
                        videoElement.autoplay = true; // Lance automatiquement la lecture
                        videoElement.style.width = '100%'; // Adapte la taille de la vidéo à l'écran
                        // Vider le conteneur actuel et afficher la vidéo
                        if (contentDisplay) {
                            contentDisplay.innerHTML = ''; // Nettoyer le contenu précédent
                            contentDisplay.appendChild(videoElement); // Ajouter l'élément vidéo
                        }
                        else {
                            console.error("Impossible de trouver l'élément 'content-display' pour afficher la vidéo.");
                        }
                    }
                    else {
                        // Fichier non pris en charge
                        console.log("Cannot read file: Not a supported file type.");
                        // Afficher un message à l'utilisateur pour indiquer que le fichier n'est pas pris en charge
                        if (contentDisplay) {
                            contentDisplay.textContent = "The file type of \"".concat(fileName, "\" is not supported.");
                            contentDisplay.style.color = 'red'; // Changer la couleur du texte pour attirer l'attention
                        }
                        else {
                            console.error("Impossible d'afficher le message d'erreur dans 'content-display'.");
                        }
                    }
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _b.sent();
                    console.error('Error fetching file:', error_2);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.error('No ID found for the clicked file');
                    _b.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    }); });
});
