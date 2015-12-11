var letters = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
var numbers = new Array("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14");
var lettersAndNumbers = new Array();
var removedLettersAndNumbers = new Array();
var started = false;
var stopTimer = false;
var questionIndex = 0;
var questionValue;
var points = 0;

function loadTable() {
	lettersAndNumbers = letters.concat(numbers);
	shuffle(lettersAndNumbers);
	var tbl = "";
	var cntr = 0;
	var idCntr = 0;
	for (var i = 0; i < lettersAndNumbers.length; i++) {
		cntr++;
		idCntr++;
		var borderColor = "black";

		switch (cntr) {
		case 1:
			borderColor = "blue";
			break;
		case 2:
			borderColor = "red";
			break;
		case 3:
			borderColor = "green";
			break;
		case 4:
			borderColor = "purple";
			break;
		case 5:
			borderColor = "teal";
			break;
		}
		if (cntr > 5) {
			cntr = 0;
		}
		var style = "border:.03em solid " + borderColor;
		var btnHtml = "<input type=\"button\" class=\"gameButton\" onclick='boxClicked(" + i + ",this.id);' value=\"" + lettersAndNumbers[i] + "\" style=\"" + style + "\" id=\"" + idCntr + "\">";

		tbl = tbl + btnHtml
	}
	document.getElementById("tabledata").innerHTML = tbl;
	showScores();
}

function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function getScores() {
	var scores = localStorage.getItem("scores");
	return scores;
}

function showScores() {
	if (!supports_html5_storage) {
		console.log("HTML5 Storage Not Enabled");
		return;
	}
	var scores = getScores();
	if (scores != null) {
		var html = "<table>";
		html = html + "<tr><th>Initial</th><th>Score</th></tr>";
		var scoreArray = scores.split("|");
		for (var i = 0; i < scoreArray.length; i++) {
			var itm = scoreArray[i];
			var itmArray = itm.split(":");
			html = html + "<tr><td>" + itmArray[0] + "</td><td>" + itmArray[1] + "</td></tr>";
		}
		document.getElementById("scores").innerHTML = html;
	}
}

function determineLetterOrNumber(itm) {
	var typeOfItm = "Unknown";
	if (nbrIsInArray(itm, letters)) {
		typeOfItm = 'Letter';
	}
	if (nbrIsInArray(itm, numbers)) {
		typeOfItm = 'Number';
	}
	return typeOfItm;
}

function shuffle() {
	var currentIndex = lettersAndNumbers.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = lettersAndNumbers[currentIndex];
		lettersAndNumbers[currentIndex] = lettersAndNumbers[randomIndex];
		lettersAndNumbers[randomIndex] = temporaryValue;
	}
}

function nbrIsInArray(nbr, array) {
	var found = false;
	for (var i = 0; i < array.length; i++) {
		var arrayNbr = array[i];
		if (nbr === arrayNbr) {
			found = true;
			break;
		}
	}
	return found;
}

function startStop() {
	if (started) {
		stopGame();
	} else {
		startGame();
	}
}

function startGame() {
	points = 0;
	updatePointsView();
	removedLettersAndNumbers.length = 0; // Clear the items clicked on
	loadTable();
	startTimer();
	started = true;
	initialsBox("hide");
	updateStartButton("Stop this game");
	askQuestion();
	startMusic();
}

function stopGame() {
	stopMusic();
	stopTimer = true;
	started = false;
	updateStartButton("Start a new game");
	document.getElementById("questionLabelId").innerHTML = "";
	initialsBox("show");
}

function startMusic() {
	var music = document.getElementById("music");
	music.play();
}

function stopMusic() {
	var music = document.getElementById("music");
	music.pause();
	music.currentTime = 0;
}

function updateStartButton(msg) {
	var bgColor = "green";
	if (started) {
		bgColor = "red";
	}
	document.getElementById("startButton").value = msg;
	document.getElementById("startButton").style.backgroundColor = bgColor;
}

function startTimer() {
	stopTimer = false;
	var i = 60;
	function onTimer() {
		document.getElementById("mycounter").innerHTML = "Time: <b>" + i + "</b>";
		i--;
		if (i < 0 || stopTimer) {
			stopGame();
			clearInterval(id);
		}
	}
	var id = setInterval(onTimer, 1000);
}

function askQuestion() {
	var badQuestion = true;
	while (badQuestion) {
		questionIndex = getRandomQuestionIndex();
		questionValue = lettersAndNumbers[questionIndex];
		if (!removedContainsItem(questionValue)) {
			console.log("Value " + questionValue + " not found, adding to remove list");
			badQuestion = false;
		}
	}
	var itmType = determineLetterOrNumber(questionValue);
	var question = "Find The " + itmType + " <b>" + questionValue + "</b>";
	document.getElementById("questionLabelId").innerHTML = question;
}

function removedContainsItem(val) {
	var removedContainsItem = false;
	var sizeOfRemovedItems = removedLettersAndNumbers.length;
	for (var i = 0; i < sizeOfRemovedItems; i++) {
		var itm = removedLettersAndNumbers[i];
		console.log("itm=" + itm + " val=" + val);
		if (itm == val) {
			removedContainsItem = true;
			break;
		}
	}
	return removedContainsItem;
}

function getRandomQuestionIndex() {
	var min = 0;
	var max = lettersAndNumbers.length - 1;
	var n = Math.floor(Math.random() * (max - min + 1)) + min;
	return n;
}

function boxClicked(nbr, btnId) {
	if (!started) {
		return;
	}
	var itm = lettersAndNumbers[nbr];
	if (itm === questionValue) {
		points++;
		document.getElementById(btnId).style.color = "white";
		updateRemoved(itm);
	} else {
		points--;
	}
	console.log("here1");
	updatePointsView();
	console.log("here2");
	var finished = testForFinishGame();
	if (!finished) {
		console.log("here3");
		askQuestion();
	}
}

function testForFinishGame() {
	var finished = false;
	console.log("Removed Total: " + removedLettersAndNumbers.length + " Total: " + lettersAndNumbers.length);
	if (removedLettersAndNumbers.length == lettersAndNumbers.length) {
		alert("Congratulations you have gotten all the letters and numbers!!");
		finished = true;
		stopGame();
	}
	return finished;
}

function updatePointsView() {
	var pointsMessage = "Points: <b>" + points + "</b>";
	document.getElementById("pointsLabelId").innerHTML = pointsMessage;
}

function updateRemoved(letterOrNumber) {
	console.log("Update Removed Array With: " + letterOrNumber);
	var itmFound = false;
	for (var i = 0; i < removedLettersAndNumbers.length; i++) {
		if (removedLettersAndNumbers[i] == letterOrNumber) {
			itmFound = true;
			break;
		}
	}
	if (!itmFound) {
		removedLettersAndNumbers.push(letterOrNumber);
		console.log(removedLettersAndNumbers);
	}
}

function initialsBox(showHide) {
	if (showHide == 'show') {
		if (!supports_html5_storage) {
			return;
		}
		document.getElementById("saveBox").style.display = "";
	}
	if (showHide == 'hide') {
		document.getElementById("saveBox").style.display = "none";
	}
}

function saveGame() {
	var scores = getScores();
	if (scores !== null && scores.length > 0) {
		scores = scores + "|";
	} else {
		scores = "";
	}
	scores = scores + document.getElementById("initialsId").value + ":" + points;
	saveScores(scores);
	document.getElementById("saveBox").style.display = "none";
	showScores();
}

function saveScores(scores) {
	console.log('saving scores: ' + scores);
	localStorage.setItem("scores", scores);
}
