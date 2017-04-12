// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Send Text to HungryPanda";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],"id": "context" + context}); 
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);



// The onClicked callback function.
function onClickHandler() {
  chrome.tabs.executeScript( {
  code: "window.getSelection().toString();"
}, function(selection) {
	if (localStorage.getItem("savedtext") != null || localStorage.getItem("saveandload") == 3) {
		var loadMeOld = localStorage.getItem("savedtext");
		var loadMeNew = selection[0];
		var loadMeNow = loadMeOld + "\n" + "\n" + loadMeNew;
		localStorage.setItem("savedtext", loadMeNow);
		localStorage.setItem("textstatus", 2);
		var savedAt2 = new Date();
		var currentTime2 = savedAt2.toLocaleTimeString();
		localStorage.setItem("showmytime", currentTime2);
		chrome.tabs.executeScript( {
			code: "window.getSelection().empty();"
		}, function(selection) {
			
		});
	} else {
		var singleLoad = selection[0];
		localStorage.setItem("savedtext", singleLoad);
		localStorage.setItem("textstatus", 2);
		var savedAt1 = new Date();
		var currentTime1 = savedAt1.toLocaleTimeString();
		localStorage.setItem("showmytime", currentTime1);
		chrome.tabs.executeScript( {
			code: "window.getSelection().empty();"
		}, function(selection) {
			
		});
	}
});
};

