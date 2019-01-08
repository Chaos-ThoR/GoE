// ==UserScript==
// @name         Game Of Elements
// @namespace    GameOfElements
// @version      4.0.8.3
// @updateURL    https://github.com/Chaos-ThoR/GoE/raw/master/Game%20Of%20Elements.user.js
// @encoding     utf-8
// @description  try to take over the world!
// @author       ThoR, Klaxi
// @match        https://game-of-elements.de/*
// @match        https://www.game-of-elements.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      goe.klaxi.de
// @require      https://github.com/Chaos-ThoR/GoE/raw/master/knapsack.js
// @require      https://github.com/Chaos-ThoR/GoE/raw/master/reminderAudio.js
// @run-at document-end
// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------
// configuration variables
var scriptEnabled = true; // global switch for the whole script
var removeSomeElements = true; // remove some elements
var removeHeadFoot = true; // remove the head and foot of the page and replace it with small versions
var removeHuntLink = false; // remove the work link
var removeSearchWaterLink = false; // remove the work link
var addAdditionalHealthInformation = false; // add some additional health information to the status block
var doReorgPageElems = true; // move some page elements
var extraGroupItems = true; // add an extra group on the right side for items
var addSomeShortcutLinks = true; // add some shortcut links at the bottom left side and on the "Arbeiten" page
var addDefaultWorkLink = true; // add an link entry which will go direct to the selected work page
var defaultWorkDo = 'Pillen herstellen';
var addDefaultWorkLink2 = false;
var defaultWorkDo2 = 'Pillen herstellen';
var addDefaultWorkLink3 = false;
var defaultWorkDo3 = 'Pillen herstellen';
var displayHeatWarning = true; // display a heat / cold warning
var displayAnimalWarning = true; // display a warning if you will work without or with the wrong animal
var defaultProfession = 'Bauer';
var moveServerTime = true; // move the server time to the first headline of each page
var addBBCodes = false; // add a BBCODE toolbar to the "Stadtforum", "Forum" & "Nachrichten" pages
var doKnapsackCalc = false; // knpsack calculation for "ausgeglichener Kampf"
var addDateOfDeath = true; // add the date of death for the animal(s)
var addExternalStats = false; // add external statistics in profils
var cityStorageLimitsEnabled = true; // enables limit markup settings for the city storage
var enableReminder = false; // play a sound when time is up + options
var reminderVolume = 1.0;
var reminderDelay = 250;
var reminderRepetitions = 1;
var reminderSelection = 'Alien';
var minDebenValue = 50;

// quick links ..
var quickLinks = {};

// limits for the city storage
var storageLimitsArray = [{res : 'Elixier der Genesung',          y :   -1, g :   -1}, {res : 'Elixier der Kraft',             y :   -1, g :   -1},
                          {res : 'Elixier der Vielfalt',          y :   -1, g :   -1}, {res : 'Elixier der Zeit',              y :   -1, g :   -1},
                          {res : 'mittlere Vitaminpille',         y :   -1, g :   -1}, {res : 'mittlere W\u00E4rmepille',      y :   -1, g :   -1},
                          {res : 'schwache Vitaminpille',         y :   -1, g :   -1}, {res : 'schwache W\u00E4rmepille',      y :   -1, g :   -1},
                          {res : 'starke Vitaminpille',           y :   -1, g :   -1}, {res : 'starke W\u00E4rmepille',        y :   -1, g :   -1},
                          {res : 'Bronzelegierung',               y :   -1, g :   -1}, {res : 'Draht',                         y :   -1, g :   -1},
                          {res : 'Eisenlegierung',                y :   25, g :   50}, {res : 'gelber Smaragd',                y :  150, g :  300},
                          {res : 'Goldlegierung',                 y :   25, g :   50}, {res : 'Kupferlegierung',               y :   25, g :   50},
                          {res : 'Pflanzenkorn',                  y :   75, g :  150}, {res : 'Portalstein',                   y :   -1, g :   -1},
                          {res : 'roter Smaragd',                 y :  300, g :  600}, {res : 'Silberlegierung',               y :   25, g :   50},
                          {res : 'verschlossene Truhe (Stufe 1)', y :   -1, g :   -1}, {res : 'verschlossene Truhe (Stufe 2)', y :   -1, g :   -1},
                          {res : 'Weidenblume',                   y :   -1, g :   -1}, {res : 'Zinnlegierung',                 y :   25, g :   50},
                          {res : 'Bretter',                       y :  300, g :  600}, {res : 'Bronze',                        y :  250, g :  500},
                          {res : 'Datteln',                       y :  300, g :  600}, {res : 'Deben',                         y :   -1, g :   -1},
                          {res : 'Eisen',                         y :  250, g :  500}, {res : 'Eisenerz',                      y :  500, g : 1000},
                          {res : 'Fell',                          y :   -1, g :   -1}, {res : 'Fleisch',                       y :   -1, g :   -1},
                          {res : 'Gold',                          y :   25, g :   50}, {res : 'Holz',                          y :  500, g : 1000},
                          {res : 'Honig',                         y :  300, g :  600}, {res : 'Kupfer',                        y :  250, g :  500},
                          {res : 'Kupferschiefer',                y :  500, g : 1000}, {res : 'Leder',                         y :  500, g : 1000},
                          {res : 'Lehm',                          y :   -1, g :   -1}, {res : 'Myrrhe',                        y :  300, g :  600},
                          {res : 'Platin',                        y :   25, g :   50}, {res : 'Sellerie',                      y :   -1, g :   -1},
                          {res : 'Silber',                        y :   25, g :   50}, {res : 'Stein',                         y : 2500, g : 5000},
                          {res : 'Stroh',                         y :  500, g : 1000}, {res : 'Tiernahrung',                   y :  500, g : 1000},
                          {res : 'Tiernahrung Klasse I',          y :   -1, g :   -1}, {res : 'Wasser',                        y :   -1, g :   -1},
                          {res : 'Zinn',                          y :  250, g :  500}, {res : 'Zinnerz',                       y :  500, g : 1000}];

// items to move in the special item section ..
var itemsToMove = ['Angel des Donners', 'Angel des Schweigens', 'Bier', 'blaue Angel', 'blaues Geschenk', 'Blech', 'Blume', 'Blumenkranz', 'Blumenstrau\u00df', 'Donnerbeere',
                   'Draht', 'Ehering', 'Eierlikör', 'Element der Jugend', 'Element der Kraft', 'Element der Teleportation', 'Element des Fluches', 'Elixier der Genesung',
                   'Elixier der gro\u00dfen Gesundheit', 'Elixier der kleinen Gesundheit', 'Elixier der Kraft', 'Elixier der Vielfalt', 'Elixier der Zeit', 'Feuerzangenbowle',
                   'Freundschaftsb\u00e4ndchen', 'gelbes Geschenk', 'Gesundheitsei', 'Gl\u00fchwein', 'K\u00fcrbis', 'kleine Angel', 'komisches Ei', 'Liebeselixier',
                   'mittlere Vitaminpille', 'mittlere W\u00e4rmepille', 'Ostereier', 'Portalstein', 'Rose', 'rote Angel', 'rotes Geschenk', 'Schnaps', 'Schneeball', 'Turnierfreikarte',
                   'schwache Vitaminpille', 'schwache W\u00e4rmepille', 'starke Vitaminpille', 'starke W\u00e4rmepille', 'Turnierfreikarte', 'verschlossene Truhe (Stufe 1)',
                   'verschlossene Truhe (Stufe 2)', 'W\u00e4rmebot 3562', 'Wintermarke', 'Zeitbot 3000', 'Zeitstopbot 5321'];

// jobs and the possible work they can do ..
var jobLinkMap = {'Pillen herstellen' : '10',
                  'Selbstheilung' : '30',
                  'Zauber wirken' : '21',
                  'Tier z\u00FCchten' : '22',
                  'spielen (Tier)' : '23',
                  'Futter herstellen' : '24',
                  'Fell abziehen' : '28',
                  'Waffen herstellen' : '9',
                  'Item reparieren' : '33',
                  'R\u00FCst. herstellen' : '26',
                  'Schlossknacken' : '29',
                  'Kupferschiefer abbauen' : '11',
                  'Zinnerz abbauen' : '12',
                  'hochwertige Ressis sammeln' : '32',
                  'Kupfer herstellen' : '16',
                  'Zinn herstellen' : '15',
                  'Silber herstellen' : '18',
                  'Bronze herstellen' : '17',
                  'Gold herstellen' : '19',
                  'Platin herstellen' : '35',
                  'Geb\u00E4ude reparieren' : '20',
                  'Leder herstellen' : '31',
                  'Elixier herstellen' : '34',
                  'Holz zu Bretter verarbeiten' : '13'};

// animal dependency ..
var professions = {'Sammler' : {'' : 'Falke', '4' : 'Falke', '32' : 'Falke'},
                   'Steinmetz' : {'' : 'Esel', '5' : 'Esel', '20' : ''},
                   'Waldarbeiter' : {'' : 'Kamel', '6' : 'Kamel', '13' : ''},
                   'Versorger' : {'' : 'Jagdhund', 'jagen' : 'Jagdhund', 'wasserholen' : 'Esel', '31' : '', '34' : ''},
                   'Alchemist' : {'' : 'Eule', '1' : 'Eule', '10' : '', '30' : 'Eule', '21' : ''},
                   'Bauer' : {'' : 'Esel', '8' : 'Esel', '24' : '', '22' : '', '23' : 'Esel', '28' : ''},
                   'Minenarbeiter' : {'' : 'Ochse', '7' : 'Ochse', '11' : 'Ochse', '12' : 'Ochse'},
                   'Schmied' : {'' : 'Pferd', '14' : 'Pferd', '15' : 'Pferd', '16' : 'Pferd', '17' : 'Pferd', '18' : 'Pferd', '19' : '', '35' : ''},
                   'Ingenieur' : {'' : '', '25' : '', '9' : '', '33' : 'Affe', '26' : '', '29' : ''}};

// global state variables used in functions ..
var heatWarningActive = false; // heat warnung state
var reminderTimerFunc = -1;
var quickLinkDeleter = [];

// ---------------------------------------------------------------------------------------------------------

(function() { // main function ..
    "use strict";

    if(isLoggedIn()) {
        addScriptOptions(); // add the options for this script ..
    }
    if(scriptEnabled) {
        // changes for the ..
        global(); // whole page ..
        if(isLoggedIn()) {
            overview(); // "Übersicht" page ..
            cityoverview(); // "Stadt -> Übersicht" page ..
            cityEvents(); // "Stadt -> Ereignisse" page ..
            cityfight(); // "Stadtkampf" page ..
            cityStorage(); // "Stadtlager" page ..
            cityProfile(); // "Stadtprofil" with knapsack solver ..
            userProfile(); // user profile page ..
            map(); // "Weltkarte" page ..
            forum(); // "Stadtforum", "Forum" & "Nachrichten" ..
            workShortLinks(); // Add some shortcuts to the "Arbeiten" page ..
            userRanking(); // add some additional information on the 'Usertop' page ..
            extendAnimalInformation(); // add the date of death ..
			feedAnimal(); // "Tier füttern" page ..
			transfer(); // "Übertragen" page ..
			marketplace(); // "Marktplatz" page ..
			character(); // "Charakter" page ..
			competition(); // "Gewinnspiel" page ..
            colosseum(); // "Kolosseum" page ..
            reorgPageElems();

            // job dependend functions ..
            addHealedInfo(); // additional information for alchemists ..
            defaultSelectionsForAlchemist();
            addRemainingWorkCyclesInfo(); // additional information for stonecutters ..
            preselectPrimaryEngineerItem(); // preselect the primary item for engineers ..
            preselectionCreateAnimalFood(); // preselect the create animal food defaults ..
			preselectFirstStonecuttersRepairEntry(); // preselect the first repair entry for engineers ..
			preselectFirstEngineerRepairEntry(); // preselect the first repair entry for engineers ..
            preselectionCollector(); // preselect collect ressis for collecttors ..
        } else {
            document.getElementById('navbox_right').getElementsByTagName('input')[2].focus();
        }
    }
}
)();

