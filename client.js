import { getRandomInt, normalize, shuffleArray } from './lib.js';
import { hiraganaDictionary, katakanaDictionary } from './data.js';

function handleMoreInfoButton() {
    shouldMoreInfoBeDisplayed = !shouldMoreInfoBeDisplayed;
    if (!shouldMoreInfoBeDisplayed) {
        domMoreInformation.style.display = "none";
    }
    else {
        domMoreInformation.style.display = 'block';
    }
}

function handleShowAnswer() {
    domUserInput.value = hiraganaDictionary[domKanaShowcase.innerText].romaji.toLowerCase();
}

function handleWin() {
    alert('youve won');
}

function handleGetNewKana() {
    if (kanaObjects.length == 0) { handleWin(); return; }

    domKanaShowcase.classList.remove('transparent');
    currentKanaObject = kanaObjects.shift();
    totalShown++;
    domWordsSeenCount.innerText = totalShown;
    domKanaShowcase.innerText = currentKanaObject.kana;
    domTranslationShowcase.innerText = currentKanaObject.meaning;
    hardmodeTimeInMiliseconds = document.querySelector("#milisecondsForHardmode").value;

    if (settings.hardMode) {
        setTimeout(onHardmodeRender, hardmodeTimeInMiliseconds);
    }

    domUserInput.value = '';
}

function onHardmodeRender() {
    domKanaShowcase.classList.add('transparent');
}

function onKeyDownHandler(e) {
    if (e.key != "Enter") return;

    const rawUserInput = domUserInput.value;
    const lowercasedUserInput = rawUserInput.toLowerCase();
    const answerInRomaji = currentKanaObject.romaji.toLowerCase();
    const answerInKana = currentKanaObject.kana;

    if (answerInRomaji == lowercasedUserInput || answerInKana == rawUserInput) {
        handleCorrectAnswer();
    }
    else {
        handleWrongAnswer();
    }

}

function handleCorrectAnswer() {
    numberCorrect++;
    domCorrectAnswerCount.innerText = numberCorrect;
    domCorrectAnswerContainer.style.display = 'flex';
    domWrongAnswerContainer.style.display = 'none';
    setTimeout(() => {
        removeFeedback();
        handleGetNewKana();
    }, howLongWillFeedbackShowFor);
}

function handleWrongAnswer() {
    domCorrectAnswerContainer.style.display = 'none';
    domWrongAnswerContainer.style.display = 'flex';
    setTimeout(() => {
        removeFeedback();
    }, howLongWillFeedbackShowFor);
}

function removeFeedback() {
    domCorrectAnswerContainer.style.display = 'none';
    domWrongAnswerContainer.style.display = 'none';
}

function renderSettingsPanel() {
    domHardmodeCheckbox.checked = settings.hardMode;
    domUserInputCheckbox.checked = settings.hideUserInput;
    domTranslationCheckbox.checked = settings.hideMeaning;
}

function saveSettingsToLocalStorage() {
    console.log('saving to local storage...');
    console.log(settings);
    const stringifiedSettings = JSON.stringify(settings);
    localStorage.setItem("appSettings", stringifiedSettings);
    renderSettingsPanel();
}

function loadSettingsFromLocalStorage() {
    const stringifiedSettings = localStorage.getItem("appSettings");
    if (!stringifiedSettings) {
        settings = {
            hideMeaning: false,
            hideUserInput: false,
            hardMode: false
        }
    } else {
        const settingsObject = JSON.parse(stringifiedSettings);
        settings = { ...settingsObject };
    }
    renderSettingsToScreen();
}

function renderSettingsToScreen() {
    renderHideMeaningSetting();
    renderHideUserInputSetting();
    renderHardModeToggleSetting();
}

function renderHideMeaningSetting() {
    if (settings.hideMeaning) {
        domTranslationContainer.style.display = "none";
    }
    else {
        domTranslationContainer.style.display = 'inline-block';
    }
}

function renderHideUserInputSetting() {
    if (settings.hideUserInput) {
        domUserInput.style.color = "#ffffff";
    }
    else {
        domUserInput.style.color = "#000000";
    }
}

function renderHardModeToggleSetting() {
    settings.hardMode = normalize(settings.hardMode);
}

function handleTranslationToggle() {
    settings.hideMeaning = !settings.hideMeaning;
    renderHideMeaningSetting();
    saveSettingsToLocalStorage();
}

function handleUserInputDisplayToggle() {
    settings.hideUserInput = !settings.hideUserInput;
    renderHideUserInputSetting();
    saveSettingsToLocalStorage();
}

function handleHardModeToggle() {
    settings.hardMode = !settings.hardMode;
    renderHardModeToggleSetting();
    saveSettingsToLocalStorage();
}

let domUserInput = document.getElementById('userInput');
let domKanaShowcase = document.getElementById('kana');
let domTranslationShowcase = document.getElementById('translationElement');
let domCorrectAnswerContainer = document.getElementById('correctAnswerContainer');
let domWrongAnswerContainer = document.getElementById('wrongAnswerContainer');

let domWordsInBankCount = document.getElementById('wordsInBankCount');
let domCorrectAnswerCount = document.getElementById('correctAnswersCount');
let domWordsSeenCount = document.getElementById('wordsSeenCount');

let domTranslationContainer = document.getElementById('translationContainer');
let hardmodeTimeInMiliseconds = document.querySelector("#milisecondsForHardmode").value;

const domMoreInformation = document.querySelector(".moreInfoText");

let shouldMoreInfoBeDisplayed = false;

let kanaObjects = [];
let currentKanaObject = {};

let numberCorrect = 0;
let totalShown = 0;

let howLongWillFeedbackShowFor = 800;

let settings = {
    hideMeaning: false,
    hideUserInput: false,
    hardMode: false
}

const domTranslationCheckbox = document.querySelector("#hideTranslationCheckbox");
const domUserInputCheckbox = document.querySelector("#hideUserInputCheckbox");
const domHardmodeCheckbox = document.querySelector("#hardModeCheckbox");

domTranslationCheckbox.addEventListener("click", handleTranslationToggle);
domUserInputCheckbox.addEventListener("click", handleUserInputDisplayToggle);
domHardmodeCheckbox.addEventListener("click", handleHardModeToggle);

document.querySelector("#showAnswerButton").addEventListener("click", handleShowAnswer);
document.querySelector("#getNewKanaButton").addEventListener("click", handleGetNewKana);
document.querySelector("#moreInfoButton").addEventListener("click", handleMoreInfoButton);
document.querySelector("#reloadButton").addEventListener("click", () => location.reload());

document.addEventListener('DOMContentLoaded', function () {
    kanaObjects = shuffleArray([...hiraganaDictionary]);

    domWordsInBankCount.innerText = kanaObjects.length;
    domCorrectAnswerCount.innerText = 0;
    domWordsSeenCount.innerText = 0;

    handleGetNewKana();
    document.addEventListener('keydown', onKeyDownHandler);
});

loadSettingsFromLocalStorage();

