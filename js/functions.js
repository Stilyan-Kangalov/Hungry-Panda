function saveTextAsFile()
{
    var textToSave = document.getElementById("inputTextToSave").value;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}

function showError(message) {
	document.getElementById("copy").classList.add('bg-copy');
	document.getElementById("copy").innerHTML = message;
    setTimeout(function(){ 
	document.getElementById("copy").classList.remove('bg-copy');
	document.getElementById("copy").innerHTML = "" }, 3000);
}

function getTheTime()
{
	var savedAt = new Date();
	var currentTime = savedAt.toLocaleTimeString();
	localStorage.setItem("showmytime", currentTime);
}

function changeTime()
{
	var newTimeStamp = localStorage.getItem("showmytime");
	document.getElementById("showStatus").innerHTML = "Saved Draft at " +  newTimeStamp;
}

function isNoteSaved()
{
	if (!localStorage.getItem("showmytime")) {
		document.getElementById("showStatus").innerHTML = "Status: Idle";
	} else {
		document.getElementById("showStatus").innerHTML = "Saved Draft at " + localStorage.getItem("showmytime");
	}
}

function isFileLoadedNow() {
	var state = localStorage.getItem("saveandload");
	if (state == 3) {
		var getTheName = localStorage.getItem("saveloadedfile");
		document.getElementById("inputFileNameToSaveAs").value =  getTheName;
		document.getElementById("showStatus").innerHTML = "Loaded text from: " + getTheName;
	}
}
 
function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

function mainFunc() {
    chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
	if (selection[0] != "" && !localStorage.getItem("textstatus")) {
    document.getElementById("inputTextToSave").innerHTML = selection[0];
	var savedText10 = selection[0];
	localStorage.setItem("savedtext", savedText10);
	saveTextNow();
} else if (selection[0] != "" && localStorage.getItem("textstatus") == 2) { 
    var loadMeOld = localStorage.getItem("savedtext");
	var loadMeNew = selection[0];
	var loadMeNow = loadMeOld + "\n" + "\n" + loadMeNew;
	document.getElementById("inputTextToSave").value = loadMeNow;
	localStorage.setItem("savedtext", loadMeNow);
	getTheTime();
	changeTime();
} else {
	var loadMe = localStorage.getItem("savedtext");
	document.getElementById("inputTextToSave").value = loadMe;
}
});

}

function loadText() 
{
	if (!localStorage.getItem("savedtextbefore")) {
		showError("Nothing to Reload!")
	} else {
		var loadMeBefore = localStorage.getItem("savedtextbefore");
		document.querySelector('#inputTextToSave').value = loadMeBefore;
	}
	
}

function clearText() 
{
	if (!localStorage.getItem("savedtext") && localStorage.getItem("alreadycleared") == 5) {
		showError("Nothing to Clear!");
	} else {
		var clearMe = "";
		localStorage.clear();
		document.getElementById("inputTextToSave").value = clearMe;
		document.getElementById("inputFileNameToSaveAs").value =  "";
		document.getElementById("fileToLoad").value = "";
		document.getElementById("showStatus").innerHTML = "Status: Idle";
		localStorage.setItem("alreadycleared", 5);
	}
}

function saveLoadedFile()
{
	var loadedNow = document.getElementById("inputTextToSave").value;
	localStorage.setItem("saveloadedtext", loadedNow);
	localStorage.setItem("savedtext", loadedNow);
	localStorage.setItem("saveandload", 3);
}

 
function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];
	if(!fileToLoad) {
		showError("Nothing to Load!");
	} else {
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) {
			var textFromFileLoaded = fileLoadedEvent.target.result;
			document.getElementById("inputTextToSave").value = textFromFileLoaded;
			saveLoadedFile();
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
		var currentName = fileToLoad.name;
		document.getElementById("inputFileNameToSaveAs").value = currentName;
		localStorage.setItem("saveloadedfile", currentName);
		document.getElementById("showStatus").innerHTML = "Status: File Loaded as Draft";
	}
}

function saveTextNow() {
	var saveMe = document.getElementById("inputTextToSave").value;
	if (saveMe.length != null && saveMe.length != "" ) {
		localStorage.setItem("savedtext", saveMe);
		localStorage.setItem("textstatus", 2);
		getTheTime();
		changeTime();
	} else {
		showError("Nothing to Save!");
	}
}


function saveChanges() {
    var saveMe = document.getElementById("inputTextToSave").value;
	if (saveMe.length != null && saveMe.length != "" ) {
		localStorage.setItem("savedtext", saveMe);
		getTheTime();
		changeTime();
	}
}

function saveChangesBeforeEdit() {
    var saveMe = document.getElementById("inputTextToSave").value;
	if (saveMe.length != null && saveMe.length != "" ) {
		localStorage.setItem("savedtextbefore", saveMe);
		getTheTime();
		document.getElementById("showStatus").innerHTML = "Cached at " + localStorage.getItem("showmytime") + " You can reload the text!";
	}
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#saveButton').addEventListener('click', saveTextAsFile);
  document.querySelector('#loadButton').addEventListener('click', loadFileAsText);
  document.querySelector('#loadButtonLocal').addEventListener('click', loadText);
  document.querySelector('#clearButtonLocal').addEventListener('click', clearText);
  document.querySelector('#tempSave').addEventListener('click', saveTextNow);
  document.querySelector('#inputTextToSave').addEventListener('focus', saveChangesBeforeEdit);
  document.querySelector('#inputTextToSave').addEventListener('blur', saveChanges);
  mainFunc();
  isNoteSaved();
  isFileLoadedNow();
});