function addScriptOptions() { // add a script configuration UI ..
    loadConfig(); // load the script configuration
    if(document.URL == "https://game-of-elements.de/index.php" ||
       document.URL == "https://www.game-of-elements.de/index.php") {
        getContent().appendChild(document.createElement('br'));
        getContent().appendChild(document.createElement('br'));
        getContent().appendChild(createElementT('h1', 'Skript Optionen ..'));
        getContent().appendChild(createElementA('img', 'src', 'img/' + getPageStyle() + '/linie.gif'));

        // main options config table and table body
        var configTable = createElementA('table', 'id', 'configTable');
        configTable.setAttribute('class', 'table');
        configTable.style.border = '0';
        configTable.style.width = '100%';
        configTable.style.cellpadding = '2';
        configTable.appendChild(document.createElement('tbody'));
        getContent().appendChild(configTable);

        // main options table row
        configTable.getElementsByTagName('tbody')[0].appendChild(document.createElement('tr'));
        var tableHead0 = createElementA('td', 'background', 'img/' + getPageStyle() + '/footer_bg.jpg');
        tableHead0.width = '90%';
        tableHead0.height = '25';
        tableHead0.appendChild(createElementAT('font', 'class', 'color_tabelle', 'Allgemeine Skript Optionen'));
        configTable.rows[0].appendChild(tableHead0);
        var tableHead1 = createElementA('td', 'background', 'img/' + getPageStyle() + '/footer_bg.jpg');
        tableHead1.width = '10%';
        tableHead1.height = '25';
        tableHead1.appendChild(createElementAT('font', 'class', 'color_tabelle', ''));
        configTable.rows[0].appendChild(tableHead1);

/* 1*/ createConfigTableRow(configTable, 'Skript AN / AUS (v' + GM_info.script.version + ')', createSwitch('scriptSwitch', scriptEnabled));
/* 2*/ createConfigTableRow(configTable, 'Dein Beruf: ', 'span' );
/* 3*/ createConfigTableRow(configTable, 'Entferne einige Seitenelemente', createSwitch('removeElem', removeSomeElements));
/* 4*/ createConfigTableRow(configTable, 'Entferne den Kopf und den Fu\u00DF der Seite', createSwitch('removeElemHeadFoot', removeHeadFoot));
/* 5*/ createConfigTableRow(configTable, 'Gegenst\u00E4nde in eigene Gruppe verschieben', createSwitch('extraItems', extraGroupItems));
/* 6*/ createConfigTableRow(configTable, 'Umorganisieren / verschieben von einigen Seitenelementen', createSwitch('reorgPageElemsSwitch', doReorgPageElems));
/* 7*/ createConfigTableRow(configTable, 'Entferne "Jagen" Link', createSwitch('removeHuntLinkSwitch', removeHuntLink));
/* 8*/ createConfigTableRow(configTable, 'Entferne "Wasser holen" Link', createSwitch('removeSearchWaterLinkSwitch', removeSearchWaterLink));
/* 9*/ createConfigTableRow(configTable, 'Zeige Informationen zur Selbstheilung', createSwitch('addAdditionalHealthInformationSwitch', addAdditionalHealthInformation));
/*10*/ createConfigTableRow(configTable, 'Zeige Serverzeit in erster \u00DCberschrift auf den meisten Seiten', createSwitch('mServerTime', moveServerTime));
/*11*/ createConfigTableRow(configTable, 'Warnung bei \u00DCberhitzung / Unterk\u00FChlung', createSwitch('heatWarning', displayHeatWarning));
/*12*/ createConfigTableRow(configTable, 'Warnung bei fehlendem oder falschem Tier', createSwitch('animalWarning', displayAnimalWarning));
/*13*/ createConfigTableRow(configTable, 'Zus\u00E4tzliche hilfreiche Links ("unten links" und bei "Arbeiten")', createSwitch('shortcutsOption', addSomeShortcutLinks));
/*14*/ createConfigTableRow(configTable, 'Zus\u00E4tzlicher Arbeitslink: ', createSwitch('defaultWorkSwitch', addDefaultWorkLink));
/*15*/ createConfigTableRow(configTable, 'Weiterer zus\u00E4tzlicher Arbeitslink: ', createSwitch('defaultWorkSwitch2', addDefaultWorkLink2));
/*16*/ createConfigTableRow(configTable, 'Weiterer zus\u00E4tzlicher Arbeitslink: ', createSwitch('defaultWorkSwitch3', addDefaultWorkLink3));
/*17*/ createConfigTableRow(configTable, 'Links: ', 'span');
/*18*/ createConfigTableRow(configTable, 'BB Codes Leiste f\u00FCr Foren & Nachrichten', createSwitch('bbCodes', addBBCodes));
/*19*/ createConfigTableRow(configTable, 'Sterbedatum der Tiere (f\u00FCr alle Tiere beim Stall)', createSwitch('deathCounter', addDateOfDeath));
/*20*/ createConfigTableRow(configTable, 'Externe Statistiken einbinden', createSwitch('externalStats', addExternalStats));
/*21*/ createConfigTableRow(configTable, 'Anzeigegrenzen vom Stadtlager f\u00FCr: ', createSwitch('cityStorageLimitsSwitch', cityStorageLimitsEnabled));
/*22*/ createConfigTableRow(configTable, 'Sound abspielen wenn Arbeitsgang beendet', createSwitch('remind', enableReminder));
/*23*/ createConfigTableRow(configTable, 'Sound', createSelection('remindSound', audioFiles, reminderSelection, updateConfig));
/*24*/ createConfigTableRow(configTable, 'Sound wiederholen', createInputNumber('soundRepeat', '1', '999', '1', '60', reminderRepetitions));
/*25*/ createConfigTableRow(configTable, 'Zeit bis der Sound wiederholt wird in [ms] (1000 = 1s)', createInputNumber('soundDelay', '0', '10000', '100', '60', reminderDelay));
/*26*/ createConfigTableRow(configTable, 'Sound Lautst\u00E4rke', createSlider('soundVolume', 0, 1, 0.1, 60, reminderVolume, updateConfig));
/*27*/ createConfigTableRow(configTable, 'min. Deben im Inventar', createInputNumber('minDeben', '0', '9999999', '50', '60', minDebenValue));
    if(checkHash(getUserName())) {
/*28*/ createConfigTableRow(configTable, 'Knapsack Optimierung bei "ausgeglichener Kampf" (Stadtprofil)', createSwitch('doKnapsack', doKnapsackCalc));
    }

        // special selections for the default work things ..
        var professionSelection = createSelection('professionSelectionCombo', professions, String(defaultProfession), updateConfig);
        getTableElement(configTable, 2, 0).appendChild(professionSelection);

        var workSelection = createSelection('jobSelectionCombo', jobLinkMap, String(defaultWorkDo), updateConfig);
        workSelection.style.marginLeft = '48px';
        getTableElement(configTable, 14, 0).appendChild(workSelection);
        var workSelection2 = createSelection('jobSelectionCombo2', jobLinkMap, String(defaultWorkDo2), updateConfig);
        workSelection2.style.marginLeft = '5px';
        getTableElement(configTable, 15, 0).appendChild(workSelection2);
        var workSelection3 = createSelection('jobSelectionCombo3', jobLinkMap, String( defaultWorkDo3), updateConfig);
        workSelection3.style.marginLeft = '5px';
        getTableElement(configTable, 16, 0).appendChild(workSelection3);

        // special link settings
        var quickLinksCombo = createElementA('input', 'id', 'quickLinksCombo');
        quickLinksCombo.setAttribute('list', 'qlData');
        quickLinksCombo.setAttribute('style', 'width: 120px');
        quickLinksCombo.addEventListener('input', updateView, false);
        var quickLinksDataList = createElementA('datalist', 'id', 'qlData');
        quickLinksCombo.appendChild(quickLinksDataList);
        for(var link in quickLinks) {
            quickLinksDataList.appendChild(createElementAT('option', 'value', link, link));
        }
        getTableElement(configTable, 17, 0).appendChild(quickLinksCombo);
        getTableElement(configTable, 17, 0).appendChild(document.createTextNode(' '));
        var quickLinksText = createInputText('quickLinksText', '305', '');
        quickLinksText.addEventListener('input', updateView, false);
        getTableElement(configTable, 17, 0).appendChild(quickLinksText);

        getTableElement(configTable, 17, 0).appendChild(createButton('addLinkBtn', 'Link hinzuf\u00FCgen', '10', '18', '32', addLinkEntry));
        getTableElement(configTable, 17, 0).appendChild(createButton('removeLinkBtn', 'Link entfernen', '10', '18', '20', removeLinkEntry));
        getTableElement(configTable, 17, 0).appendChild(createButton('addDefaultsLinkBtn', 'Standard Links anlegen', '10', '18', '20', addDefaultLinkEntries));

        // special city storage settings
        getTableElement(configTable, 21, 0).appendChild(createSelectionCityStorage('cityStorageCombo', storageLimitsArray, 'Bretter', updateView));
        getTableElement(configTable, 21, 0).appendChild(document.createElement('br'));
        getTableElement(configTable, 21, 0).appendChild(document.createTextNode(' ROT < '));
        getTableElement(configTable, 21, 0).appendChild(createInputNumber('scYellow', '-1', '9999999', '1', '66', getObjectFromCityStorageArray(storageLimitsArray, document.getElementById('cityStorageCombo').value).y));
        getTableElement(configTable, 21, 0).appendChild(document.createTextNode(' GELB < '));
        getTableElement(configTable, 21, 0).appendChild(createInputNumber('scGreen', '-1', '9999999', '1', '66', getObjectFromCityStorageArray(storageLimitsArray, document.getElementById('cityStorageCombo').value).g));
        getTableElement(configTable, 21, 0).appendChild(document.createTextNode(' ansonsten GR\u00DCN'));
        getTableElement(configTable, 21, 0).appendChild(document.createElement('br'));
        getTableElement(configTable, 21, 0).appendChild(document.createTextNode('* -1 = KEINE Hervorhebung'));

        // special test sound button for the reminder ..
        var testSoundBtn = createButton('testSound', 'Sound Test', '10', '18', '298', playSoundWrap);
        getTableElement(configTable, 23, 0).appendChild(testSoundBtn);

        // job options table
        getContent().appendChild( document.createElement('br'));
        var jobTable = createElementA('table', 'id', 'jobTable');
        jobTable.setAttribute('class', 'table');
        jobTable.style.border = '0';
        jobTable.style.width = '100%';
        jobTable.style.cellpadding = '2';
        jobTable.appendChild(document.createElement('tbody'));
        getContent().appendChild(jobTable);

        // job options table row
        jobTable.getElementsByTagName('tbody')[0].appendChild(document.createElement('tr'));
        var jobTableHead0 = createElementA('td', 'background', 'img/' + getPageStyle() + '/footer_bg.jpg');
        jobTableHead0.width = '100%';
        jobTableHead0.height = '25';
        jobTableHead0.appendChild(createElementAT('font', 'class', 'color_tabelle', 'Optionen f\u00FCr die Berufe'));
        jobTable.rows[0].appendChild(jobTableHead0);

        createConfigTableRow(jobTable, '', 'span'); // alchemist row
        createConfigTableRow(jobTable, '', 'span'); // stoncutter row

        // special alchemist settings
        var healValue = GM_getValue('healValue', 600);
        getTableElement(jobTable, 1, 0).appendChild(createElementT('h2', 'Alchemist:'));
        var healLabel = createElementT('label', 'Heilung (anderer) / Arbeitsgang: ');
        healLabel.appendChild(createInputNumber('healValueInput', '0', '10000', '10', '60', healValue));
        getTableElement(jobTable, 1, 0).appendChild(healLabel);

        // special stonecutters settings
        var repOptimum = JSON.parse(GM_getValue('repOptimum', JSON.stringify([90.1, 90.1, 93.4])));
        getTableElement(jobTable, 2, 0).appendChild(createElementT('h2', 'Steinmetz:'));
        var repairBLabel = createElementT('label', 'Geb\u00E4ude reparieren Limits - ');
        repairBLabel.appendChild(document.createTextNode(" Stufe 1: "));
        repairBLabel.appendChild(createInputNumber('scL1Value', '0.0', '100.0', '0.1', '50', repOptimum[0]));
        repairBLabel.appendChild(document.createTextNode(" Stufe 2: "));
        repairBLabel.appendChild(createInputNumber('scL2Value', '0.0', '100.0', '0.1', '50', repOptimum[1]));
        repairBLabel.appendChild( document.createTextNode(" Stufe 3: "));
        repairBLabel.appendChild( createInputNumber('scL3Value', '0.0', '100.0', '0.1', '50', repOptimum[2]));
        getTableElement(jobTable, 2, 0).appendChild(repairBLabel);

        // save button for the configuration ..
        getContent().appendChild(document.createElement('br'));
        var saveBtn = createButton('saveBtn', 'Konfiguration speichern', '12', '30', '0', saveConfig);
        saveBtn.style.width = '100%';
        getContent().appendChild(saveBtn);
        getContent().appendChild(document.createElement('br'));

        updateView();
    }
}

// returns the variable part of the path in the different css
function getPageStyle() {
    var firstCssLink = document.getElementsByTagName('link')[0];
    var linkValue = firstCssLink.href;
    return linkValue.split('/')[4];
}

function createConfigTableRow(table, label, option) {
    var newRow = document.createElement('tr');
    newRow.style.bgcolor = '#FFFFFF';
    newRow.style = 'background-color: rgb(255, 255, 255);';

    var newCol_1 = document.createElement('td');
    newCol_1.style.width = '80%';
    newCol_1.style.height = '25';
    newCol_1.textContent = label;
    newRow.appendChild(newCol_1);

    if(option == 'span') {
        newCol_1.setAttribute('colspan', '2');
    }
    else {
        var newCol_2 = createElementA('td', 'align', 'right');
        newCol_2.style.width = '20%';
        newCol_2.style.height = '25';
        newCol_2.appendChild(option);
        newRow.appendChild(newCol_2);
    }
    table.getElementsByTagName('tbody')[0].appendChild(newRow);
}

function addLinkEntry() { // add a link entry ..
    var key = document.getElementById('quickLinksCombo').value;
    var value = document.getElementById('quickLinksText').value;
    if(key !== '' && value !== '') {
        quickLinks[key] = value;
        document.getElementById('qlData').appendChild(createElementAT('option', 'value', key, key));
    }
    updateView();
}

function removeLinkEntry() { // remove a link entry ..
    var key = document.getElementById('quickLinksCombo').value;
    delete quickLinks[key];
    var keyList = document.getElementById('qlData').getElementsByTagName('option');
    for(var i = 0; i < keyList.length; i++) {
        if(keyList[i].textContent == key) {
            quickLinkDeleter.push(keyList[i].textContent);
            keyList[i].parentNode.removeChild(keyList[i]);
            document.getElementById('quickLinksCombo').value = '';
            document.getElementById('quickLinksText').value = '';
        }
    }
    updateView();
}

function addDefaultLinkEntries() { // add / restire default link entries ..
    quickLinks.Aktionsliste = 'index.php?site=statistik&do=aktionsliste';
    quickLinks.Stadttop = 'index.php?site=usertop&do=gruppentop';
    quickLinks.Items = 'index.php?site=statistik&do=items';
    quickLinks.Stadtverpflegung = 'index.php?site=tierverwaltung&do=stadtverpflegung';
    quickLinks.AllesAblegen = 'index.php?site=inventar&ablegen=l_hand&all=1';
    quickLinks.AllesAnlegen = 'index.php?site=inventar&do=1&all_a=1';
    quickLinks['GoE - Skript'] = 'https://github.com/Chaos-ThoR/GoE';

    removeElementById('qlData'); // remove all entries ..

    // add entries ..
    var quickLinksCombo = document.getElementById('quickLinksCombo');
    var quickLinksDataList = createElementA('datalist', 'id', 'qlData');
    quickLinksCombo.appendChild(quickLinksDataList);
    for(var link in quickLinks) {
        quickLinksDataList.appendChild(createElementAT('option', 'value', link, link));
    }
    updateView();
}

function updateView() { // update configuration UI elements ..
    var quickLinksSselectedValue = document.getElementById('quickLinksCombo').value;
    var quickLinksTextValue = document.getElementById('quickLinksText').value;
    if(quickLinksSselectedValue && isValueInObjectList(quickLinks, quickLinksSselectedValue)) {
        document.getElementById('quickLinksText').value = quickLinks[quickLinksSselectedValue];
        document.getElementById('addLinkBtn').disabled = true;
        document.getElementById('removeLinkBtn').disabled = false;
    }
    else if((quickLinksSselectedValue !== '') && (quickLinksTextValue !== '')) {
        document.getElementById('addLinkBtn').disabled = false;
        document.getElementById('removeLinkBtn').disabled = true;
    }
    else {
        document.getElementById('addLinkBtn').disabled = true;
        document.getElementById('removeLinkBtn').disabled = true;
    }

    var cityStorageSselectedValue = document.getElementById('cityStorageCombo').value;
    document.getElementById('scYellow').value = parseInt(getObjectFromCityStorageArray(storageLimitsArray, cityStorageSselectedValue).y);
    document.getElementById('scGreen').value = parseInt(getObjectFromCityStorageArray(storageLimitsArray, cityStorageSselectedValue).g);
}

function updateConfig() { // update the settings
    scriptEnabled = document.getElementById('scriptSwitch').checked;
    addBBCodes = document.getElementById('bbCodes').checked;
    removeSomeElements = document.getElementById('removeElem').checked;
    removeHeadFoot = document.getElementById('removeElemHeadFoot').checked;
    extraGroupItems = document.getElementById('extraItems').checked;
    doReorgPageElems = document.getElementById('reorgPageElemsSwitch').checked;
    removeHuntLink = document.getElementById('removeHuntLinkSwitch').checked;
    removeSearchWaterLink = document.getElementById('removeSearchWaterLinkSwitch').checked;
    addAdditionalHealthInformation = document.getElementById('addAdditionalHealthInformationSwitch').checked;
    displayHeatWarning = document.getElementById('heatWarning').checked;
    displayAnimalWarning = document.getElementById('animalWarning').checked;
    defaultProfession = document.getElementById('professionSelectionCombo').value;
    addSomeShortcutLinks = document.getElementById('shortcutsOption').checked;
    addDefaultWorkLink = document.getElementById('defaultWorkSwitch').checked;
    defaultWorkDo = document.getElementById('jobSelectionCombo').value;
    addDefaultWorkLink2 = document.getElementById('defaultWorkSwitch2').checked;
    defaultWorkDo2 = document.getElementById('jobSelectionCombo2').value;
    addDefaultWorkLink3 = document.getElementById('defaultWorkSwitch3').checked;
    defaultWorkDo3 = document.getElementById('jobSelectionCombo3').value;
    moveServerTime = document.getElementById('mServerTime').checked;
    if(checkHash(getUserName())) {
        doKnapsackCalc = document.getElementById('doKnapsack').checked;
    }
    else {
        doKnapsackCalc = false;
    }
    addDateOfDeath = document.getElementById('deathCounter').checked;
	addExternalStats = document.getElementById('externalStats').checked;
    cityStorageLimitsEnabled = document.getElementById('cityStorageLimitsSwitch').checked;
    enableReminder = document.getElementById('remind').checked;
    reminderSelection = document.getElementById('remindSound').value;
    reminderRepetitions = parseInt(document.getElementById('soundRepeat').value);
    reminderDelay = parseInt(document.getElementById('soundDelay').value);
    reminderVolume = parseFloat(document.getElementById('soundVolume').value);
    minDebenValue = parseInt(document.getElementById('minDeben').value);

    var cityStorageSselectedValue = document.getElementById('cityStorageCombo').value;
    storageLimitsArray[getIndexFromCityStorageArray(storageLimitsArray, cityStorageSselectedValue)].y = parseInt(document.getElementById('scYellow').value);
    storageLimitsArray[getIndexFromCityStorageArray(storageLimitsArray, cityStorageSselectedValue)].g = parseInt(document.getElementById('scGreen').value);

    var healValue = parseInt(document.getElementById('healValueInput').value);
    GM_setValue('healValue', healValue);

    var repOptimum = [];
    repOptimum[0] = document.getElementById('scL1Value').value;
    repOptimum[1] = document.getElementById('scL2Value').value;
    repOptimum[2] = document.getElementById('scL3Value').value;

    var btn = document.getElementById('saveBtn');
    btn.style.backgroundColor = 'yellow';
}

