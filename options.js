const sites = ['buttonA-siteselect', 'buttonB-settings', 'buttonC-custom', 'sbutton1-gclassroom', 'sbutton2-gdocs', 'sbutton3-gslides', 'sbutton4-gsheets', 'sbutton5-sapphire']
let saveChangesPrompt = false
window.onbeforeunload = function() {
	if (saveChangesPrompt == true) {
   		return "Changes not saved.";
	} else {
  		return;
	}
};

//This script is run on the options page and the docs/slides pages, so we add a unique identifier to the options.html page to ensure that the following script isn't executed on the google drive pages
if (document.getElementById("unqiueidentify9823r") !== null) {
	setTimeout(function() {
		$("#unqiueidentify9823r").fadeIn();
	}, 200);
	$('#imgurl').on('paste', function() {
		processImage(this);
	});
	$('#imgurl').on('keyup', function() {
		processImage(this);
	});

	$('#test3').on('click', function() {
		if (saveChangesPrompt == false) {
			saveChangesPrompt = true
		} else if (saveChangesPrompt == true) {
			saveChangesPrompt = false
		}
	});
	const titems = document.getElementsByClassName('saveprompt')

	function showsaveprompt() {
		saveChangesPrompt = true
		chrome.storage.sync.set({
			test: 'test2'
		})
		let classes = $('.saveprompt.main').attr('class')
		if (classes.includes('hidesaveprompt')) {
			$('.saveprompt.main').removeClass('hidesaveprompt')
		}
	}

	function hidesaveprompt() {
		saveChangesPrompt = false
		let classes = $('.saveprompt.main').attr('class')
		if (!classes.includes('hidesaveprompt')) {
			$('.saveprompt.main').addClass('hidesaveprompt')
		}
	}

	/*function checkChanged() {
		if 
	}*/

	document.getElementById('test1').addEventListener('click', hidesaveprompt);

	document.getElementById('test2').addEventListener('click', showsaveprompt);

	//$('.option').on('click', checkChanged)
	
	$('button').on('click', function() {
		let tid = this.id
		if (tid.startsWith('sbutton')) {
			for (let i = 0; i < sites.length; i++) {
				let split = sites[i].split('-')
				if (tid == split[0]) {
					openC('buttonA', split[1])
				}
			}
		} else {
			for (let i = 0; i < sites.length; i++) {
			let split = sites[i].split('-')
			if (tid == split[0]) {
				openC(tid, split[1])
			}
		}	
		}
	});

	fetch('https://pastebin.com/raw/u5r4KtNG').then(r => r.text()).then(result => {
		console.log(result)
	});

	chrome.identity.getProfileUserInfo(function(userInfo) {
		console.log(userInfo.email)
	});
	// Saves options to chrome.storage
	function save_options() {
		var topics = document.getElementById('topics').value;
		var ultraHD = document.getElementById('uhd').checked;
		var feat = document.getElementById('feat').checked;
		var slidesEnab = document.getElementById('slides-enabled').checked;
		var docsEnab = document.getElementById('docs-enabled').checked;
		var url = document.getElementById('imgurl').value;
		if (getActiveTabType() == "curated") {
			chrome.storage.sync.set({
				photoTopics: topics,
				definition: ultraHD,
				featured: feat,
				photoURL: url,
				slidesEnabled: slidesEnab,
				docsEnabled: docsEnab,
				photoURL: url,
				type: 'curated'
			}, function() {
				updateStatus();
			});
		} else {
			chrome.storage.sync.set({
				photoTopics: topics,
				definition: ultraHD,
				featured: feat,
				photoURL: url,
				slidesEnabled: slidesEnab,
				docsEnabled: docsEnab,
				type: 'custom'
			}, function() {
				updateStatus();
			});
		}
	}

	// Update status to let user know options were saved.
	function updateStatus() {
		var status = document.getElementById('status');
		status.innerHTML = 'Options saved.';
		setTimeout(function() {
			status.innerHTML = '&nbsp;';
		}, 750);
	}

	// Restores select box and checkbox state using the preferences
	// stored in chrome.storage.
	function restore_options() {
		// Use default value color = 'red' and likesColor = true.
		chrome.storage.sync.get({
			photoTopics: 'nature,ocean,scenic,paradise,tropics,sky',
			definition: false,
			featured: true,
			photoURL: '',
			slidesEnabled: true,
			docsEnabled: true,
			type: 'curated'
		}, function(items) {
			if (items.photoURL != '') {
				processImage($('#imgurl'));
			}
			document.getElementById('topics').value = items.photoTopics;
			document.getElementById('uhd').checked = items.definition;
			document.getElementById('feat').checked = items.featured;
			document.getElementById('imgurl').value = items.photoURL;
			document.getElementById('slides-enabled').checked = items.slidesEnabled;
			document.getElementById('docs-enabled').checked = items.docsEnabled;
			if (items.type == "curated") {
				$("#buttonA").click();
			} else {
				$("#buttonB").click();
			}
		});
	}

	//Change the current tab
	function openC(id, cityName) {
		var i, tabcontent, tablinks;
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
		document.getElementById(cityName).style.display = "block";
		$("#" + id).addClass("active");
		updateSaveButtonEnabledStatus();
	}

	//Return the current tab type
	function getActiveTabType() {
		var tablinks = document.getElementsByClassName("tablinks");
		for (var i = 0; i < tablinks.length; i++) {
			if (hasClass(tablinks[i], "active") && hasClass(tablinks[i], "curated")) {
				return "curated";
			}
			return "custom";
		}
	}

	//Used before I decided to import jQuery, will remove later
	function hasClass(target, className) {
		return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
	}

	//Test to see if an image url is valid
	function testImage(url, timeoutT) {
		return new Promise(function(resolve, reject) {
			var timeout = timeoutT || 4000;
			var timer, img = new Image();
			img.onerror = img.onabort = function() {
				clearTimeout(timer);
				reject("error");
			};
			img.onload = function() {
				clearTimeout(timer);
				resolve("success");
			};
			timer = setTimeout(function() {
				// reset .src to invalid URL so it stops previous
				// loading, but doens't trigger new load
				img.src = "//!!!!/noexist.jpg";
				reject("timeout");
			}, timeout);
			img.src = url;
		});
	}

	//boolean to store whether or not the user has entered a valid url for custom image
	var imageAcceptedStatus = false;

	//Update the user about the status of the url they have entered
	function record(url, result) {
		if (result == "error") {
			document.getElementById('image-result').innerHTML = "<span class='" + result + "'><b>That url isn't registering as an image that can be used.</b><br></span>";
		}
		if (result == "timeout") {
			document.getElementById('image-result').innerHTML = "<span class='" + result + "'><b>The server hosting that image is taking too long to respond.</b><br></span>";
		}
		if (url.trim() == "") {
			document.getElementById('image-result').innerHTML = "<p></p>";
		}
		if (result == "success") {
			$('#image-result').hide();
			document.getElementById('image-result').innerHTML = "<img id='previewwindow' class='imgpreview' src='" + url + "'>";
			var img = document.getElementById('previewwindow');
			var dimensionString = "<span class='dimension'>" + img.naturalWidth + "x" + img.naturalHeight + "</span><br>";
			document.getElementById('image-result').innerHTML = "<span class='" + result + "'><b>Image loaded successfully.</b><br><img id='previewwindow' class='imgpreview' src='" + url + "'><br>" + dimensionString;
			$('#image-result').show();
			imageAcceptedStatus = true;
		}
		updateSaveButtonEnabledStatus();
	}

	//helper method for processing image
	function runImage(url) {
		testImage(url).then(record.bind(null, url), record.bind(null, url));
	}

	//Wrapper to be called
	function processImage(element) {
		imageAcceptedStatus = false;
		updateSaveButtonEnabledStatus();
		setTimeout(function() {
			var text = $(element).val();
			runImage(text);
		}, 50);
	}

	//disable the save button until the image url is valid or they select curated
	function updateSaveButtonEnabledStatus() {
		if (getActiveTabType() == "curated" || (getActiveTabType() == "custom" && imageAcceptedStatus)) {
			$("#save").prop("disabled", false);
		} else {
			$("#save").prop("disabled", true);
		}
	}

	//restore options on page startup
	document.addEventListener('DOMContentLoaded', restore_options);

	//have options updated when save is clicked
	document.getElementById('save').addEventListener('click', save_options);
}