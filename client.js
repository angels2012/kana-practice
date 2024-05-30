import { getRandomInt, isInArray, normalize } from './lib.js'
import { hiraganaDictionary, katakanaDictionary } from './data.js';

function handleMoreInfoButton() {
    if (!infoState) {
        domMoreInformation.style.display = "none";
    }
    else {
        domMoreInformation.style.display = 'block';
    }
    infoState = !infoState;
}

function handleShowAnswer() {
    domUserInput.value = hiraganaDictionary[domKanaShowcase.innerText].romaji.toLowerCase();
}

function handleGetNewKana() {
    lastIndicies.splice(lastIndiciesInsertVal, 1, keyListIndex);
    lastIndiciesInsertVal = (lastIndiciesInsertVal + 1) % 5;
    restoreHintStyle();
    let newIndex = getRandomInt(keyList.length);
    //make sure it's not the same one
    while (isInArray(newIndex, lastIndicies)) {
        newIndex = getRandomInt(keyList.length);
    }

    keyListIndex = newIndex;
    totalShowed++;
    domWordsDisplayedCount.innerText = totalShowed;

    //set values on the page
    domKanaShowcase.innerText = keyList[keyListIndex];
    domTranslationShowcase.innerText = hiraganaDictionary[keyList[keyListIndex]].meaning;
    hardmodeTimeInMiliseconds = document.querySelector("#milisecondsForHardmode").value;
    if (settings.hardMode) setTimeout(modifyHintStyle, hardmodeTimeInMiliseconds);

    domUserInput.value = '';
}

function hideFeedback(extraFunc) {
    domCorrectAnswerContainer.style.display = 'none';
    domWrongAnswerContainer.style.display = 'none';
    if (typeof extraFunc != 'undefined') {
        extraFunc();
    }
}

function modifyHintStyle() {
    domKanaShowcase.style.color = "#00000000";
}

function restoreHintStyle() {
    domKanaShowcase.style = kana_and_definition_style["domKanaShowcase"];
    // domTranslationShowcase.style = kana_and_definition_style["domTranslationShowcase"];
}

function onKeyDownHandler(e) {
    if (e.key == "Enter") {
        const rawUserInput = domUserInput.value;
        const lowercasedUserInput = domUserInput.value.toLowerCase();
        const answerInRomaji = hiraganaDictionary[domKanaShowcase.innerText].romaji.toLowerCase();
        const answerInKana = domKanaShowcase.innerText;
        if (answerInRomaji == lowercasedUserInput || answerInKana == rawUserInput) {
            numberCorrect++;
            domCorrectAnswerCount.innerText = numberCorrect;
            domCorrectAnswerContainer.style.display = 'flex';
            domWrongAnswerContainer.style.display = 'none';
            window.setTimeout(hideFeedback, feedbackDisplayTime, handleGetNewKana);
        }
        else {
            domCorrectAnswerContainer.style.display = 'none';
            domWrongAnswerContainer.style.display = 'flex';
            window.setTimeout(hideFeedback, feedbackDisplayTime);
        }
    }
}

function renderSettingsState() {
    domHardmodeCheckbox.checked = settings.hardMode;
    domUserInputCheckbox.checked = settings.hideUserInput;
    domTranslationCheckbox.checked = settings.hideMeaning;
}

function saveSettingsToLocalStorage() {
    console.log('saving to local storage...');
    console.log(settings);
    const stringifiedSettings = JSON.stringify(settings);
    localStorage.setItem("appSettings", stringifiedSettings);
    renderSettingsState();
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
        console.log(settings);
    }

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
let domWordsDisplayedCount = document.getElementById('wordsDisplayedCount');

let domTranslationContainer = document.getElementById('translationContainer');
let hardmodeTimeInMiliseconds = document.querySelector("#milisecondsForHardmode").value;

const domMoreInformation = document.querySelector(".moreInfoText");

let infoState = true;

let keyList = [];
let keyListIndex = 0;
let lastIndicies = [];
let lastIndiciesInsertVal = 0;
let feedbackDisplayTime = 800;
let numberCorrect = 0;
let totalShowed = 0;

let kana_and_definition_style = {
    "domKanaShowcase": domKanaShowcase.style,
    "domTranslationShowcase": domTranslationShowcase.style
};

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
    for (let key in hiraganaDictionary) {
        keyList.push(key);
    }
    domWordsInBankCount.innerText = keyList.length;
    domCorrectAnswerCount.innerText = 0;
    domWordsDisplayedCount.innerText = 0;

    handleGetNewKana();

    if (document.attachEvent) {
        document.attachEvent('onkeydown', onKeyDownHandler);
    }
    else {
        document.addEventListener('keydown', onKeyDownHandler);
    }
});

loadSettingsFromLocalStorage();