function saveConfig() { // save current script configuration ..
    // store the values ..
    GM_setValue('scriptEnabled', scriptEnabled);
    GM_setValue('addBBCodes', addBBCodes);
    GM_setValue('removeSomeElements', removeSomeElements);
    GM_setValue('removeHeadFoot', removeHeadFoot);
    GM_setValue('extraGroupItems', extraGroupItems);
    GM_setValue('doReorgPageElems', doReorgPageElems);
    GM_setValue('removeHuntLink', removeHuntLink);
    GM_setValue('removeSearchWaterLink', removeSearchWaterLink);
    GM_setValue('addAdditionalHealthInformation', addAdditionalHealthInformation);
    GM_setValue('displayHeatWarning', displayHeatWarning);
    GM_setValue('displayAnimalWarning', displayAnimalWarning);
    GM_setValue('defaultProfession', defaultProfession);
    GM_setValue('addSomeShortcutLinks', addSomeShortcutLinks);
    GM_setValue('addDefaultWorkLink', addDefaultWorkLink);
    GM_setValue('defaultWorkDo', defaultWorkDo);
    GM_setValue('addDefaultWorkLink2', addDefaultWorkLink2);
    GM_setValue('defaultWorkDo2', defaultWorkDo2);
    GM_setValue('addDefaultWorkLink3', addDefaultWorkLink3);
    GM_setValue('defaultWorkDo3', defaultWorkDo3);
    GM_setValue('moveServerTime', moveServerTime);
    GM_setValue('doKnapsackCalc', doKnapsackCalc);
    GM_setValue('addDateOfDeath', addDateOfDeath);
    GM_setValue('addExternalStats', addExternalStats);
    GM_setValue('cityStorageLimitsEnabled', cityStorageLimitsEnabled);
    GM_setValue('enableReminder', enableReminder);
    GM_setValue('reminderSelection', reminderSelection);
    GM_setValue('reminderRepetitions', reminderRepetitions);
    GM_setValue('reminderDelay', reminderDelay);
    GM_setValue('reminderVolume', reminderVolume);
    GM_setValue('minDebenValue', minDebenValue);

    for(var indexToDelete = 0; indexToDelete < quickLinkDeleter.length; indexToDelete++) {
        GM_deleteValue(String(quickLinkDeleter[indexToDelete]));
    }
    quickLinkDeleter = [];

    var qlKeys = Object.keys(quickLinks);
    GM_setValue('quickLinks', JSON.stringify(quickLinks));
    for(var link in quickLinks) {
        GM_setValue(link, quickLinks[link]);
    }

    for(var res in storageLimitsArray) {
        var cityStorageObj = getObjectFromCityStorageArray(storageLimitsArray, storageLimitsArray[res].res);
        GM_setValue((cityStorageObj.res + '_Green'), cityStorageObj.g);
        GM_setValue((cityStorageObj.res + '_Yellow'), cityStorageObj.y);
    }

    var repOptimum = [];
    repOptimum[0] = document.getElementById('scL1Value').value;
    repOptimum[1] = document.getElementById('scL2Value').value;
    repOptimum[2] = document.getElementById('scL3Value').value;
    GM_setValue('repOptimum', JSON.stringify(repOptimum));

    var btn = document.getElementById('saveBtn');
    btn.style.backgroundColor = 'lightgreen';
}

function loadConfig() { // load current script configuration ..
    scriptEnabled = GM_getValue('scriptEnabled', scriptEnabled);
    addBBCodes = GM_getValue('addBBCodes', addBBCodes);
    removeSomeElements = GM_getValue('removeSomeElements', removeSomeElements);
    removeHeadFoot = GM_getValue('removeHeadFoot', removeHeadFoot);
    extraGroupItems = GM_getValue('extraGroupItems', extraGroupItems);
    doReorgPageElems = GM_getValue('doReorgPageElems', doReorgPageElems);
    removeHuntLink = GM_getValue('removeHuntLink', removeHuntLink);
    removeSearchWaterLink = GM_getValue('removeSearchWaterLink', removeSearchWaterLink);
    addAdditionalHealthInformation = GM_getValue('addAdditionalHealthInformation', addAdditionalHealthInformation);
    displayHeatWarning = GM_getValue('displayHeatWarning', displayHeatWarning);
    displayAnimalWarning = GM_getValue('displayAnimalWarning', displayAnimalWarning);
    defaultProfession = GM_getValue('defaultProfession', defaultProfession);
    addSomeShortcutLinks = GM_getValue('addSomeShortcutLinks', addSomeShortcutLinks);
    addDefaultWorkLink = GM_getValue('addDefaultWorkLink', addDefaultWorkLink);
    defaultWorkDo = GM_getValue('defaultWorkDo', defaultWorkDo);
    addDefaultWorkLink2 = GM_getValue('addDefaultWorkLink2', addDefaultWorkLink2);
    defaultWorkDo2 = GM_getValue('defaultWorkDo2', defaultWorkDo2);
    addDefaultWorkLink3 = GM_getValue('addDefaultWorkLink3', addDefaultWorkLink3);
    defaultWorkDo3 = GM_getValue('defaultWorkDo3', defaultWorkDo3);
    moveServerTime = GM_getValue('moveServerTime', moveServerTime);
    doKnapsackCalc = GM_getValue('doKnapsackCalc', doKnapsackCalc);
    addDateOfDeath = GM_getValue('addDateOfDeath', addDateOfDeath);
	addExternalStats = GM_getValue('addExternalStats', addExternalStats);
    cityStorageLimitsEnabled = GM_getValue('cityStorageLimitsEnabled', cityStorageLimitsEnabled);
    enableReminder = GM_getValue('enableReminder', enableReminder);
    reminderSelection = GM_getValue('reminderSelection', reminderSelection);
    reminderRepetitions = parseInt(GM_getValue('reminderRepetitions', reminderRepetitions));
    reminderDelay = parseInt(GM_getValue('reminderDelay', reminderDelay));
    reminderVolume = parseFloat(GM_getValue('reminderVolume', reminderVolume));
    minDebenValue = parseInt(GM_getValue('minDebenValue', minDebenValue));

    var qlKeys = JSON.parse(GM_getValue('quickLinks', JSON.stringify(Object.keys(quickLinks))));
    for(var link in qlKeys) {
        quickLinks[link] = GM_getValue(link, quickLinks[link]);
    }

    for(var res in storageLimitsArray) {
        storageLimitsArray[res].g = GM_getValue((storageLimitsArray[res].res + '_Green'), storageLimitsArray[res].g);
        storageLimitsArray[res].y = GM_getValue((storageLimitsArray[res].res + '_Yellow'), storageLimitsArray[res].y);
    }
}

function global() { // changes for the whole page ..
    if(isLoggedIn()) {
        reminder();
        serverTime();
        showHeatWarning();
        showAnimalWarning();
        globalShortLinks();
        defalutWorkLink();
        extraSectionForSpecialItems();
        addHealthInformation();
    }

    if(!isLoggedIn() && removeSomeElements) {
        var elem = document.getElementById('container').getElementsByTagName('div')[6];
        var logOutBtn = elem.getElementsByTagName('ul')[0].getElementsByTagName('li')[0].getElementsByTagName('form')[1];
        logOutBtn.parentNode.removeChild(logOutBtn);
    }

    if(removeHeadFoot) {
        // remove some elemts from the page ..
        removeElementById('partner_leiste');

        // if there, remove advertising or message of advertising blocker ..
        var iframes = getContent().getElementsByTagName('iframe');
        for(var i = 0; i < iframes.length; i++) { // may be empty ..
            iframes[i].parentNode.removeChild(iframes[i]);
        }

        if(getPageStyle() != 'handy') {
            removeElementById('header');
            removeElementById('footer');

            // add new header and footer images ..
            var newHeaderDiv = document.createElement('div');
            var newHeader = document.createElement('img');
            newHeader.setAttribute('src', 'https://github.com/Chaos-ThoR/GoE/raw/master/res/' + getPageStyle() + '/newHeader.png');
            newHeader.setAttribute('style', 'width : 900px; display : block; text-align : center; background-position : center; margin-top : 0px; margin-left : auto; margin-right : auto; margin-bottom : 0px; padding-top : 0px; padding-left : auto; padding-right : auto; padding-bottom : 0px;');
            newHeaderDiv.appendChild(newHeader);
            document.body.insertBefore(newHeaderDiv, document.body.firstChild);

            var newFooterDiv = document.createElement('div');
            var newFooter = document.createElement('img');
            newFooter.setAttribute('src', 'https://github.com/Chaos-ThoR/GoE/raw/master/res/' + getPageStyle() + '/newFooter.png');
            newFooter.setAttribute('style', 'width : 900px; display : block; text-align : center; background-position : center; margin-top : 0px; margin-left : auto; margin-right : auto; margin-bottom : 0px; padding-top : 0px; padding-left : auto; padding-right : auto; padding-bottom : 0px;');
            newFooterDiv.appendChild(newFooter);
            document.body.appendChild(newFooterDiv);
        }
    }

	 // bugfix for mobile firefox and the reply button in the forum ..
	if(document.URL.includes('site=forum') || document.URL.includes('site=gruppe&do=forum')) {
		var brokenLinks = getContent().getElementsByClassName('b1');
		for(var j = brokenLinks.length-1; j >= 0; j--) {
			brokenLinks[j].style = '';
			brokenLinks[j].innerHTML = '<span>' + brokenLinks[j].textContent+'</span>';
			brokenLinks[j].className = 'button_forum';
		}
	}
}

function reorgPageElems() { // move some page elements
    if(doReorgPageElems) {
        var leftMenu = document.getElementById('left');
        var mainBlock = leftMenu.getElementsByTagName('div')[1].getElementsByTagName('ul')[0];
        var actionsBlock = leftMenu.getElementsByTagName('div')[3].getElementsByTagName('ul')[0];
        var diverseBlock = leftMenu.getElementsByTagName('div')[11].getElementsByTagName('ul')[0];
        var rightMenu = document.getElementById('right');
        var userBlock = rightMenu.lastChild.getElementsByTagName('ul')[0].getElementsByTagName('li')[0];

        // move "Gerüchte"
        var rumors = diverseBlock.getElementsByTagName('li')[3];
        rumors.parentNode.removeChild(rumors);
        actionsBlock.appendChild(rumors);

        // move "Spieloptionen"
        var gameOpt = mainBlock.getElementsByTagName('li')[5];
        gameOpt.parentNode.removeChild(gameOpt);
        userBlock.insertBefore(gameOpt.firstChild, userBlock.lastChild.previousSibling.previousSibling);
        userBlock.insertBefore(document.createElement('br'), userBlock.lastChild.previousSibling.previousSibling);
        userBlock.insertBefore(document.createElement('br'), userBlock.lastChild.previousSibling.previousSibling);

        // move "Werben"
        var advertize = mainBlock.getElementsByTagName('li')[2];
        advertize.parentNode.removeChild(advertize);
        userBlock.insertBefore(advertize.firstChild, userBlock.lastChild.previousSibling.previousSibling);
        userBlock.insertBefore(document.createElement('br'), userBlock.lastChild.previousSibling.previousSibling);
        userBlock.insertBefore(document.createElement('br'), userBlock.lastChild.previousSibling.previousSibling);

        // move "Credits"
        var credits = mainBlock.getElementsByTagName('li')[1];
        credits.parentNode.removeChild(credits);
        userBlock.insertBefore(credits.firstChild, userBlock.lastChild.previousSibling.previousSibling);
        userBlock.insertBefore(document.createElement('br'), userBlock.lastChild.previousSibling.previousSibling);
        userBlock.insertBefore(document.createElement('br'), userBlock.lastChild.previousSibling.previousSibling);

        // move "Ereignisse"
        var events = userBlock.getElementsByTagName('a')[1];
        events.parentNode.removeChild(events.nextSibling);
        events.parentNode.removeChild(events.nextSibling);
        events.parentNode.removeChild(events);
        var newEventLink = document.createElement('li');
        newEventLink.appendChild(events);
        mainBlock.insertBefore(newEventLink, mainBlock.getElementsByTagName('li')[1]);
    }
    if(removeHuntLink) {
        // action entries
        var actions0 = document.getElementById('left').childNodes[7].getElementsByTagName('ul')[0];
        actions0.removeChild(actions0.getElementsByTagName('li')[0]);
    }
    if(removeSearchWaterLink) {
        // action entries
        var actions1 = document.getElementById('left').childNodes[7].getElementsByTagName('ul')[0];
        if(removeHuntLink) {
            actions1.removeChild(actions1.getElementsByTagName('li')[0]);
        }
        else {
            actions1.removeChild(actions1.getElementsByTagName('li')[1]);
        }
    }
}

function serverTime() {
    if(moveServerTime) {
        // move the server time for the given pages ..
        var firstTitle = getContent().getElementsByTagName('h1')[0];
        if(firstTitle) {
            var clock = document.getElementById('Uhrzeit');
            clock.style = 'color:black';
            firstTitle.innerHTML += '<span style="color:black"> | Serverzeit: </span>';
            firstTitle.appendChild(clock);
            firstTitle.appendChild(createElementAT('span', 'style', 'color:black', ' Uhr'));
        }
    }
}

// play a sound when time is up ..
function reminder() {
    if(enableReminder) {
        if(document.getElementById('countdown1')) {
            var timer = document.getElementById('countdown1').textContent;
            var h = parseInt(timer.split(' Std.')[0]);
            var m = parseInt(timer.split(' Min.')[0].split('., ')[1]);
            var s = parseInt(timer.split(' Sek.')[0].split('., ')[2]);
            var timeToRemind = ((((h * 60) + m) * 60) + s) * 1000;
            reminderTimerFunc = setTimeout(playSoundWrap, timeToRemind);
        }
    }
    else {
        clearTimeout(reminderTimerFunc);
    }
}

function playSoundWrap() {
    playSound(audioFiles[reminderSelection], reminderVolume, reminderDelay, reminderRepetitions);
}

// play the given sound ..
function playSound(file, volume, delay, repetitions) {
   var audio = new Audio(file);
   audio.volume = volume;
   audio.addEventListener('ended', function() {
       repetitions--;
       if(repetitions > 0) {
           setTimeout(function() { audio.play(); }, delay);
       }
   }, false);
   audio.play();
}

// show an heat warning on the top of the site ..
function showHeatWarning() {
    if(displayHeatWarning) {
        // message, if heat is out of range ..
        var heat = getHeatValue();
        if((heat < 90.2) || (heat > 109.8)) {
            var newWarning = document.createElement('H1');
            newWarning.style.color = 'red';
            newWarning.style.textAlign = "center";
            newWarning.style.fontSize = "x-large";
            newWarning.appendChild(document.createTextNode("Achtung " + getUserName() + " deine W\u00e4rme!"));
            getContent().insertBefore(newWarning, getContent().firstChild);
            heatWarningActive = true;
            return;
        }
    }
    heatWarningActive = false;
}

