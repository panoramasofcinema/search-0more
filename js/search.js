// API QUERY
const urlParams = new URLSearchParams(window.location.search);
const queryValue = urlParams.get('q');

if (queryValue.includes(',')) {
    let url = "https://query.0more.net/rec?q="+queryValue;
    fetch(url)
	.then(function (response) {
		return response.json();
	})
	.then(function(data) {
		if ( data.response.length == 0 ) {
			window.alert("Nothing here.( Try another query.");
			//window.location = 'index.html';   
		} else {
			appendData(data.response);
		}
	})
	.catch(function(err) {
		console.log(err);
		window.alert('something went wrong...');
	});

} else if (queryValue.includes('.')) {
    let url = "https://query.0more.net/img?q="+queryValue;
	fetch(url)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		if ( data.response.length == 0 ) {
			window.alert("Nothing here.( Try another query.");
			//window.location = 'index.html';   
		} else {
			writeQuery();
			appendData(data.response);
		}
	})
	.catch(function(err) {
		console.log(err);
		window.alert('something went wrong...');
	});

} else {
	let url = "https://query.0more.net/txt?q="+queryValue;
	fetch(url)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		if ( data.response.length == 0 ) {
			window.alert("Nothing here.( Try another query.");
			//window.location = 'index.html';   
		} else {
			writeQuery();
			appendData(data.response);
		}
	})
	.catch(function(err) {
		console.log(err);
		window.alert('something went wrong...');
	});
}

//
function appendData(data) {
	var mainContainer = document.getElementsByClassName("results_grid")[0];
	for (var i = 0; i < data.length; i++) {
        // result container
		var resultCont = document.createElement("div");
		resultCont.className = "container";
		resultCont.setAttribute("id", "r"+i);
		resultCont.setAttribute('data-source', data[i].dataset_source);
		mainContainer.appendChild(resultCont);

		// image result
		var imgResult = document.createElement('img');
        imgResult.className = "img_response";
        imgResult.setAttribute('src', data[i].image);
		imgResult.setAttribute('onclick', "openModal(this)");
		imgResult.setAttribute('data-path_asset', data[i]['path_asset']);
		imgResult.setAttribute('data-name', data[i]['name']);
		imgResult.setAttribute('data-description', data[i]['description']);
		imgResult.setAttribute('data-link_source', data[i]['link_source']);
		imgResult.setAttribute('data-dataset_source', data[i]['dataset_source']);
		resultCont.appendChild(imgResult);

		// image recommend
		var imgRec = document.createElement("span");
		imgRec.className = "info";
		imgRec.innerText = "+";
        imgRec.setAttribute('data-image', data[i].image.slice(44,));
		imgRec.setAttribute('onclick', "recommend(this)");
		resultCont.appendChild(imgRec);
	}
	createModal()
}

// OPEN MODAL
function openModal(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("info01").innerHTML =
	element.dataset.name.toUpperCase()+
	"<br>"+element.dataset.description+
	"<br>- "+element.dataset.dataset_source.split('_').slice(1,)+" "+
	"<p><a href="+element.dataset.path_asset+">download &nbsp;&nbsp;&nbsp;</a>"+
	"<a href="+element.dataset.link_source+" target='_blank'>source</a></p>";
    document.getElementById("modal01").style.display = "block";
}

// CREATE MODAL
function createModal(){
	// modal container
    var secondContainer = document.getElementById("myModal");

	// modal content
	var modalContent = document.createElement("div");
	modalContent.className = "modal";
	modalContent.setAttribute("id", "modal01");

	// close modal
	var closeBtn = document.createElement("span");
	closeBtn.className = "closeBtn";
	closeBtn.innerHTML = '<strong>X</strong>';
	closeBtn.onclick = function() {
		modalContent.style.display = "none";
	}
	modalContent.appendChild(closeBtn);

	// image
	var imgBig = document.createElement("img");
	imgBig.className = "modal-img";
	imgBig.setAttribute("id", "img01");
	modalContent.appendChild(imgBig);

	// image info
	var imgInfo = document.createElement("div");
	imgInfo.className = "info";
	imgInfo.setAttribute("id", "info01");
	modalContent.appendChild(imgInfo);

	// append last
	secondContainer.appendChild(modalContent);
}

function writeQuery() {
	var this_q = document.getElementById('query_img');
	this_q.setAttribute('value', queryValue);
}

// FILTERS
function filterAll(){
	var valAllResults = document.getElementsByClassName("container");
	for (var i = 0; i < valAllResults.length; i++) {
		this_r = document.getElementById(valAllResults[i].id);
		this_r.style.display = "block";
	}
}
function filterModels(){
	var valAllResults = document.getElementsByClassName("container");
	for (var i = 0; i < valAllResults.length; i++) {
		this_r = document.getElementById(valAllResults[i].id);
		this_source = this_r.dataset.source;
		if (this_source == 'blenderkit_model'){
			this_r.style.display = "block";
		} else {
			this_r.style.display = "none";
		}
	}
}
function filterTextures(){
	var valAllResults = document.getElementsByClassName("container");
	for (var i = 0; i < valAllResults.length; i++) {
		this_r = document.getElementById(valAllResults[i].id);
		this_source = this_r.dataset.source;
		if (this_source == 'blenderkit_material'){
			this_r.style.display = "block";
		} else {
			this_r.style.display = "none";
		}
	}
}
function filterPngs(){
	var valAllResults = document.getElementsByClassName("container");
	for (var i = 0; i < valAllResults.length; i++) {
		this_r = document.getElementById(valAllResults[i].id);
		this_source = this_r.dataset.source;
		if (this_source == 'png_image'){
			this_r.style.display = "block";
		} else {
			this_r.style.display = "none";
		}
	}
}

// RECOMMEND
function recommend(element) {
	// construct the query
	if (element.dataset.image.includes('blenderkit')){
		let this_i = element.dataset.image.indexOf("/", 11);
		var this_source = element.dataset.image.slice(0,this_i).split('/').join('+');
		var this_img = element.dataset.image.slice(this_i+1).split('/').join('+');
	} else {
		var this_source = 'png_dataset+premium_collection';
		let this_i = element.dataset.image.indexOf("/",12);
		var this_img = element.dataset.image.slice(this_i+1).split('/').join('+');
	}
	let url = "search.html?q="+this_source+','+this_img;
	window.open(url, '_self')
	//window.open(url)
}