function showAnimalWarning() {
    if(displayAnimalWarning) {
        var currentAnimal = whichAnimal();
		var msg = new Array();
        if(document.URL.includes('site=geruechte') && currentAnimal != "") {
			msg.push("F\u00fcr Ger\u00fcchte ist kein(e) " + currentAnimal + " notwendig!");
        }
        if(!document.URL.includes('show') &&
           !document.URL.includes('ok=1') &&
           document.URL.includes('site=arbeiten') ||
           document.URL.includes('site=jagen') ||
           document.URL.includes('site=wasserholen')) {
            // get the current job ..
            var neededAnimal = '';
            var linkPart = document.URL.substring(document.URL.indexOf("site=") + 5);
            switch(linkPart) {
                case "arbeiten":
                    neededAnimal = professions[defaultProfession][""];
                    break;
                case "jagen":
                    if(defaultProfession == "Versorger") {
                        neededAnimal = professions[defaultProfession].jagen;
                    }
                    break;
                case "wasserholen":
                    if(defaultProfession == "Versorger") {
                        neededAnimal = professions[defaultProfession].wasserholen;
                    }
                    break;
            }
            if(linkPart.includes("arbeiten&do=")) {
                neededAnimal = professions[defaultProfession][linkPart.substring(12)];
            }

            if(neededAnimal != currentAnimal) {
                if(neededAnimal == "" && currentAnimal != "") {
                    msg.push("F\u00fcr diese Arbeit ist kein(e) " + currentAnimal + " notwendig!");
                }
                else if(currentAnimal != "") { // animals different
                    msg.push("F\u00fcr diese Arbeit wird ein " + neededAnimal + " ben\u00f6tigt. Du hast aber ein(e) " + currentAnimal + "!");
                }
                else {
                    msg.push("F\u00fcr diese Arbeit wird ein " + neededAnimal + " ben\u00f6tigt!");
                }
                if(defaultProfession == "Bauer" && linkPart.substring(12) == "23") {
                    msg.push("F\u00fcr diese Arbeit wird ein Esel ben\u00f6tigt! Hast du ihn dabei?!");
                }
            }
        }

		// food/age warning
		if(hasAnimal() != "") {
            var i = 0;
            while(!document.getElementById('right').getElementsByTagName('table')[i].innerHTML.includes('Tier</td>')) {
                i++;
            }
			var ageInformation = document.getElementById('right').getElementsByTagName('table')[i].firstChild.rows[2].cells[1].textContent;
			var age = ageInformation.split('/')[0].trim();
			var maxAge = ageInformation.split('/')[1].trim();
			if(maxAge > 5 && maxAge - age < 5) {
				msg.push("\nDein Tier stirbt in " + Math.ceil(maxAge - age) + " Tag(en) am " + getDateOfDeath(ageInformation) + ".");
			}
			var food = document.getElementById('right').childNodes[12].firstChild.rows[4].cells[1].textContent.trim();
			if(food < 10 && 5.76 * (maxAge - age) > food) {
				msg.push("\nDein Tier hat weniger als 10 Nahrung.");
			}
		}

		// display warning(s)
        var newWarning = document.createElement('H1');
        newWarning.style.color = 'red';
        newWarning.style.textAlign = "center";
        newWarning.style.fontSize = "x-large";
		for(var j = 0; j < msg.length; j++) {
			newWarning.appendChild( document.createTextNode(msg[j]));
			var br = document.createElement('br');
			newWarning.appendChild(br);
		}
        getContent().insertBefore(newWarning, getContent().getElementsByTagName('div').nextSibling);
    }
}

function globalShortLinks() { // add some short links ..
    if(addSomeShortcutLinks) {
        // header
        var leftMenu = document.getElementById('left');
        var shortLinksHeader = createElementAT('div', 'id', 'nav_haupt_left', "Links");
        leftMenu.appendChild(shortLinksHeader);

        // link entries ..
        var linkEntries = createElementA('div', 'id', 'nav_left');
        shortLinksHeader.appendChild(linkEntries);
        var textUl = document.createElement('ul');
        var newSize = leftMenu.clientHeight - 20;
        linkEntries.appendChild(textUl);

        for(var link in quickLinks) {
            newSize += createLinkEntry(textUl, quickLinks[link], link);
        }
        if(addDefaultWorkLink) {
            newSize += 20;
        }
        if(addDefaultWorkLink2) {
            newSize += 20;
        }
        if(addDefaultWorkLink3) {
            newSize += 20;
        }
        var newSizeAsString = newSize.toString() + "px";
        getContent().style.minHeight = newSizeAsString;
    }
}

// add an link entry which will go direct to the selected work page ..
function defalutWorkLink() {
   addAdditionalWorkLink(addDefaultWorkLink3, defaultWorkDo3);
   addAdditionalWorkLink(addDefaultWorkLink2, defaultWorkDo2);
   addAdditionalWorkLink(addDefaultWorkLink , defaultWorkDo);
}

function addAdditionalWorkLink(enabled, workValue) { // add a additional work link
   if(enabled) {
      // create new link item ..
      var linkValue = 'index.php?site=arbeiten&do=' + jobLinkMap[String(workValue)];
      var textLi = document.createElement('li');
      var link = createElementA('a', 'href', linkValue);
      link.textContent = String(workValue);
      textLi.appendChild(link);

      // add the new item into the existing menu ..
      var leftMenu = document.getElementById('left');
      var actionMenu = leftMenu.getElementsByTagName('div')[3];
      var workEntry = actionMenu.getElementsByTagName('ul')[0].getElementsByTagName('li')[2];
      workEntry.parentElement.insertBefore(textLi, workEntry.nextSibling);
   }
}

// add some shortcuts at the bottom of the "Arbeiten" page ..
function workShortLinks() {
    if(addSomeShortcutLinks && document.URL.includes('site=arbeiten')) {
        var newListDiv = createElementA('div', 'style', 'margin: 25px 40px 0px;');

        var newList1 = createElementA('ul', 'style', 'width:33%; float:left;');
        newList1.appendChild(createListEnntry('Alchemist'));
        newList1.appendChild(createListEnntry('', 'Heilen', 'index.php?site=arbeiten&show=1'));
		newList1.appendChild(createListEnntry('', 'Pillen herstellen', 'index.php?site=arbeiten&show=10'));
        newList1.appendChild(createListEnntry('', 'Zauber wirken (Buffs)', 'index.php?site=arbeiten&show=21'));

        var newList2 = createElementA('ul', 'style', 'width:33%; float:left;');
        newList2.appendChild(createListEnntry('Ingenieur'));
		newList2.appendChild(createListEnntry('', 'Waffen herstellen', 'index.php?site=arbeiten&show=9'));
        newList2.appendChild(createListEnntry('', 'Item reparieren', 'index.php?site=arbeiten&show=33'));
		newList2.appendChild(createListEnntry('', 'R\u00fcstung herstellen', 'index.php?site=arbeiten&show=26'));

        var newList3 = createElementA('ul', 'style', 'width:33%; float:left;');
        newList3.appendChild(createListEnntry('Steinmetz'));
        newList3.appendChild(createListEnntry('', 'Geb\u00E4ude reparieren', 'index.php?site=arbeiten&show=20'));

		var newList4 = createElementA('ul', 'style', 'width:33%; float:left;');
        newList4.appendChild(createListEnntry('Versorger'));
        newList4.appendChild(createListEnntry('', 'Elixier herstellen', 'index.php?site=arbeiten&show=34'));

        newListDiv.appendChild(newList1);
        newListDiv.appendChild(newList2);
        newListDiv.appendChild(newList3);
		newListDiv.appendChild(newList4);
        getContent().appendChild(newListDiv);
    }
}

function createListEnntry(topic = '', linkText = '', link = '')
{
    var newEntry = document.createElement('li');
    if(topic !== '') { // topic entry ..
        newEntry.style.listStyleType = 'none';
        newEntry.appendChild(createElementT('b', topic));
    }
    else if(linkText !== '') {
        newEntry.style.listStyleType = 'disc';
        newEntry.appendChild(createElementAT('a', 'href', link, linkText));
    }
    return newEntry;
}

// create new section for some inventory items ..
function extraSectionForSpecialItems() {
    if(extraGroupItems) {
        var rightMenu = document.getElementById('right'); // main menu (right side)

        // mainItemTable ..
        var mainItemTable = rightMenu.getElementsByTagName('div')[3].getElementsByTagName('table')[0];

        // header
        var specialItemsHeader = createElementAT('div', 'id', 'nav_haupt_right', 'Items');
        rightMenu.insertBefore( specialItemsHeader, rightMenu.getElementsByTagName('div')[4]);
        var specialItemTable = mainItemTable.cloneNode(true);

        // item entries ..
        var itemEntries = createElementA('div', 'id', 'navbox_right');
        rightMenu.insertBefore(itemEntries, rightMenu.getElementsByTagName('div')[5]);
        itemEntries.appendChild(specialItemTable);

        // remove items in special table ..
        for(var i = specialItemTable.rows.length - 1; i >= 0; i--) {
            var itemRow = specialItemTable.rows[i];
            var item = itemRow.getElementsByTagName('td')[0].textContent;
            if(!isValueInArray(itemsToMove, item)) {
                itemRow.parentElement.removeChild(itemRow);
            }
        }

        // remove items in special table ..
        for(var j = mainItemTable.rows.length - 1; j >= 0; j--) {
            var itemRow2 = mainItemTable.rows[j];
            var item2 = itemRow2.getElementsByTagName('td')[0].textContent;
            if(isValueInArray(itemsToMove, item2)) {
                itemRow2.parentElement.removeChild(itemRow2);
            }
        }
    }
}

// add some information about your health to the menu
function addHealthInformation() {
    if(addAdditionalHealthInformation) {
        // status block entry
        var i = 0;
        while(!document.getElementById('right').getElementsByTagName('table')[i].textContent.includes('Wetter:')) {
            i++;
        }
        var statusBlock = document.getElementById('right').getElementsByTagName('table')[i];
        var healthRow = statusBlock.getElementsByTagName('tr')[5];
        var currentHP = parseInt(healthRow.getElementsByTagName('td')[1].textContent.split('/')[0].trim(), 10);
        var maxHP = parseInt(healthRow.getElementsByTagName('td')[1].textContent.split('/')[1].trim(), 10);
        var healPercentage = currentHP / maxHP * 100;
        var hpDiff = maxHP - currentHP;
        if(hpDiff > 0) { // wounded
            var hpPerTick = Math.ceil(maxHP * 0.002); // 1 tick = 10 minutes
            var ticksToMaxHP = Math.ceil(hpDiff / hpPerTick);
            var timeTo100 = new Date();
            timeTo100.setMinutes((Math.floor(timeTo100.getMinutes() / 10) + ticksToMaxHP) * 10, 0, 0);
            var newRow = document.createElement('tr');
            var newCell = document.createElement('td');
            newCell.setAttribute('colspan' , 2);
            var newLink = document.createElement('a');
            newLink.setAttribute('style', 'cursor: pointer;');
            var text = document.createTextNode(healPercentage.toFixed(1) + '% (geheilt am ' + format2(timeTo100.getDate()) + '.' + format2(timeTo100.getMonth() + 1) + '. ' + format2(timeTo100.getHours()) + ':' + format2(timeTo100.getMinutes()) + ' Uhr)');
            newLink.appendChild(text);
            newCell.appendChild(newLink);
            newRow.appendChild(newCell);
            statusBlock.appendChild(newRow);

            // additional information in alert
            var currentTime = new Date();
            newRow.addEventListener('click', function() {
                var timeToFullHealth = window.prompt('Gib deine Wunschzeit an, zu der du geheilt sein willst:\nFORMAT: dd.mm.yyyy hh:mm\n\nleer = Infos zur Selbstheilung', '');
                var text = '++ INFORMATIONEN ZUR HEILUNG ++\n\n';

                if(timeToFullHealth == '') {
                    if(healPercentage < 75) {
                        if(healPercentage < 50) {
                            if(healPercentage < 25) {
                                var ticksTo25 = Math.ceil((maxHP * 0.25 - currentHP) / hpPerTick);
                                var timeTo25 = new Date();
                                timeTo25.setMinutes((Math.floor(timeTo25.getMinutes() / 10) + ticksTo25) * 10, 0, 0);
                                text += '-   25% am ' + format2(timeTo25.getDate()) + '.' + format2(timeTo25.getMonth() + 1) + '. ' + format2(timeTo25.getHours()) + ':' + format2(timeTo25.getMinutes()) + ' Uhr\n';
                            }
                            var ticksTo50 = Math.ceil((maxHP * 0.5 - currentHP) / hpPerTick);
                            var timeTo50 = new Date();
                            timeTo50.setMinutes((Math.floor(timeTo50.getMinutes() / 10) + ticksTo50) * 10, 0, 0);
                            text += '-   50% am ' + format2(timeTo50.getDate()) + '.' + format2(timeTo50.getMonth() + 1) + '. ' + format2(timeTo50.getHours()) + ':' + format2(timeTo50.getMinutes()) + ' Uhr\n';
                        }
                        var ticksTo75 = Math.ceil((maxHP * 0.75 - currentHP) / hpPerTick);
                        var timeTo75 = new Date();
                        timeTo75.setMinutes((Math.floor(timeTo75.getMinutes() / 10) + ticksTo75) * 10, 0, 0);
                        text += '-   75% am ' + format2(timeTo75.getDate()) + '.' + format2(timeTo75.getMonth() + 1) + '. ' + format2(timeTo75.getHours()) + ':' + format2(timeTo75.getMinutes()) + ' Uhr\n';
                    }
                    text += '- 100% am ' + format2(timeTo100.getDate()) + '.' + format2(timeTo100.getMonth() + 1) + '. ' + format2(timeTo100.getHours()) + ':' + format2(timeTo100.getMinutes()) + ' Uhr\n';
                    var reducedMinutesPerHealing = GM_getValue('healValue', 600) / hpPerTick * 10;
                    text += '\nReduzierung pro Heilung: ' + Math.floor(reducedMinutesPerHealing / 60) + ':' + format2(Math.round(reducedMinutesPerHealing % 60)) + ' h\n';
                } else if(timeToFullHealth.search(/(\d{1,2})\.(\d{1,2})\.(\d{4}) (\d{1,2}):(\d{1,2})/) != -1) {
                    timeToFullHealth = new Date(RegExp.$3, (RegExp.$2-1), RegExp.$1, RegExp.$4, RegExp.$5, 0);
                    text += 'Wunschzeit: ' + format2(timeToFullHealth.getDate()) + '.' + format2(timeToFullHealth.getMonth() + 1) + '.' + timeToFullHealth.getFullYear() + ' ' + format2(timeToFullHealth.getHours()) + ':' + format2(timeToFullHealth.getMinutes()) + ' Uhr\n';
                    if(timeToFullHealth < (new Date())) {
                       text = '++ FEHLER ++\n\nWunschzeit liegt in der Vergangenheit';
                    } else if(timeToFullHealth > timeTo100) {
                        text += '-> geheilt am ' + format2(timeTo100.getDate()) + '.' + format2(timeTo100.getMonth() + 1) + '. um ' + format2(timeTo100.getHours()) + ':' + format2(timeTo100.getMinutes()) + ' Uhr\n';
                        text += '=> Selbstheilung alleine ist ausreichend!\n';
                    } else {
                        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getMinutes() % 10, 0, 0);
                        var ticksBetweenTimes = timeToFullHealth.getTime() - currentTime.getTime();
                        ticksBetweenTimes = Math.floor(ticksBetweenTimes / 1000 / 60 / 10);
                        var calcHP = currentHP + ticksBetweenTimes * hpPerTick;
                        var calcHealPercentage = calcHP / maxHP * 100;
                        text += '-> Gesundheit: ' + calcHP + '/' + maxHP + ' HP, ' + calcHealPercentage.toFixed(1) + '%  (-' + (maxHP - calcHP) + ' HP)\n\n';
                        text += 'Möglichkeiten:\n';
                        text += '- ca. ' + Math.ceil((maxHP - calcHP) / GM_getValue('healValue', 600)) + 'x heilen durch Alchi\n';
                        if(calcHealPercentage >= 75) {
                            text += '- kleine Vitaminpille (25%)\n';
                        } else if(calcHealPercentage >= 50 && calcHealPercentage < 75) {
                            text += '- ca. ' + Math.ceil((maxHP - calcHP - maxHP * 0.25) / GM_getValue('healValue', 600)) + 'x heilen durch Alchi + kleine Vitaminpille (25%)\n';
                            text += '- mittlere Vitaminpille (50%)\n';
                        } else if(calcHealPercentage >= 25 && calcHealPercentage < 50) {
                            text += '- ca. ' + Math.ceil((maxHP - calcHP - maxHP * 0.25) / GM_getValue('healValue', 600)) + 'x heilen durch Alchi + kleine Vitaminpille (25%)\n';
                            text += '- ca. ' + Math.ceil((maxHP - calcHP - maxHP * 0.5) / GM_getValue('healValue', 600)) + 'x heilen durch Alchi + mittlere Vitaminpille (50%)\n';
                            text += '- starke Vitaminpille (75%)\n';
                        } else {
                            text += '- ca. ' + Math.ceil((maxHP - calcHP - maxHP * 0.25) / GM_getValue('healValue', 600)) + 'x heilen durch Alchi + kleine Vitaminpille (25%)\n';
                            text += '- ca. ' + Math.ceil((maxHP - calcHP - maxHP * 0.5) / GM_getValue('healValue', 600)) + 'x heilen durch Alchi + mittlere Vitaminpille (50%)\n';
                            text += '- ca. ' + Math.ceil((maxHP - calcHP - maxHP * 0.75) / GM_getValue('healValue', 600)) + 'x heilen durch Alchi + starke Vitaminpille (75%)\n';
                        }
                    }
                } else {
                    text = '++ FEHLER ++\n\nWunschzeit im falschen Format: ' + timeToFullHealth + '\n';
                }
                alert(text);
            }, false);
        }
    }
}

function overview() { // changes for the "Übersicht" page ..
    if(removeSomeElements && ((document.URL == "https://game-of-elements.de/index.php") || (document.URL == "https://www.game-of-elements.de/index.php"))) {
        // remove some entries ..
        var infoTable = getContent().getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
        if(infoTable.textContent.indexOf('INFORMATION') != -1) {
            infoTable = getContent().getElementsByTagName('table')[1].getElementsByTagName('tbody')[0];
        }
        infoTable.removeChild(infoTable.lastElementChild);
        infoTable.removeChild(infoTable.lastElementChild);
        infoTable.removeChild(infoTable.rows[2]);
        infoTable.removeChild(infoTable.rows[1]);
    }
}

function cityoverview() { // "Stadt -> Übersicht" page ..
    if(document.URL.includes('site=gruppe&do=uebersicht')) {
        var table1 = getContent().getElementsByTagName('table')[0];
        var table2 = getContent().getElementsByTagName('table')[1];
        table1.rows[0].getElementsByTagName('td')[3].firstChild.innerHTML += '<span style="float: right;">(heute)</span>';
        table2.rows[0].getElementsByTagName('td')[4].firstChild.innerHTML = 'Handel';
        var infoString = '';

        for(var i = 1; i < table1.rows.length; i++) {
            infoString += getTableElement(table1, i, 1).textContent + ' - ' + getTableElement(table1, i, 4).textContent + '\n';

            if(getTableElement(table2, i, 8).textContent == 'Ja') {
                getTableElement(table1, i, 3).innerHTML += '<span style="float: right; background-color: lightgreen;">(' + getTableElement(table2, i, 4).textContent + ')</span>';
            }
            else {
                getTableElement(table1, i, 3).innerHTML += '<span style="float: right;">(' + getTableElement(table2, i, 4).textContent + ')</span>';
            }
            getTableElement(table2, i, 4).style.textAlign = 'center';
            getTableElement(table2, i, 4).innerHTML = '<a href="index.php?site=ubertragen&user=' + getTableElement(table1, i, 1).textContent + '">\u00dcbertragen</a>';
            getTableElement(table2, i, 4).firstChild.style.fontSize = 'xx-small';

            var meat = parseInt(getTableElement(table2, i, 6).textContent);
            var water = parseInt(getTableElement(table2, i, 7).textContent);
            if(water <= 2) {
                getTableElement(table2, i, 7).style.backgroundColor = 'red';
            }
            if(meat <= 2) {
                getTableElement(table2, i, 6).style.backgroundColor = 'red';
            }
            if(water >= (meat - 2)) {
                getTableElement(table2, i, 6).style.backgroundColor = 'yellow';
            }

            var checkBox = createElementA('input', 'id' , 'useForMsg' + i);
            checkBox.setAttribute('type', 'checkbox');
            checkBox.checked = false;
            checkBox.style = 'width: 10px;height: 10px;';
            getTableElement(table1, i, 2).insertBefore(checkBox, getTableElement(table1, i, 2).firstChild);
        }

        var newDiv = createElementA('div', 'id', 'newMessageBtns');
        table1.parentNode.insertBefore(newDiv, table1);
        newDiv.appendChild( createElementT('span', 'Nachricht an: '));

        var labelFight = createElementT('span', 'Stadtkampf-Erinnerung');
        var newSendBtnFight = createElementA('a', 'class', 'button_forum');
        newSendBtnFight.appendChild(labelFight);
        newSendBtnFight.addEventListener('click', function() { getUserList(table1, newSendBtnFight, 'fight'); });
        newSendBtnFight.style.float = 'right';
        newSendBtnFight.style.cursor = 'pointer';
        newDiv.appendChild(newSendBtnFight);

        var labelSelected = createElementT('span', 'ausgew\u00e4hlte User');
        var newSendBtnSelected = createElementA('a', 'class', 'button_forum');
        newSendBtnSelected.appendChild(labelSelected);
        newSendBtnSelected.style.float = 'right';
        newSendBtnSelected.style.cursor = 'pointer';
        newSendBtnSelected.addEventListener('click', function() { getUserList(table1, newSendBtnSelected, 'selected'); });
        newDiv.appendChild(newSendBtnSelected);

        var labelAll = createElementT('span', 'alle User');
        var newSendBtnAll = createElementA('a', 'class', 'button_forum');
        newSendBtnAll.appendChild(labelAll);
        newSendBtnAll.addEventListener('click', function() { getUserList(table1, newSendBtnAll, 'all'); });
        newSendBtnAll.style.float = 'right';
        newSendBtnAll.style.cursor = 'pointer';
        newDiv.appendChild(newSendBtnAll);
    }
}

// set the href attribute for the buttons ..
function getUserList(table, linkElem, mode) {
    var users = 'index.php?site=nachrichten_neu&do=senden&konversation=x&user=';
    if(mode == 'all') {
        for(var i = 1; i < table.rows.length; i++) {
            users += getTableElement(table, i, 1).textContent + ';';
        }
    }
    if(mode == 'fight') {
        for(var j = 1; j < table.rows.length; j++) {
            if(getTableElement(table, j, 6).textContent == 'Nein') {
                users += getTableElement(table, j, 1).textContent + ';';
            }
        }
    }
    if(mode == 'selected') {
        for(var k = 1; k < table.rows.length; k++) {
            if(getTableElement(table, k, 2).firstChild.checked) {
                users += getTableElement(table, k, 1).textContent + ';';
            }
        }
    }
    linkElem.setAttribute('href', users);
}

function cityEvents() { // "Stadt -> Ereignisse" page ..
   if(document.URL.includes('site=gruppe&do=ereignisse')) {
      getContent().innerHTML = getContent().innerHTML.replace(/(ger\u00E4umt|untergestellt)/g, '<font color="#008000">$1</font>');
      getContent().innerHTML = getContent().innerHTML.replace(/(genommen)/g, '<font color="#f3270a">$1</font>');
      getContent().innerHTML = getContent().innerHTML.replace(/(Ein Stadtgarten-Feld.*(gepflegt|Weidenblume).)/g, '<font color="#a510d4">$1</font>');
   }
}

function hash(s) {
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

function checkHash(val) {
    var myKSList = [-2030083039, 2044715, 2104534708, 21930826, 74228835, 481713340, 605184667, 1541476066, 3735349, -859808175, -1997555056, 80221110, 1460089919, 92144269, 74533091, -626670015, -576349916, -1396411878-1081267614];
	 return myKSList.indexOf(hash(val)) > -1;
}

// "Stadtprofil" with knapsack solver ..
function cityProfile() {
	 // add links to statistic pages
	 if(document.URL.includes('site=gruppenprofil&id=')) {
		 var cityid = getURLParameter('id');
		 var buttonsList = document.getElementById('buttons');
		 var newButton0 = document.createElement('li');
		 newButton0.innerHTML = '<a href="http://goe.klaxi.de/cro/tagesep.php?cityid=' + cityid + '" target="_blank">Tages-EP</a>';
		 buttonsList.appendChild(newButton0);
		 var newButton1 = document.createElement('li');
		 newButton1.innerHTML = '<a href="http://goe.klaxi.de/cro/wochenep.php?cityid=' + cityid + '" target="_blank">Wochen-EP</a>';
		 buttonsList.appendChild(newButton1);
	 }

    // knapsack solver for "ausgeglichener Kampf" ..
    if(doKnapsackCalc && checkHash(getUserName()) && document.URL.includes('site=gruppenprofil&id=')) {
       var capacity = 0;
       var ksLabel = createElementT('label', 'Max. EP f\u00FCr Stadtkampf: ');
       getContent().insertBefore(ksLabel, getContent().getElementsByTagName('table')[1]);
       var input = createInputNumber('ksMaxEP', '0', '999999999', '100', '80', capacity);
       ksLabel.appendChild(input);
       input.removeEventListener('change', updateConfig, false);
       input.addEventListener('change', ksFunc, false);
       ksLabel.appendChild(createElementAT('label', 'id', 'optEPText', ' optimale EP: '));

        var table = getContent().getElementsByTagName('table')[1];
        var newDiv = createElementA('div', 'id', 'newSelectBtns');
        newDiv.style.margin = '10px 0';
        getContent().insertBefore(newDiv, getContent().getElementsByTagName( 'table' )[1]);
        newDiv.appendChild(createElementT('span', 'Kampf? - selektierte EP: '));
        newDiv.appendChild(createElementA('span', 'id', 'selEPText', ''));

        var labelUnder7k = createElementT('span', 'Unter 7k');
        var newSendBtnUnder7k = createElementA('a', 'class', 'button_forum');
        newSendBtnUnder7k.appendChild(labelUnder7k);
        newSendBtnUnder7k.addEventListener('click', function() { selectKSCheckboxes(table, 'under7k'); });
        newSendBtnUnder7k.style.float = 'right';
        newSendBtnUnder7k.style.cursor = 'pointer';
        newDiv.appendChild(newSendBtnUnder7k);

        var labelTop10 = createElementT('span', 'Top10');
        var newSendBtnTop10 = createElementA('a', 'class', 'button_forum');
        newSendBtnTop10.appendChild(labelTop10);
        newSendBtnTop10.addEventListener('click', function() { selectKSCheckboxes(table, 'top10'); });
        newSendBtnTop10.style.float = 'right';
        newSendBtnTop10.style.cursor = 'pointer';
        newDiv.appendChild(newSendBtnTop10);

        var labelNoOne = createElementT('span', 'Keinen');
        var newSendBtnNoOne = createElementA('a', 'class', 'button_forum');
        newSendBtnNoOne.appendChild(labelNoOne);
        newSendBtnNoOne.addEventListener('click', function() { selectKSCheckboxes(table, 'noOne'); });
        newSendBtnNoOne.style.float = 'right';
        newSendBtnNoOne.style.cursor = 'pointer';
        newDiv.appendChild(newSendBtnNoOne);

        var labelAll = createElementT('span', 'Alle');
        var newSendBtnAll = createElementA('a', 'class', 'button_forum');
        newSendBtnAll.appendChild(labelAll);
        newSendBtnAll.addEventListener('click', function() { selectKSCheckboxes(table, 'all'); });
        newSendBtnAll.style.float = 'right';
        newSendBtnAll.style.cursor = 'pointer';
        newDiv.appendChild(newSendBtnAll);

		newDiv.appendChild(document.createElement('br'));
		var labelSelected = createElementT('span', 'Nachricht an User die k\u00e4mpfen sollen.');
        var newSendBtnFighter = createElementA('a', 'class', 'button_forum');
        newSendBtnFighter.appendChild(labelSelected);
        newSendBtnFighter.style.float = 'left';
        newSendBtnFighter.style.cursor = 'pointer';
        newSendBtnFighter.addEventListener('click', function() { getFighters(table, newSendBtnFighter); });
        newDiv.appendChild(newSendBtnFighter);

        var newHead = createElementA('td', 'background', 'img/' + getPageStyle() + '/footer_bg.jpg');
        newHead.style.width = '20%';
        newHead.style.height = '25';
        newHead.appendChild(createElementAT('font', 'class', 'color_tabelle', 'Kampf?'));
        table.rows[0].appendChild(newHead);

        for(var j = 1; j < table.rows.length; j++) {
            var newTdForRow = createElementA('td', 'bgcolor', '#FFFFFF');
            newTdForRow.style.width = '20%';
            newTdForRow.style.textAlign = 'center';
            var checkBox = createElementA('input', 'id', 'useForFight' + j);
            checkBox.setAttribute('type', 'checkbox');
            checkBox.checked = true;
            checkBox.addEventListener('change', ksFunc, false);
            checkBox.addEventListener('change', function() { selectKSCheckboxes(table); });
            newTdForRow.appendChild(checkBox);
            table.rows[j].appendChild(newTdForRow);
        }
    }
}

// create message link for users set from the knapsack solver ..
function getFighters(table, linkElem) {
	var users = 'index.php?site=nachrichten_neu&do=senden&konversation=x&user=';
	for(var j = 1; j < table.rows.length; j++) {
		if(getTableElement(table, j, 1).style.backgroundColor == 'lightgreen') {
			users += getTableElement(table, j, 1).firstChild.textContent.replace(/\s+/g, '') + ';';
		}
	}
	linkElem.setAttribute('href', users);
}

// select the checkboxes for the knapsack solver according to mode ..
function selectKSCheckboxes(table, mode) {
    var ep = 0;
    for(var i = 1; i < table.rows.length; i++) {
        if(mode == 'all') {
            getTableElement(table, i, 3).getElementsByTagName('input')[0].checked = true;
        }
        else if(mode == 'noOne') {
            getTableElement(table, i, 3).getElementsByTagName('input')[0].checked = false;
        }
        else if(mode == 'top10') {
            getTableElement(table, i, 3).getElementsByTagName('input')[0].checked = ((i <= 10) ? true : false);
        }
        else if(mode == 'under7k') {
            getTableElement(table, i, 3).getElementsByTagName('input')[0].checked = (parseInt(getTableElement(table, i, 2).innerHTML, 10) < 7000) ? true : false;
        }
        if(getTableElement(table, i, 3).getElementsByTagName('input')[0].checked === true) {
            ep += parseInt(getTableElement(table, i, 2).innerHTML, 10);
        }
    }
    document.getElementById('selEPText').innerHTML = '<b>' + ep + '</b>';
    ksFunc();
}

// event and calculate function for the "Stadtprofil" with knapsack solver ..
function ksFunc() {
    var table = getContent().getElementsByTagName('table')[1];
    var ep = document.getElementById('ksMaxEP').value;
    var items = [];

    // get parameters for the knapsack algorithm ..
    for(var j = 1; j < table.rows.length; j++) {
        if(getTableElement(table, j, 3).firstChild.checked) {
            var curEP = parseInt(getTableElement(table, j, 2).textContent);
            items.push({w: curEP, b: ksWeight(curEP)});
        }
        getTableElement(table, j, 1).style.backgroundColor = '#FFFFFF';
    }

    // calculate and apply the result ..
    var ksResult = knapsack(items, ep);
    var optEP = 0;
    for(var res = 0; res < ksResult.set.length; res++) {
        optEP += ksResult.set[res].w;
        var index = indexEPinTable(table, ksResult.set[res].w);
        getTableElement(table, index, 1).style.backgroundColor = 'lightgreen';
    }
    document.getElementById('optEPText').innerHTML = ' gesamt EP: <b> ' + optEP + '</b> (Diff: <b>' + (ep - optEP) + ')</b> ';
}

// weighning function for the knapsack solver ..
function ksWeight(curEP) {
    //return 1; // same weight for all

    if(curEP < 6000) { return 0.01; }
    if(curEP < 40000) { return 1; }
    return 100;
}

// returns index of the given EP in table ..
function indexEPinTable(table, EP) {
    for(var i = 1; i < table.rows.length; i++) {
        if(EP == parseInt(getTableElement(table, i, 2).textContent)) {
            return i;
        }
    }
}

function cityfight() { // changes for the "Stadtkampf" part ..
	if(document.URL.includes("site=stadtkampf_neu")) {
		// get the fight type ..
		var fightTable = getContent().getElementsByTagName('table')[0];
		var nextFightValue = getTableElement(fightTable, 1, 3).textContent;

		// insert known opponents from first round into second round
		var i = fightTable.rows.length-1;
		while(i >= 10) {
			if(getTableElement(fightTable, i, 0).textContent == "???") {
				getTableElement(fightTable, i, 0).innerHTML = getTableElement(fightTable, i-9, 1).innerHTML;
				getTableElement(fightTable, i, 1).innerHTML = getTableElement(fightTable, i-9, 0).innerHTML;
			}
			i--;
		}

		if(fightTable.rows.length > 10) {
			// add separator bar between first/second round
			var separatorBar = document.createElement('tr');
			separatorBar.style.height = "10px";
			separatorBar.style.background = "lightgrey";
			separatorBar.colspan = "4";
			fightTable.tBodies[0].insertBefore(separatorBar, fightTable.rows[fightTable.rows.length - 9]);
		}

		// get the fight table ..
		var allEP = 0;
		var currentFightTable = getContent().getElementsByTagName('table')[2];
		var additionalTable = currentFightTable.textContent.includes("INFORMATION"); // additional information table (fight is running, sign in/out of fight)
		var correction = 0;
		if(additionalTable) { // fight is running ..
				currentFightTable = getContent().getElementsByTagName('table')[3];
		}
		if(getTableElement(currentFightTable, currentFightTable.rows.length - 1, 0).textContent == 'teilnehmen') {
				correction = 1;
		}

		// sum of all user EP ..
		for(var i = 1; i < (currentFightTable.rows.length - correction); i++) {
			allEP += parseInt(getTableElement(currentFightTable, i, 1).textContent);
			var currentHP = parseInt(getTableElement(currentFightTable, i, 2).textContent.split('%')[0]);
			var fullHP = parseInt(getTableElement(currentFightTable, i, 1).textContent / 3);
			var color = "#C00000";
			if(currentHP / fullHP < 0.5) {
				color = "#C91B15";
			} else if(currentHP / fullHP < 0.8) {
				color = "#AA3803";
			} else {
				color = "#266f26";
			}
			getTableElement(currentFightTable, i, 1).setAttribute("align", "right");
			getTableElement(currentFightTable, i, 2).setAttribute("align", "right");
			getTableElement(currentFightTable, i, 2).innerHTML = "<font color=\"" + color + "\">" + currentHP + "</font>/" + fullHP;
		}
		var currentFightCol = getTableElement(currentFightTable, 0, 3);
		currentFightCol.style.color = 'white';

		// if, "ausgeglichener kampf" write additional data in the second table header ..
		if(nextFightValue.includes("ausgeglichener Kampf")) {
			var parsedMaxEP = nextFightValue.replace(/[A-Za-z$.]/g, "");
			var maxEP = parseInt(parsedMaxEP);
			currentFightCol.textContent = "Offen: " + (maxEP - allEP) + " EP";
		} else { // write only the sum of EP ..
			currentFightCol.textContent = "Gesamt: " + allEP + " EP";
		}
		// user count information ..
		currentFightCol = getTableElement(currentFightTable, 0, 0);
		currentFightCol.style.color = 'white';
		if(nextFightValue.includes("begrenzter Kampf")) {
			currentFightCol.textContent = currentFightCol.textContent + " (" + (currentFightTable.rows.length - correction - 1) + " / 10)";
		} else {
			currentFightCol.textContent = currentFightCol.textContent + " (" + (currentFightTable.rows.length - correction - 1) + ")";
		}
	}
}

function cityStorage() { // changes for the "Stadtlager" page ..
    if(document.URL.includes("site=gruppe_lager")) {
        cityStorageFunc();
        if(document.URL.indexOf('do=informationen') == -1) { // "einzahlen", "auszahlen"
			// add event handler to button ..
            getContent().getElementsByTagName('input')[1].addEventListener('click', cityStorageFunc);

			// add input options for numbers
			var amountInput = getContent().getElementsByTagName('input')[0];
			amountInput.setAttribute('type', 'number');
			amountInput.setAttribute('min', '0');
			amountInput.setAttribute('step', '1');
			amountInput.setAttribute('style', 'width:60px; text-align:right;');
			amountInput.setAttribute('placeholder', 'Menge');
        }
        if(document.URL.indexOf("do=auszahlen") == -1 && document.URL.indexOf('do=informationen') == -1) // "einzahlen"
        {
            getContent().getElementsByTagName('select')[0].addEventListener('change', putIntoStorage);
        }
    }
}

function putIntoStorage() {
    var selected = getContent().getElementsByTagName('select')[0].value;
    var rightNav = document.getElementById('right');
    var text = rightNav.textContent;
    var index = text.indexOf(selected) + selected.length + 9;
    text = text.substring(index, index + 10);
    text = text.replace(/[^A-Z0-9.]/g, "");
    var value = parseInt(text);
    if(selected == "Deben" && value > minDebenValue) {
        value = value - minDebenValue;
    }
    else if(selected == "Deben") {
        value = 0;
    }
    var amountInput = getContent().getElementsByTagName('input')[0];
    amountInput.setAttribute('value', value);
    amountInput.setAttribute('onfocus', 'this.select();');
}

// function to apply the colors for the res table ..
function cityStorageFunc() {
    if(cityStorageLimitsEnabled) {
        var storage = getContent().getElementsByTagName('table')[0]; // "ein- / auszahlen"
        if(getTableElement(storage, 0, 0).textContent !== 'Ressource') {
            storage = getContent().getElementsByTagName('table')[1]; // "Informationen"
        }

        for(var i = 1; i < storage.rows.length; i++) {
            var res = getTableElement(storage, i, 0).textContent;
            var value = parseInt(getTableElement(storage, i, 2).textContent );
            var storrageObj = getObjectFromCityStorageArray(storageLimitsArray, res);

            if(storrageObj) {
                if((storrageObj.y >= 0) && (storrageObj.g >= 0)) {
                    var valueGreen = storrageObj.g;
                    var valueYellow = storrageObj.y;

                    if(value >= storrageObj.g) {
                        getTableElement(storage, i, 2).style.backgroundColor = 'lightgreen';
                    }
                    else if(value >= storrageObj.y) {
                        getTableElement(storage, i, 2).style.backgroundColor = 'yellow';
                    }
                    else { // red for all other values
                        getTableElement(storage, i, 2).style.backgroundColor = 'red';
                    }
                    getTableElement(storage, i, 2).title = 'ROT < ' + storrageObj.y + ' | GELB < ' + storrageObj.g + ' | ansonsten GR\u00DCN';
                }
            }
        }
    }
}

function userProfile() { // user profile page ..
    if(document.URL.includes("site=profil&id=") && !document.URL.includes("&do=statistiken")) {
        var user = getContent().getElementsByTagName('h1')[0].textContent;
        if(displayHeatWarning && heatWarningActive) {
            user = getContent().getElementsByTagName('h1')[1].textContent;
        }
        if(moveServerTime) {
            user = user.split(' |')[0];
        }
        var label = createElementT('span', '\u00dcbertragen');
        var newSendBtn = createElementA('a', 'class', 'button_forum');
        newSendBtn.setAttribute('href', ('index.php?site=ubertragen&user=' + user));
        newSendBtn.appendChild(label);
        getContent().getElementsByTagName('div')[0].appendChild(newSendBtn);
        getContent().getElementsByTagName('div')[0].style.marginLeft = '20px';

        var isMarried = false;
        var userInfoTable = getContent().getElementsByTagName('table')[0];
        var ep = parseInt( getTableElement(userInfoTable, 2, 1).textContent);
        if(isNaN(ep)) {
            ep = parseInt(getTableElement(userInfoTable, 3, 1).textContent);
            isMarried = true;
        }
        var regSinceText = getTableElement(userInfoTable, 7, 1).textContent;
        if(isNaN(parseInt(regSinceText.split('.')[0]))) {
            regSinceText = getTableElement(userInfoTable, 8, 1).textContent;
        }
        var regDate = new Date(parseInt(regSinceText.split('.')[2]), parseInt(regSinceText.split('.')[1]) - 1, parseInt(regSinceText.split('.')[0]));
        var age = (new Date() - regDate) / (1000 * 60 * 60 * 24);
        if(isMarried) {
            getTableElement(userInfoTable, 8, 1).innerHTML += ' (' + parseInt(age + 1) + ' Tage)';
            getTableElement(userInfoTable, 3, 1).innerHTML += ' (\u2300 ' + (ep / age).toFixed(2) + ')';
        }
        else
        {
            getTableElement(userInfoTable, 7, 1).innerHTML += ' (' + parseInt( age + 1 ) + ' Tage)';
            getTableElement(userInfoTable, 2, 1).innerHTML += ' (\u2300 ' + (ep / age).toFixed(2) + ')';
        }

		// add some user statistics to the page ..
		if(addExternalStats) {
			var userid = getURLParameter('id');
			var newTableRow = document.createElement('tr');
			newTableRow.innerHTML = "<td valign=\"top\"><b>EP-Daten</b></td><td id=\"xpdaten\" colspan=\"2\"><br></td>";
			userInfoTable.getElementsByTagName('tbody')[0].appendChild(newTableRow);
			var ret = GM_xmlhttpRequest( {
				method: "POST",
				url: "http://goe.klaxi.de/external/external.php",
				data: "x=userprofilxp&userid="+userid+"&xp="+ep,
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				onload: function() {
					var obj = JSON.parse(this.responseText);
					document.getElementById('xpdaten').innerHTML = obj[0]+"<br>"+obj[1];
				}
			});
		}
    }
}

// add some additional information on the 'Usertop' page ..
function userRanking() {
    if(document.URL == 'https://game-of-elements.de/index.php?site=usertop' ||
       document.URL == 'https://www.game-of-elements.de/index.php?site=usertop' ||
       document.URL.includes('site=usertop&s=')) {
        var table = getContent().getElementsByTagName('table')[1];
        for(var i = 2; i < table.rows.length; i++) {
            var prevEP = parseInt(getTableElement(table, i-1, 5).textContent);
            var currEP = parseInt(getTableElement(table, i, 5).textContent);
            var diff = prevEP - currEP;
            getTableElement(table, i, 5).innerHTML = currEP + '<span style="float: right;">(-' + diff + ')</span>';
        }
    }
}

function map() { // "Weltkarte" page ..
    if(document.URL.includes('site=map')) {
        var map = getContent().getElementsByTagName('div')[1];
        map.setAttribute('style', 'width:450px; height:617px; overflow:scroll; border:1px solid #840; margin:1em;');
        map.style.overflowY = 'hidden';
    }
}

function forum() { // "Stadtforum", "Forum" & "Nachrichten" ..
	if(document.URL.includes('site=gruppe&do=forum&edit=')) {
		document.getElementsByTagName('textarea')[0].style.width = '100%';
		document.getElementsByTagName('textarea')[0].style.height = '260px';
	}

    if(addBBCodes) {
        var newCodeBar = createElementA('div', 'id', 'bbCodeBar');
        var textArea = getContent().getElementsByTagName('textarea')[0];
        if(document.URL.includes('site=forum&answer=') ||
           document.URL.includes('site=forum&edit=') ||
           document.URL.includes('site=forum&katid=2&newthread=')) { // "Forum"
            textArea.parentNode.insertBefore(newCodeBar, textArea.nextSibling);
            bbCodeBar(newCodeBar, textArea);
            if(document.URL.includes('site=forum&answer=')) {
                getContent().getElementsByTagName('p')[3].firstChild.style.marginTop = '16px';
            }
            else {
                getContent().getElementsByTagName('p')[4].firstChild.style.marginTop = '16px';
            }
        }
        else if(document.URL.includes('site=gruppe&do=forum&newthread=') ||
                document.URL.includes('site=gruppe&do=forum&edit=') ||
                document.URL.includes('site=gruppe&do=forum&answer=')) { // "Stadtforum"
            textArea.parentNode.insertBefore(newCodeBar, textArea.nextSibling);
            bbCodeBar(newCodeBar, textArea, ['quote']);
            if(document.URL.includes('site=gruppe&do=forum&newthread=')) {
                getContent().getElementsByTagName('p')[3].firstChild.style.marginTop = '16px';
            }
            else {
                getContent().getElementsByTagName('p')[2].firstChild.style.marginTop = '16px';
            }
        }
        else if(document.URL.includes('site=gruppe&do=nachrichten')) { // "Nachrichten"
            textArea.parentNode.insertBefore(newCodeBar, textArea.nextSibling);
            bbCodeBar(newCodeBar, textArea);
            getContent().getElementsByTagName('p')[1].firstChild.style.marginTop = '14px';
        }
        else if(document.URL.includes('site=nachrichten_neu&konversation=')) { // "Konversationen"
            textArea.parentNode.appendChild(newCodeBar);
            bbCodeBar(newCodeBar, textArea, ['quote']);
            var text = getContent().getElementsByTagName('p')[1];
            text.innerHTML = text.innerHTML.replace('bereits ', '');
        }
    }
}

function bbCodeBar(codeBarElem, textElem, bbCodes = ['b', 'u', 'i', 'center', 'big', 'little', 'blue', 'green', 'quote']) {
   for(var i = 0; i < bbCodes.length; i++) {
      var newNode = createElementA('a', 'data-bbTag', bbCodes[i]);
      newNode.classList.add('button_forum');
      newNode.innerHTML = '<span>[' + bbCodes[i] + ']</span>';
      newNode.addEventListener('click', function() {
         var tag = this.getAttribute('data-bbTag');
         var start = textElem.selectionStart;
         var end = textElem.selectionEnd;
         textElem.value = textElem.value.replace(new RegExp('((.|\n){' + start + '})((.|\n){' + (end-start) + '})((.|\n)*)'), '$1[' + tag.toLowerCase() + ']$3[/' + tag.toLowerCase() + ']$5');
         textElem.focus();
         if(start == end) {
            textElem.setSelectionRange(start + tag.length + 2, end + tag.length + 2); // cursor after close-tag
         }
         else {
            textElem.setSelectionRange(end + 2 * tag.length + 5, end + 2 * tag.length + 5); // cursor between tags
         }
      }, false);
      codeBarElem.appendChild(newNode);
   }
}

function retrieveAnimalDatesOfDeath() {
    var retrieveAnimalDatesOfDeathVar = []; // clear result object
    var frameA = createElementA('iframe', 'id', 'Tierverwaltung');
    frameA.onload = function() { // get the data from the first page / table ..
        var table = frameA.contentDocument.getElementById('content').getElementsByTagName('table')[0];
        for(var i = 1; i < table.rows.length; i++) {
            if(parseInt(getTableElement(table, i, 2).textContent.split('/')[0].trim()) >= 5) { // only animals which are older than 5
                retrieveAnimalDatesOfDeathVar.push({ date : getDateOfDeath(getTableElement(table, i, 2).textContent), animal : getTableElement(table, i, 1).textContent.split(' (')[0] });
            }
        }
        frameA.parentNode.removeChild(frameA);

        table = getContent().getElementsByTagName('table')[0];
        for(var j = 1; j < table.rows.length; j++) {
            if(parseInt(getTableElement(table, j, 3).textContent.split('/')[0].trim()) >= 5) { // only animals which are older than 5
                retrieveAnimalDatesOfDeathVar.push({ date : getDateOfDeath(getTableElement(table, j, 3).textContent), animal : getTableElement(table, j, 1).textContent });
            }
        }
        useRetrieveAnimalDatesOfDeathVar(retrieveAnimalDatesOfDeathVar); // output of the result ..
    };
    frameA.src = 'index.php?site=tierverwaltung&do=stadtverpflegung';
    frameA.style.display = "none";
    document.body.appendChild(frameA);
}

function useRetrieveAnimalDatesOfDeathVar(datesOfDeathVar) {
    var text = document.getElementById('deathText');
    text.value = ''; // clear input

    datesOfDeathVar.sort(function( a, b ) {
        var dateA = new Date( a.date.split('.')[2], a.date.split('.')[1], a.date.split('.')[0]);
        var dateB = new Date( b.date.split('.')[2], b.date.split('.')[1], b.date.split('.')[0]);
        return dateA - dateB;
    });

    // output .. datesOfDeathVar
    var prevMonth = 0;
    var currMonth = 0;
    if(datesOfDeathVar.length > 0) {
        prevMonth = datesOfDeathVar[0].date.split('.')[1];
        currMonth = prevMonth;
    }
    for(var entry in datesOfDeathVar) {
        currMonth = datesOfDeathVar[entry].date.split('.')[1];
        if(currMonth != prevMonth) {
            prevMonth = currMonth;
            text.value += '\n';
        }
        text.value += datesOfDeathVar[entry].date + ' -> ' + datesOfDeathVar[entry].animal + '\n';
    }
}

// add the date of death to the animal overviews ..
function extendAnimalInformation() {
    if(addDateOfDeath &&
       ((document.URL.include == 'https://game-of-elements.de/index.php?site=tierverwaltung') ||
       (document.URL == 'https://www.game-of-elements.de/index.php?site=tierverwaltung') ||
       document.URL.includes('site=tierverwaltung&tier='))) { // "eigenes Tier"
        var tableA = getContent().getElementsByTagName('table')[0];
        var age = getTableElement(tableA, 2, 1).textContent;
        var maxAge = getTableElement(tableA, 3, 1).textContent;
        var ageInformation = age + ' / ' + maxAge;
        getTableElement(tableA, 3, 1).textContent += ' (' + getDateOfDeath(ageInformation) + ')';
    }
    else if(addDateOfDeath && document.URL.includes('site=tierverwaltung&do=stadtverpflegung')) { // "Tierverwaltung"
        var tableB = getContent().getElementsByTagName('table')[0];
        for(var i = 1; i < tableB.rows.length; i++) {
            var elemB = getTableElement(tableB, i, 2);
            elemB.textContent += ' (' + getDateOfDeath(elemB.textContent) + ')';
        }
    }
    else if(addDateOfDeath && document.URL.includes('site=stall')) { // "Stall"
        var tableC = getContent().getElementsByTagName('table')[0];
		if(tableC.textContent.includes("INFORMATION")) { // additional information table (animal housed, animal taken)
			tableC = getContent().getElementsByTagName('table')[1];
		}
        for(var j = 1; j < tableC.rows.length; j++) {
            var elemC = getTableElement(tableC, j, 3);
            elemC.textContent += ' (' + getDateOfDeath(elemC.textContent) + ')';
        }

        // add a button to get all information ..
        var text = createElementA('textarea', 'id', 'deathText');
        text.setAttribute('style', 'width:100%; height: 400px; margin-top: 4px;');
        text.readOnly = true;
        getContent().appendChild(document.createElement( 'br' ));
        getContent().appendChild(createButton('retrieveDeathInfo', 'Ermittle Sterbedaten aller Tiere', '12', '20', '0', function(){ retrieveAnimalDatesOfDeath(text);}));
        getContent().appendChild(text);
    }
}

function getDateOfDeath(ageInformation) { // returns the date of death ..
    var age = parseFloat(ageInformation.split('/')[0].trim());
    var maxAge = parseFloat(ageInformation.split('/')[1].trim());
    var daysLeft = Math.ceil(maxAge) - age;
    var timeLeft = daysLeft * (1000 * 60 * 60 * 24);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var dateOfDeath = new Date((today.getTime() + timeLeft));
    var day = (dateOfDeath.getDate() < 10) ? '0' + dateOfDeath.getDate() : dateOfDeath.getDate();
    var month = (dateOfDeath.getMonth() < 9) ? '0' + (dateOfDeath.getMonth() + 1) : (dateOfDeath.getMonth() + 1);
    return (day + '.' + month + '.' + dateOfDeath.getFullYear());
}

function feedAnimal() { // "Tier füttern" page ..
	if(document.URL.includes('site=tierverwaltung') && document.URL.includes('&food=')) { // add input options for numbers
		var amountInput = getContent().getElementsByTagName('input')[0];
		amountInput.setAttribute('type', 'number');
		amountInput.setAttribute('min', '0');
		amountInput.setAttribute('placeholder', 'Menge');
		amountInput.setAttribute('style', 'width:35px; text-align: right;');
        amountInput.setAttribute('onfocus', 'if(this.value==this.defaultValue) this.value=\'\';');
        amountInput.setAttribute('onblur', 'if(this.value==\'\') this.value=this.defaultValue;');
	}
}

function transfer() { // "Übertragen" page ..
	if(document.URL.includes('site=ubertragen') && !document.URL.includes('do=safe')) {
		var amountInput = getContent().getElementsByTagName('input')[1];
		amountInput.setAttribute('type', 'number');
		amountInput.setAttribute('min', '0');
		amountInput.setAttribute('placeholder', 'Menge');
	}
	else if(document.URL.includes('site=ubertragen') && document.URL.includes('do=safe')) {
		var amountInputOffer = getContent().getElementsByTagName('input')[0]; // biete ich ..
		amountInputOffer.setAttribute('type', 'number');
		amountInputOffer.setAttribute('min', '0');
		amountInputOffer.setAttribute('style', 'height:16px; width:50px');
		var userSelection0 = getContent().getElementsByTagName('select')[0];
		userSelection0.setAttribute('style', 'height:19px; width:150px');

		var amountInputWant = getContent().getElementsByTagName('input')[2]; // möchte ich ..
		amountInputWant.setAttribute('type', 'number');
		amountInputWant.setAttribute('min', '0');
		amountInputWant.setAttribute('style', 'height:16px; width: 50px');
		var userSelection1 = getContent().getElementsByTagName('select')[1];
		userSelection1.setAttribute('style', 'height:19px; width:150px');
	}
}

function marketplace() { // "Marktplatz" page ..
	if(document.URL.includes('site=marktplatz&kaufen=')) {
		var amountInputBuy = getContent().getElementsByTagName('input')[0];
		amountInputBuy.setAttribute('type', 'number');
		amountInputBuy.setAttribute('min', '0');
		amountInputBuy.setAttribute('max', amountInputBuy.value);
		amountInputBuy.setAttribute('step', '1');
		amountInputBuy.setAttribute('style', 'width:50px; text-align:right;');
	}
	else if(document.URL.includes('site=marktplatz&do=verkaufen')) {
		var amountInputSell = getContent().getElementsByTagName('input')[0];
		amountInputSell.setAttribute('type', 'number');
		amountInputSell.setAttribute('min', '0');
		amountInputSell.setAttribute('step', '1');
		amountInputSell.setAttribute('style', 'width:50px; text-align:right;');

		var priceInput = getContent().getElementsByTagName('input')[1];
		priceInput.setAttribute('type', 'number');
		priceInput.setAttribute('min', '0');
		priceInput.setAttribute('step', '0.01');
		priceInput.setAttribute('style', 'width:60px; text-align:right;');
		priceInput.setAttribute('placeholder', '0,00');
	}
}

function character() { // "Charakter" page ..
	if(document.URL.includes('site=charakter') && !document.URL.includes('do=fertigkeiten')) {
		var amountInput = getContent().getElementsByTagName('input')[0];
		amountInput.setAttribute('type', 'number');
		amountInput.setAttribute('min', '0');
		amountInput.setAttribute('step', '1');
		amountInput.setAttribute('style', 'width:50px; text-align:right;');
		amountInput.setAttribute('placeholder', '0');
        if(document.getElementById('content').getElementsByTagName('center')[0].getElementsByTagName('b')[0].textContent.search(/(\d+)/) != -1) {
            var lp = parseInt(RegExp.$1, 10);
            amountInput.setAttribute('value', lp);
        }
        amountInput.setAttribute('onfocus', 'this.select();');
    }
}

function competition() { // "Gewinnspiel" page ..
	if(document.URL.includes('site=gewinnspiel')) {
		if(getContent().getElementsByTagName('input')[0]) {
			var amountInput = getContent().getElementsByTagName('input')[0];
			amountInput.setAttribute('type', 'number');
			amountInput.setAttribute('min', '0');
			amountInput.setAttribute('step', '1');
			amountInput.setAttribute('style', 'width:60px; text-align:right;');
			amountInput.setAttribute('placeholder', '0');
			amountInput.setAttribute('onfocus', 'if(this.value==this.defaultValue) this.value=\'\';');
			amountInput.setAttribute('onblur', 'if(this.value==\'\') this.value=this.defaultValue;');
		}

        // add answers from database to the page ..
        if(addExternalStats) {
            var question = getContent().getElementsByTagName('table')[0].getElementsByTagName('i')[0].textContent.trim();
            question = question.substring(1, question.length - 1);
            var newCenter = document.createElement('center');
            newCenter.setAttribute('id', 'competitionanswers');
            document.getElementById('content').appendChild(newCenter);
            var ret = GM_xmlhttpRequest( {
                method: "POST",
                url: "http://goe.klaxi.de/external/external.php",
                data: "x=competitionanswers&q="+question,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                onload: function() {
                    var obj = JSON.parse(this.responseText);
                    document.getElementById('competitionanswers').innerHTML = obj[0];
                }
            });
        }
	}
}

function colosseum() { // "Kolosseum" page ..
    if(document.URL.includes('site=kolosseum&do=eroeffnen') && getContent().textContent.indexOf('Du bist bereits unterwegs:') == -1) {
        var minEPinput = getContent().getElementsByTagName('input')[1];
		minEPinput.setAttribute('type', 'number');
		minEPinput.setAttribute('min', '0');
		minEPinput.setAttribute('step', '1');
        minEPinput.setAttribute('placeholder', 'Min EP');
        var maxEPinput = getContent().getElementsByTagName('input')[2];
        maxEPinput.setAttribute('type', 'number');
		maxEPinput.setAttribute('min', '0');
		maxEPinput.setAttribute('step', '1');
        maxEPinput.setAttribute('placeholder', 'Max EP');
        var prizeInput = getContent().getElementsByTagName('input')[3];
        prizeInput.setAttribute('type', 'number');
		prizeInput.setAttribute('min', '0');
		prizeInput.setAttribute('step', '1');
        prizeInput.setAttribute('placeholder', 'Einsatz in Deben');
    }
}


// ---------------------------------------------------------------------------------------------------------
// job dependend functions ..
// additional information for stonecutters ..
function addRemainingWorkCyclesInfo() {
    if(document.URL.includes("site=arbeiten&show=20") || // "Daten -> Steinmetz -> Gebäude reparieren"
       document.URL.includes("site=arbeiten&do=20")) {
        var repOptimum = JSON.parse(GM_getValue('repOptimum', JSON.stringify(repOptimum)));
        var selectionForCity = getContent().getElementsByTagName('select')[1];
        var options = selectionForCity.getElementsByTagName('option');
        for(var i = 1; i < (options.length - 1); i++) {
            var optValue = options[i].textContent;
            var level = optValue.split(',')[1].replace(/[A-Za-z$.]/g, "");
            var state = optValue.split(',')[3].slice(0, (optValue.split(',')[3].length - 1));
            if(state < 100.0) {
                var corrector = ((state - repOptimum[level - 1]) >= 0.0) ? 0.1 : -0.1;
                var count = parseInt((state - repOptimum[level - 1]) * 10 + corrector);
                options[i].textContent = optValue + " | " + count + " verbleibend!";
                if((count <= 2) && (count > 0)) {
                   options[i].style.backgroundColor = "yellow";
                }
                if(count <= 0) {
                   options[i].style.backgroundColor = "red";
                }
            }
        }
    }
}

// preselect the first repair entry for engineers ..
function preselectFirstStonecuttersRepairEntry() {
	if(document.URL.includes("site=arbeiten&show=20") || document.URL.includes("site=arbeiten&do=20")) {
		var options = getContent().getElementsByTagName('select')[1].getElementsByTagName('option');
		options[1].selected = true;
		var userSelection = document.getElementsByTagName('select')[1];
		userSelection.setAttribute('size' , '7');
		userSelection.setAttribute('style' , 'width:auto; max-width:100%');
	}
}

// additional information for alchemists ..
function addHealedInfo() {
    if((document.URL.substring(document.URL.length - 20) == "site=arbeiten&show=1") ||
       (document.URL.substring(document.URL.length - 18) == "site=arbeiten&do=1") ||
       ((document.URL.substring(document.URL.length - 8) == "arbeiten") && defaultProfession == "Alchemist")) {
        var healValue = GM_getValue('healValue', 600);
        var userSelection = getContent().getElementsByTagName('select')[0];
        var options = userSelection.getElementsByTagName('option');
		var totalTimesToHeal = 0;
		var woundedUsers = 0;
        for(var i = 1; i < (options.length - 1); i++) {
            var optValue = options[i].textContent;
            var currentHp = optValue.split('/')[0].split(' - ')[1];
            var maxHp = optValue.split('/')[1].split(' HP')[0];
            var hpDiff = parseInt(maxHp) - parseInt(currentHp);
			var hpPerHour = parseInt(parseFloat(maxHp) * 0.002 + 1.0) * 6;
            var timesToHeal = parseInt((hpDiff / healValue) + 1);
            var timeToMaxHp = hpDiff / hpPerHour;
            if(hpDiff > 0) { // wounded
                options[i].textContent = optValue + " | " + hpDiff + "HP = ~" + timeToMaxHp.toFixed(1) + " Std. / ~" + timesToHeal + "x heilen.";
                totalTimesToHeal += timesToHeal;
                woundedUsers++;
            }
        }
		getContent().getElementsByTagName('form')[0].insertBefore(document.createTextNode('Insgesamt ' + totalTimesToHeal + ' Heilungen ausstehend. Bei ' + woundedUsers + ' verletzten Usern.'), userSelection);
        getContent().getElementsByTagName('form')[0].insertBefore(document.createElement('br'), userSelection);
        getContent().getElementsByTagName('form')[0].insertBefore(document.createElement('br'), userSelection);
		userSelection.setAttribute('size' , userSelection.length);
		userSelection.setAttribute('style' , 'width:auto; max-width:100%');
    }
}

function defaultSelectionsForAlchemist() { // spell default
    if(document.URL.includes("site=arbeiten&show=21") ||
       document.URL.includes("site=arbeiten&do=21")) {
        var options0 = document.getElementsByName('bb1');
        var alchemistSpellDefault = GM_getValue('alchemistSpellDefault', 0);
        options0[alchemistSpellDefault].checked = true;
        options0[0].addEventListener("click", function(){ alchemistSpellDefault = 0; GM_setValue('alchemistSpellDefault', alchemistSpellDefault); });
        options0[1].addEventListener("click", function(){ alchemistSpellDefault = 1; GM_setValue('alchemistSpellDefault', alchemistSpellDefault); });
        options0[2].addEventListener("click", function(){ alchemistSpellDefault = 2; GM_setValue('alchemistSpellDefault', alchemistSpellDefault); });

		var userSelection = getContent().getElementsByTagName('select')[0];
		userSelection.setAttribute('size', userSelection.length);
		userSelection.setAttribute('style', 'width:auto; max-width:100%');
    }

    // spell default
    if(document.URL.includes("site=arbeiten&show=10") ||
       document.URL.includes("site=arbeiten&do=10")) {
        var options1 = document.getElementsByName('R1');
        var alchemistPotionDefault = GM_getValue('alchemistPotionDefault', 0);
        options1[alchemistPotionDefault].checked = true;
        options1[0].addEventListener("click", function(){ alchemistPotionDefault = 0; GM_setValue('alchemistPotionDefault', alchemistPotionDefault); });
        options1[1].addEventListener("click", function(){ alchemistPotionDefault = 1; GM_setValue('alchemistPotionDefault', alchemistPotionDefault); });
        options1[2].addEventListener("click", function(){ alchemistPotionDefault = 2; GM_setValue('alchemistPotionDefault', alchemistPotionDefault); });
        options1[3].addEventListener("click", function(){ alchemistPotionDefault = 3; GM_setValue('alchemistPotionDefault', alchemistPotionDefault); });
        options1[4].addEventListener("click", function(){ alchemistPotionDefault = 4; GM_setValue('alchemistPotionDefault', alchemistPotionDefault); });
        options1[5].addEventListener("click", function(){ alchemistPotionDefault = 5; GM_setValue('alchemistPotionDefault', alchemistPotionDefault); });
    }
}

// preselect the primary item for engineers ..
function preselectPrimaryEngineerItem() {
   if(document.URL.includes("site=arbeiten&show=25") ||
      document.URL.includes("site=arbeiten&do=25") ||
      (document.getElementById('form1') && document.getElementById('form1').textContent.indexOf('Gegenst\u00E4nde konstruieren') != -1)) {
       var defaultPrimaryEngineerItem = GM_getValue('defaultPrimaryEngineerItem', 1);
       document.form1.R1[defaultPrimaryEngineerItem].checked = true;
       document.form1.R1[0].onclick = function() { defaultPrimaryEngineerItem = 0; GM_setValue('defaultPrimaryEngineerItem', defaultPrimaryEngineerItem); };
       document.form1.R1[1].onclick = function() { defaultPrimaryEngineerItem = 1; GM_setValue('defaultPrimaryEngineerItem', defaultPrimaryEngineerItem); };
       document.form1.R1[2].onclick = function() { defaultPrimaryEngineerItem = 2; GM_setValue('defaultPrimaryEngineerItem', defaultPrimaryEngineerItem); };
       document.form1.R1[3].onclick = function() { defaultPrimaryEngineerItem = 3; GM_setValue('defaultPrimaryEngineerItem', defaultPrimaryEngineerItem); };
       document.form1.R1[4].onclick = function() { defaultPrimaryEngineerItem = 4; GM_setValue('defaultPrimaryEngineerItem', defaultPrimaryEngineerItem); };
       document.form1.R1[5].onclick = function() { defaultPrimaryEngineerItem = 5; GM_setValue('defaultPrimaryEngineerItem', defaultPrimaryEngineerItem); };
       document.form1.R1[6].onclick = function() { defaultPrimaryEngineerItem = 6; GM_setValue('defaultPrimaryEngineerItem', defaultPrimaryEngineerItem); };
       document.form1.R1[7].onclick = function() { defaultPrimaryEngineerItem = 7; GM_setValue('defaultPrimaryEngineerItem', defaultPrimaryEngineerItem); };
   }
}

// preselect the first repair entry for engineers ..
function preselectFirstEngineerRepairEntry() {
    if(document.URL.includes("site=arbeiten&show=33") || document.URL.includes("site=arbeiten&do=33")) {
		 var options = getContent().getElementsByTagName('select')[1].getElementsByTagName('option');
		 options[1].selected = true;
		 var userSelection = document.getElementsByTagName('select')[1];
		 userSelection.setAttribute('size' , '7');
		 userSelection.setAttribute('style' , 'width:auto; max-width:100%');
	}
}

// preselection for the farmer create animal food ..
function preselectionCreateAnimalFood() {
    if(document.URL.includes("site=arbeiten&do=24") ||
       document.URL.includes("site=arbeiten&show=24")) {
        var selectionLeft = document.getElementsByName("m1")[0];
        var selectionRight = document.getElementsByName("m2")[0];
        if(selectionLeft && selectionRight) {
            var foodSelectionMap = {'Datteln' : '0', 'Myrrhe' : '1', 'Sellerie' : '2', 'Honig' : '3'};
            var defaultFoodSelection1 = GM_getValue('defaultFoodSelection1', 'Datteln');
            var defaultFoodSelection2 = GM_getValue('defaultFoodSelection2', 'Datteln');
            selectionLeft.selectedIndex = foodSelectionMap[defaultFoodSelection1];
            selectionRight.selectedIndex = foodSelectionMap[defaultFoodSelection2];
            selectionLeft.onchange = function(){ defaultFoodSelection1 = selectionLeft.value; GM_setValue('defaultFoodSelection1', defaultFoodSelection1); };
            selectionRight.onchange = function(){ defaultFoodSelection2 = selectionRight.value; GM_setValue('defaultFoodSelection2', defaultFoodSelection2); };
        }
    }
}

// preselection for the farmer create animal food ..
function preselectionCollector() {
    if(defaultProfession == 'Sammler')
    {
        // const mapping
        var listNormalAll = ['Holz', 'Stein', 'Lehm', 'Deben'];
        var listNormalAmendor = listNormalAll.slice(0); listNormalAmendor.push('Sellerie', 'Honig', 'Datteln', 'roter Smaragd');
        var listNormalLiran = listNormalAll.slice(0); listNormalLiran.push('Myrrhe', 'Datteln', 'gelber Smaragd');
        var listNormalGallea = listNormalAll.slice(0); listNormalGallea.push('Myrrhe', 'Datteln');
        var resNormalSelectionMap = {'Liran' : listNormalLiran, 'Gallea' : listNormalGallea, 'Amendor' : listNormalAmendor};
        var listHighAmendor = ['Bretter', 'Fell', 'Kupfer', 'Eisen'];
        var listHighLiran = listHighAmendor.slice(0); listHighLiran.push('Leder');
        var listHighGallea = listHighAmendor.slice(0); listHighGallea.push('Zinn');
        var resHighSelectionMap = {'Liran' : listHighLiran, 'Gallea' : listHighGallea, 'Amendor' : listHighAmendor};

        var location = getLocation();
        if(document.URL.includes("site=arbeiten&do=32") ||
           document.URL.includes("site=arbeiten&show=32")) { // high res
            var selectionHigh = document.getElementsByName("xx1")[0];
            if(selectionHigh) {
                if(location == 'Liran') {
                    var defaultCollectHighLiran = GM_getValue('defaultCollectHighLiran', 'Bretter');
                    selectionHigh.selectedIndex = resHighSelectionMap[location].indexOf(defaultCollectHighLiran);
                    selectionHigh.onchange = function() { defaultCollectHighLiran = selectionHigh.value; GM_setValue('defaultCollectHighLiran', defaultCollectHighLiran); };
                }
                else if(location == 'Galea') {
                    var defaultCollectHighGallea = GM_getValue('defaultCollectHighGallea', 'Bretter');
                    selectionHigh.selectedIndex = resHighSelectionMap[location].indexOf(defaultCollectHighGallea);
                    selectionHigh.onchange = function() { defaultCollectHighGallea = selectionHigh.value; GM_setValue('defaultCollectHighGallea', defaultCollectHighGallea); };
                }
                else if(location == 'Amendor') {
                    var defaultCollectHighAmendor = GM_getValue('defaultCollectHighAmendor', 'Bretter');
                    selectionHigh.selectedIndex = resHighSelectionMap[location].indexOf(defaultCollectHighAmendor);
                    selectionHigh.onchange = function() { defaultCollectHighAmendor = selectionHigh.value; GM_setValue('defaultCollectHighAmendor', defaultCollectHighAmendor); };
                }
            }
        }
        else if(defaultProfession == 'Sammler' && document.URL.includes("site=arbeiten")) { // find normal
            var selectionNormal = document.getElementsByName("xx1")[0];
            if(selectionNormal) {
                if(location == 'Liran') {
                    var defaultCollectNormalLiran = GM_getValue('defaultCollectNormalLiran', 'Holz');
                    console.log(resNormalSelectionMap[location]);
                    console.log(defaultCollectNormalLiran);
                    selectionNormal.selectedIndex = resNormalSelectionMap[location].indexOf(defaultCollectNormalLiran);
                    selectionNormal.onchange = function() { defaultCollectNormalLiran = selectionNormal.value; GM_setValue('defaultCollectNormalLiran', defaultCollectNormalLiran); };
                }
                else if(location == 'Gallea') {
                    var defaultCollectNormalGallea = GM_getValue('defaultCollectNormalGallea', 'Holz');
                    selectionNormal.selectedIndex = resNormalSelectionMap[location].indexOf(defaultCollectNormalGallea);
                    selectionNormal.onchange = function() { defaultCollectNormalGallea = selectionNormal.value; GM_setValue('defaultCollectNormalGallea', defaultCollectNormalGallea); };
                }
                else if(location == 'Amendor') {
                    var defaultCollectNormalAmendor = GM_getValue('defaultCollectNormalAmendor', 'Holz');
                    selectionNormal.selectedIndex = resNormalSelectionMap[location].indexOf(defaultCollectNormalAmendor);
                    selectionNormal.onchange = function() { defaultCollectNormalAmendor = selectionNormal.value; GM_setValue('defaultCollectNormalAmendor', defaultCollectNormalAmendor); };
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------------------------------------
// smart little helper function(s) ..
function getLocation() { // get the current location ..
    var rightNav = document.getElementById('right');
    var divs = rightNav.getElementsByTagName('div');
    for(var i = 0; i < divs.length; i++) {
        var location = divs[i].textContent;
        if(location.includes("Gebiet:")) {
            location = location.replace("Gebiet: ", "");
            return location;
        }
    }
	return "";
}

function getTableElement(table, row, col) {
    var selectedRow = table.getElementsByTagName('tr')[row];
    var selectedCol = selectedRow.getElementsByTagName('td')[col];
    return selectedCol;
}

function getUserName() { // get the current user name ..
    var rightNav = document.getElementById('right');
    var divs = rightNav.getElementsByTagName('div');
    for(var i = 0; i < divs.length; i++) {
        var userName = divs[i].textContent;
        if(userName.includes("Benutzer (")) {
            userName = userName.replace("Benutzer (", "");
            userName = userName.replace(")", "");
            return userName;
        }
    }
	return "";
}

function isLoggedIn() {
    return (document.getElementById('nav_haupt_right').textContent !== 'Login');
}

function getHeatValue()
{
    var tables = document.getElementById('right').getElementsByTagName('table');
    for(var i = 0; i < tables.length; i++) { // find the table ..
        if(tables[i].textContent.includes("Wetter:")) {
            var col = getTableElement(tables[i], 4, 1);
            var heat = col.textContent.replace(/[A-Za-z$%]/g, "");
            return heat;
        }
    }
}

function removeElementById(id) {
    var toRemove = document.getElementById(id);
    toRemove.parentNode.removeChild(toRemove);
    return toRemove;
}

function getContent() {
    return document.getElementById('content');
}

// create a new element and set an attribute and text ..
function createElementAT(newElement, attribute, attributeValue, innerText) {
    var newElem = document.createElement(newElement);
    newElem.setAttribute(attribute, attributeValue);
    newElem.innerHTML = innerText;
    return newElem;
}

// create a new element and set an attribute ..
function createElementA(newElement, attribute, attributeValue) {
    var newElem = document.createElement(newElement);
    newElem.setAttribute(attribute, attributeValue);
    return newElem;
}

// create a new element and set text ..
function createElementT(newElement, innerText) {
    var newElem = document.createElement(newElement);
    newElem.innerHTML = innerText;
    return newElem;
}

// create a input from type number with the given attributes
function createInputNumber(id, min, max, step, width, value) {
    var input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('id', id);
    input.setAttribute('name', 'quantity');
    input.setAttribute('min', min);
    input.setAttribute('max', max);
    input.setAttribute('step', step);
    input.setAttribute('style', ('width: ' + width +'px'));
    input.setAttribute('value', value);
    input.style.textAlign = 'right';
    input.addEventListener('change', updateConfig, false);

    return input;
}

// create a input from type text with the given attributes
function createInputText(id, width, value) {
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', id);
    input.setAttribute('style', ('width: ' + width +'px'));
    input.setAttribute('value', value );
    input.addEventListener('change', updateConfig, false);

    return input;
}

// create a new link entry ..
function createLinkEntry(parent, linkValue, LinkText)
{
    var textLi = document.createElement('li');
    parent.appendChild(textLi);
    var link = document.createElement('a');
    link.setAttribute('href', linkValue);
    link.textContent = LinkText;
    textLi.appendChild(link);
    return link.clientHeight;
}

// returns true if value is found in array, otherwise false ..
function isValueInArray(array, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i] == value) {
            return true;
        }
    }
    return false;
}

function getObjectFromCityStorageArray(array, key) {
    for(var x in array) {
        if(array[x].res == key) {
            return array[x];
        }
    }
}

function getIndexFromCityStorageArray(array, key) {
    for(var x in array) {
        if(array[x].res == key) {
            return x;
        }
    }
}

// returns true if value is found in object list, otherwise false ..
function isValueInObjectList(list, keyToFind) {
    for(var key in list) {
        if(key == keyToFind) {
            return true;
        }
    }
    return false;
}

// create a configuration checkbox ..
function createSwitch(id, checked) {
    var switchElem = createElementA('input', 'id', id);
    switchElem.setAttribute('type', 'checkbox');
    switchElem.checked = checked;
    switchElem.addEventListener('change', updateConfig, false);
    return switchElem;
}

// create a combo box with the given options ..
function createSelection(id, options, selection, eventFunc) {
    var combo = createElementA('select', 'id', id);
    var keys = Object.keys(options);
    keys.sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
    for(var i = 0; i < keys.length; i++) { // add entries ..
        var res = keys[i];
        combo.appendChild(createElementAT('option', 'value', res, res));
    }
    combo.value = selection;
    combo.addEventListener('change', eventFunc, false);
    return combo;
}

function createSelectionCityStorage(id, options, selection, eventFunc) {
    var combo = createElementA('select', 'id', id);
    var keys = Object.keys(options);
    keys.sort(function (a, b) { return options[a].res.toLowerCase().localeCompare(options[b].res.toLowerCase()); });
    for(var i = 0; i < keys.length; i++) { // add entries ..
        var res = keys[i];
        combo.appendChild(createElementAT('option', 'value', options[res].res, options[res].res));
    }
    combo.value = selection;
    combo.addEventListener('change', eventFunc, false);
    return combo;
}


function createButton(id, text, fontSize, height, marginLeft, eventFunc) { // create a button ..
    var btn = createElementA('input', 'id', id);
    btn.setAttribute('type', 'button');
    btn.setAttribute('value', text);
    btn.setAttribute('style', 'background-color: #FFFFFF;font: normal ' + fontSize + 'px verdana, sans-serif;height: ' + height + 'px;margin-left: ' + marginLeft + 'px;border-width: 1px;border-style: solid;border-color: #888888');
    btn.setAttribute('onclick', eventFunc);
    btn.onclick = eventFunc;
    return btn;
}

function createSlider(id, min, max, step, width, value, eventFunc) { // create a slider ..
    var slider = createElementA('input', 'id', id);
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', min);
    slider.setAttribute('max', max);
    slider.setAttribute('step', step);
    slider.style.width = width + 'px';
    slider.value = value;
    slider.addEventListener('change', eventFunc);
    return slider;
}

function getURLParameter(name) { // get an URL-Parameter by name
	if(location.search) {
		var params = location.search.substring(1).split('&');
		for(var i = 0; i < params.length; i++) {
			var param = params[i].split('=');
			if(param[0] == name) {
				return param[1];
			}
		}
    }
	return null;
}

function format2(n) { // add leading zeros
    if(n < 10) {
        n = '0' + n;
    }
    return n.toString();
}

function hasAnimal() { // has animal ..
    return (document.getElementById( 'right' ).innerHTML.includes( 'Tier</td>' ));
}

function whichAnimal() { // which animal
    var animal = "";
    if(hasAnimal()) {
        var animalTable = document.getElementById('right').childNodes[12].firstChild;
        return getTableElement(animalTable, 0, 1).textContent;
    }
    return animal;
}
