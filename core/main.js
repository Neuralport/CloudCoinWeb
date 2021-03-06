
function loadScreen()
{
	document.getElementsByClassName("off-canvas-wrapper")[0].style.opacity = 0.5;
    document.getElementById("loading").innerHTML="<p style='font-size:72px;'>LOADING</p><p>This could take a while if you have a lot of coins.</p>";
}
function loadEnd()
{
	document.getElementsByClassName("off-canvas-wrapper")[0].style.opacity = 1.0;
    document.getElementById("loading").innerHTML="";
}

function populateRaidaStatus(rr, id)
{
    document.getElementById("r_" + id).innerHTML = rr.outcome;
    document.getElementById("p_" + id).innerHTML = rr.milliseconds;
	log.updateLog("echo to raida " + id + "came up " + rr.outcome +" at " +rr.milliseconds+"ms.");
}

function exportDialAdd(dem)
{
	let dial = document.getElementById("dial"+dem);
	let bottom = document.getElementById(dem+"bottom");
	let dialCount = dial.childElementCount - 3;
	let newOption = document.createElement("option");
	newOption.textContent = dialCount+1;
	dial.removeChild(bottom);
	dial.appendChild(newOption);
	dial.appendChild(bottom);
}

function exportDialMinus(dem)
{
	let dial = document.getElementById("dial"+dem);
	let bottom = document.getElementById(dem+"bottom");
	let dialCount = document.getElementById("dial"+dem).childElementCount - 3;
	dial.removeChild(bottom);
	dial.removeChild(dial.lastChild);
	dial.appendChild(bottom);
	document.getElementById("dial"+dem).scrollTop = 0;
}

function dialSet(dem)
{
	let box = document.getElementById("dial"+dem);
	let amount = box.options[box.selectedIndex].text;
	let checkboxes = document.getElementsByClassName("dem"+dem);
	for(let i =0; i< checkboxes.length; i++)
	{
		if(i < amount){
			checkboxes[i].checked = true;
		} else {
			checkboxes[i].checked = false;
		}
	}
	//console.log(amount);
}

function scrollSelect(dem)
{
	
	let box = document.getElementById("dial"+dem);
	posOffsetX = box.getBoundingClientRect().left + 20;
	posOffsetY = box.getBoundingClientRect().top + 45;
	
	
	//console.log(posOffsetX+","+posOffsetY);
	document.elementFromPoint(posOffsetX,posOffsetY).selected = true;
	dialSet(dem);
	//console.log(document.elementFromPoint(posOffsetX,posOffsetY));
	
}

function scanSwitchMessage()
{
	if(document.getElementById("scanSwitch").checked)
	{
		document.getElementById("scanSwitchMessage").innerHTML = "Take ownership of the coin(s), and place it in the safe.";
	}else{
		document.getElementById("scanSwitchMessage").innerHTML = "Just check if the coin(s) is real, don't place it in the safe.";
	}
}

function getDen(sn)
{
	let nom = 0;
        if ((sn < 1))
            {
                nom = 0;
            }
            else if ((sn < 2097153))
            {
                nom = 1;
            }
            else if ((sn < 4194305))
            {
                nom = 5;
            }
            else if ((sn < 6291457))
            {
                nom = 25;
            }
            else if ((sn < 14680065))
            {
                nom = 100;
            }
            else if ((sn < 16777217))
            {
                nom = 250;
            }
            else
            {
                nom = 0;
            }

            return nom;
}

function coinlist(id)
{
    let denom = getDen(id);
	
    if(document.getElementById(id) !== null){
        //document.getElementById(id).remove();
        return null;
	} else {
		
		exportDialAdd(denom);
	
    //let listname = document.getElementById("coinlist" + folder.toLowerCase());
	let row = document.createElement("tr");
	row.setAttribute("id", id);
	let td1 = document.createElement("td");
	let checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("id", "cb"+id);
	checkbox.setAttribute("class", "dem"+denom);
	let td2 = document.createElement("td");
	td2.textContent = denom;
	let td3 = document.createElement("td");
	td3.textContent = id;
	td1.appendChild(checkbox);
	
	row.appendChild(td1);
	row.appendChild(td2);
	row.appendChild(td3);
	//listname.appendChild(row);
	return row;
	}
	
    
}

function scoinlist(id)
{
    let denom = getDen(id);
    if(document.getElementById("s"+id) !== null){
        //document.getElementById("s"+id).remove();
        return null;
	}else{
		let row = document.createElement("tr");
	row.setAttribute("id", "s"+id);
	let td1 = document.createElement("td");
	let checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("id", "scb"+id);
	checkbox.setAttribute("value", id);
	checkbox.setAttribute("name", "sn[]");
	let td2 = document.createElement("td");
	td2.textContent = denom;
	let td3 = document.createElement("td");
	td3.textContent = id;
	td1.appendChild(checkbox);
	row.appendChild(td1);
	row.appendChild(td2);
	row.appendChild(td3);
	//listname.appendChild(row);
	return row;
	}
    
}

function mindlist()
{
	let id;
	let listitem;
	let listtext;
	let checkbox;
	let mlist = document.getElementById("coinlistmind");
	mlist.innerHTML = "";
	let fragment = document.createDocumentFragment();
		for(var j = 0; j< localStorage.length; j++){
            if(localStorage.getItem(localStorage.key(j)) == "mindstorage"){
				id = localStorage.key(j).substring(localStorage.key(j).indexOf('.')+1);
			//document.getElementById("coinlistmind").innerHTML +="<li id = 'm" + 
		//id + "'><input type='checkbox' id='mcb"+id+"'>" + id + "  "+getDen(id)+"CC</li>"
				listitem = document.createElement("li");
				listitem.setAttribute("id", "m"+id);
				checkbox = document.createElement("input");
				checkbox.setAttribute("type", "checkbox");
				checkbox.setAttribute("id", "mcb"+id);
				listitem.appendChild(checkbox);
				listtext =document.createTextNode( id + "  " + getDen(id)+"CC");
				listitem.appendChild(listtext);
				fragment.appendChild(listitem);
			};
        }
	mlist.appendChild(fragment);
	sortList();
}

function toMindMode()
{
	document.getElementById("toMindDetails").innerHTML = "";
	emptyprogress('toMindMessage');
	let before = (new Date()).getTime();
	let loadBank = importer.importAllFromFolder("bank");
    let loadFracked = importer.importAllFromFolder("fracked");
	let id;
	
	let fragmentBank = document.createDocumentFragment();
	let fragmentFracked = document.createDocumentFragment();
	let row;
	for(let j =0; j<loadBank.length; j++)
	{
		id = loadBank[j].substring(loadBank[j].indexOf('.')+1);
		row = scoinlist(id);
		if(row !== null)
		fragmentBank.appendChild(row);
	}
	for(let i=0;i<loadFracked.length;i++)
	{
		id = loadFracked[i].substring(loadFracked[i].indexOf('.')+1);
		row = scoinlist(id);
		if(row !== null)
		fragmentFracked.appendChild(row);
	}
	document.getElementById("mcoinlistbank").appendChild(fragmentBank);
	document.getElementById("mcoinlistfracked").appendChild(fragmentFracked);
	sortTable("mcoinlistbank");
	sortTable("mcoinlistfracked");
	let ts = (new Date()).getTime() - before;
	console.log(ts);



	
}

function fromMindMode()
{
	emptyprogress('mindProgress');
	document.getElementById('fromMindStatus').innerHTML='';
	mindlist();
}

function emailRecover()
{
	
	let sn = prompt("What is the serial number(s) of the coin you want to recover?\nIf you are inputing multiple numbers seperate them with a comma.");
	if(sn.includes(", "))
		sn = sn.split(", ");
	else if(sn.includes(","))
		sn = sn.split(",");
	else
		sn = [sn];

	if(sn[sn.length-1] == "")
		sn.pop();
	for(let i = 0; i < sn.length; i++){
	if(sn[i] !== "" && !isNaN(parseFloat(sn[i])) && isFinite(sn[i]) && sn[i] > 0 && sn[i] < 16777216)
	{
		if(!localStorage.getItem(files.findCoin(sn[i]))){
			localStorage.setItem("mind."+sn[i], "mindstorage");
		log.updateLog("Recovered sn:" +sn[i]+" from email.");
		//mindlist();
			
		}else{
			log.updateLog("Coin of SN:"+sn[i]+" is already in this app.");
			console.log("Coin of SN:"+sn[i]+" is already in this app.");
		}
	}else {
		alert("Please Enter a valid serial number");
	}
	}
	mindlist();
}

function restoreFailedDownload()
{
	log.updateLog("Restoring failed download of coins:");
	for(var j = 0; j< localStorage.length; j++){
		if(localStorage.key(j).includes("le"))
		{
			fname = localStorage.key(j).replace("le", "");
			if(!localStorage.getItem(fname)){
			localStorage.setItem(fname, localStorage.getItem("le"+fname));
			
			cc = files.loadOneCloudCoinFromJsonFile(fname);
			cc.reportDetectionResults();
			//updates(cc, files);
			log.updateLine(cc.sn+",");
			}
			localStorage.removeItem("le"+fname);
		}
	}
	document.getElementById("restoreDone").innerHTML = "Done";
}


function downloadImage(N=false)
{
    
    let lenames = [];
    let fnames = [];
	let toDl = [];
	for(var j = 0; j< localStorage.length; j++){
    if(localStorage.key(j).includes("le")){
		lenames.push(localStorage.key(j));
	}
	else if(localStorage.key(j).includes("bank") ||localStorage.key(j).includes("fracked")){     
	if(document.getElementById("cb" + localStorage.key(j).substring(localStorage.key(j).indexOf(".")+1)).checked)
 			fnames.push(localStorage.key(j));
	}
}

	if(fnames.length > 0){
	for(let k = 0; k< lenames.length; k++)
	{
		localStorage.removeItem(lenames[k]);
	}}
 

	
 
    for(let i =0 ; i<fnames.length; i++){
        
			toDl.push(files.loadOneCloudCoinFromJsonFile(fnames[i]));
			localStorage.setItem("le"+fnames[i], localStorage.getItem(fnames[i]));
			log.updateLog("Downloading jpeg with coin:" + fnames[i].substring(fnames[i].indexOf('.')+1));
			trash(fnames[i].substring(fnames[i].indexOf('.')+1));
		}
		
		if(document.getElementById("jpeg-in").files.length !== 0 && (document.getElementById("jpeg-in").value.slice(-4) == "jpeg" || document.getElementById("jpeg-in").value.slice(-4) == "jfif" || document.getElementById("jpeg-in").value.slice(-3) == "jpg"))
		    {embedCC(toDl, N);}
		else if(document.getElementById("jpeg-in").files.length === 0)
		    {embedTemplateCC(toDl, N, canvases);}
			else {
			alert("thats not a jpeg");}
	
	
    //e.stopPropogation();
}

function createCanvas()
{
	let c1 = document.createElement("canvas");
let c5 = document.createElement("canvas");
let c25 = document.createElement("canvas");
let c100 = document.createElement("canvas");
let c250 = document.createElement("canvas");
	let Img1 = new Image();
	let Img5 = new Image();
	let Img25 = new Image();
	let Img100 = new Image();
	let Img250 = new Image();
	let img1d;
	let img5d;
	let img25d;
	let img100d;
	let img250d;
	let ctx1 = c1.getContext("2d");
	let ctx5 = c5.getContext("2d");
	let ctx25 = c25.getContext("2d");
	let ctx100 = c100.getContext("2d");
	let ctx250 = c250.getContext("2d");

	Img1.onload = function(){
		c1.width = this.naturalWidth;     // update canvas size to match image
  c1.height = this.naturalHeight;
  ctx1.drawImage(this, 0, 0);
  ctx1.font = "20px Arial";
 
 //img1d = ctx1.getImageData(0,0,c1.width,c1.height);
};
	Img5.onload = function(){
		c5.width = this.naturalWidth;     // update canvas size to match image
  c5.height = this.naturalHeight;
  ctx5.drawImage(this, 0, 0);
  ctx5.font = "20px Arial";
 
 //img5d = ctx5.getImageData(0,0,c5.width,c5.height);
};
	Img25.onload = function(){
		c25.width = this.naturalWidth;     // update canvas size to match image
  c25.height = this.naturalHeight;
  ctx25.drawImage(this, 0, 0);
  ctx25.font = "20px Arial";
 
 //img25d = ctx25.getImageData(0,0,c25.width,c25.height);
};
	Img100.onload = function(){
		c100.width = this.naturalWidth;     // update canvas size to match image
  c100.height = this.naturalHeight;
  ctx100.drawImage(this, 0, 0);
  ctx100.font = "20px Arial";
 
 //img100d = ctx100.getImageData(0,0,c100.width,c100.height);
};
	Img250.onload = function(){
		c250.width = this.naturalWidth;     // update canvas size to match image
  c250.height = this.naturalHeight;
  ctx250.drawImage(this, 0, 0);
  ctx250.font = "20px Arial";
 
 //img250d = ctx250.getImageData(0,0,c250.width,c250.height);
};
 
	
	Img1.src = "core/jpeg1.jpg";
	
	
	Img5.src = "core/jpeg5.jpg";
	
	Img25.src = "core/jpeg25.jpg";
	
	Img100.src = "core/jpeg1002.jpg";
	
	Img250.src = "core/jpeg250.jpg";
	return [c1,ctx1,c5,ctx5,c25,ctx25,c100,ctx100,c250,ctx250/*,img1d,img5d,img25d,img100d,img250d*/];
}

function downloadAll(N=false)
{
    let fnames = [];
	let lenames = [];
	
	let tag;
	log.updateLog("Downloading to Stack coins:");
	for(var j = 0; j< localStorage.length; j++){
    if(localStorage.key(j).includes("le")){
		lenames.push(localStorage.key(j));
	}
	else if(localStorage.key(j).includes("bank") ||localStorage.key(j).includes("fracked")){ 
	if(document.getElementById("cb" + localStorage.key(j).substring(localStorage.key(j).indexOf('.')+1)).checked)
			 fnames.push(localStorage.key(j));
		}
	}
	
	if(fnames.length > 0){
	for(let k = 0; k< lenames.length; k++)
	{
		localStorage.removeItem(lenames[k]);
	}}
	if(N)
    {tag = document.getElementById("alltagN").value;}
	else
	{tag = document.getElementById("alltag").value;}
    files.downloadAllCloudCoinToJsonFile(fnames, tag);
    for(let i = 0; i < fnames.length; i++){
		localStorage.setItem("le"+fnames[i], localStorage.getItem(fnames[i]));
		log.updateLine(fnames[i].substring(fnames[i].indexOf('.')+1) + ",");
        trash(fnames[i].substring(fnames[i].indexOf('.')+1));
	}
	
}

function removeFile(name)
{
	let index;
	for(let i=0;i< files.fileArray.length; i++)
	{
		if(files.fileArray[i].name == name)
		index = i;
	}
	let remove = files.fileArray.splice(index, 1);
	let elem = document.getElementById(remove[0].name);
	document.getElementById("uploadList").removeChild(elem);
}


function makeBackup()
{
	let fnames = importer.importAllGood();
	let now = new Date();
	log.updateLog("Making backup " + now.toUTCString() +" total amount of items:" + fnames.length);
	let tag = "backup." + now.toISOString().substring(0,19);
	files.downloadAllCloudCoinToJsonFile(fnames, tag);
}

function checkAll(mind = 0)
{
	
    let id = 0;
    
	if(mind == 2){
		let mnames = importer.importAllFromFolder("mind");
		for(let i = 0; i < mnames.length; i++)
		{
			id = mnames[i].substring(mnames[i].indexOf('.')+1);
		if(document.getElementById("m2bcbAll").checked)
		document.getElementById("mcb" + id).checked = true;
		else
		document.getElementById("mcb" + id).checked = false;
		}
	}else if(mind == 1){
		let fnames = importer.importAllGood();
		for(let i = 0; i < fnames.length; i++)
		{
			id = fnames[i].substring(fnames[i].indexOf('.')+1);
		if(document.getElementById("b2mcbAll").checked)
		document.getElementById("scb" + id).checked = true;
		else
		document.getElementById("scb" + id).checked = false;
		}
	}else{
		let fnames = importer.importAllGood();
		for(let i = 0; i < fnames.length; i++)
		{
			id = fnames[i].substring(fnames[i].indexOf('.')+1);
			if(document.getElementById("cbAll").checked)
			document.getElementById("cb" + id).checked = true;
			else
			document.getElementById("cb" + id).checked = false;
		}
	}
}

function uncheckEvery()
{
	document.querySelectorAll("input[type=checkbox]").checked = false;
}

/*function showFolder(){
        alert("cf:" + files.counterfeitFolder);
        alert("b:" + files.bankFolder);
        alert("s:" + files.suspectFolder);
        alert("f:" + files.frackedFolder);
		alert("t:" + files.trashFolder);
    }*/

function importMode()
{
	document.getElementById("importHeadShown").innerHTML = document.getElementById("importHead").innerHTML;
	document.getElementById("upButtonShown").innerHTML = document.getElementById("upButton").innerHTML;
	document.getElementById("importStatus").innerHTML ="";
	document.getElementById("deleteMessage").innerHTML = "";
	document.getElementById("duplicateHolder").style.display = "none";
	document.getElementById("duplicateNumbers").innerHTML = "";
	document.getElementsByClassName("switch-paddle")[0].style.visibility = "initial";
	emptyprogress('uploadProgress');
}
	
function uploadButtonAppear(){
	let elFile = document.getElementById("myFile");
	let fragment = document.createDocumentFragment();
	let listitem;
	let close;
	let closefile;
	for(let i = 0; i < elFile.files.length; i++){
		files.fileArray.push(elFile.files[i]);
		listitem = document.createElement("span");
		listitem.setAttribute("id", files.fileArray[files.fileArray.length-1].name);
		close = document.createElement("span");
		closefile = "removeFile('"+(files.fileArray[files.fileArray.length-1].name)+"')";
		close.setAttribute("onclick", closefile);
		close.innerHTML = "&#x274C;";
		listitem.textContent = files.fileArray[files.fileArray.length-1].name +" ";
		listitem.appendChild(close);
		fragment.appendChild(listitem);
	}
    document.getElementById("uploadList").appendChild(fragment);
	elFile.value = null;
	document.getElementById("uploadProgress").style.width = "0%";
	document.getElementById("uploadProgress").innerHTML="";
}

function uploadFile(){
	if(files.fileArray.length > 0){
	document.getElementsByClassName("uphide")[0].style.visibility = "hidden";
	document.getElementsByClassName("uphide")[1].style.visibility = "hidden";
	document.getElementsByClassName("uphide")[2].style.visibility = "hidden";
	document.getElementsByClassName("switch-paddle")[0].style.visibility = "hidden";
	document.getElementById("uploadProgress").style.width = "2%";
	
	let totalSize = 0;
    for(let i = 0; i < files.fileArray.length; i++){
    let upJson = files.fileArray[i];
	totalSize += upJson.size;
    if(upJson.name.slice(-5) == "stack"){
	files.uploadCloudCoinFromJsonFile(upJson, files.saveCloudCoinToJsonFile);
	//document.getElementById("uploadProgress").style.width = "50%";
    } else if(upJson.name.slice(-4) == "jpeg" || upJson.name.slice(-4) == "jfif" || upJson.name.slice(-3) == "jpg"){
        files.uploadCloudCoinFromJpegFile(upJson, files.saveCloudCoinToJsonFile);
		//document.getElementById("uploadProgress").style.width = "50%";
    } else{alert("Valid File Type Please");}
}
if(document.getElementById("scanSwitch").checked){
	setTimeout(function(){
		//document.getElementById("uploadProgress").style.width = "75%";
		detect.detectAllSuspect(updates);
        
        //let importer = new Importer();
    //let coins = importer.importAll(fileUtil);
		//coins.forEach(coinlist);
		//updateTotal(fileUtil);
	}, 500 + (totalSize/80));
}else{
	setTimeout(function(){
		//document.getElementById("uploadProgress").style.width = "75%";
		detect.detectAllTemp(updatesTemp);
        
        //let importer = new Importer();
    //let coins = importer.importAll(fileUtil);
		//coins.forEach(coinlist);
		//updateTotal(fileUtil);
	}, 500 + (totalSize/80));
}
	}
}

function bankMode()
{
	document.getElementById("fixDone").innerHTML ="";
	document.getElementById('fixStatusContainer').style.display = 'none';
	updateTotal(files);
}

function updateTotal(fileUtil)
{
	let banker = new Banker();
    let total = banker.countCoins(fileUtil);
    document.getElementById("b_gs").innerHTML =total[0];
	document.getElementById("b_g1").innerHTML=total[1];
	document.getElementById("b_g5").innerHTML=total[2];
	document.getElementById("b_g25").innerHTML=total[3];
	document.getElementById("b_g100").innerHTML=total[4];
	document.getElementById("b_g250").innerHTML=total[5];
	let frackedTotal = banker.countFracked(fileUtil);
	document.getElementById("b_fs").innerHTML =frackedTotal[0];
	document.getElementById("b_f1").innerHTML=frackedTotal[1];
	document.getElementById("b_f5").innerHTML=frackedTotal[2];
	document.getElementById("b_f25").innerHTML=frackedTotal[3];
	document.getElementById("b_f100").innerHTML=frackedTotal[4];
	document.getElementById("b_f250").innerHTML=frackedTotal[5];

	document.getElementById("b_ts").innerHTML =total[0] + frackedTotal[0];
	document.getElementById("b_t1").innerHTML=total[1] + frackedTotal[1];
	document.getElementById("b_t5").innerHTML=total[2] + frackedTotal[2];
	document.getElementById("b_t25").innerHTML=total[3] + frackedTotal[3];
	document.getElementById("b_t100").innerHTML=total[4] + frackedTotal[4];
	document.getElementById("b_t250").innerHTML=total[5] + frackedTotal[5];

	if(frackedTotal[0] === 0)
	{
		document.getElementById("fixButton").setAttribute("disabled", "");
	} else {
		document.getElementById("fixButton").removeAttribute("disabled");
	}
}

function exportMode()
{
	
	let before = (new Date()).getTime();
	let loadBank = importer.importAllFromFolder("bank");
    let loadFracked = importer.importAllFromFolder("fracked");
	let id;
	
	let fragmentBank = document.createDocumentFragment();
	let fragmentFracked = document.createDocumentFragment();
	let row;
	for(let j =0; j<loadBank.length; j++)
	{
		id = loadBank[j].substring(loadBank[j].indexOf('.')+1);
		row = coinlist(id);
		if(row !== null)
		fragmentBank.appendChild(row);
	}
	for(let i=0;i<loadFracked.length;i++)
	{
		id = loadFracked[i].substring(loadFracked[i].indexOf('.')+1);
		row = coinlist(id);
		if(row !== null)
		fragmentFracked.appendChild(row);
	}
	document.getElementById("coinlistbank").appendChild(fragmentBank);
	document.getElementById("coinlistfracked").appendChild(fragmentFracked);
	
	let ts = (new Date()).getTime() - before;
	console.log(ts);
	
}
function exportModeOld()
{
	sortTable("coinlistbank");
	sortTable("coinlistfracked");
}

function updates(cc, fileUtil, percent=0, results = null)
{
    
	let msg = "";
	let good = null;
	let suspect = null;
	let counterf = null;
	let fullHtml = document.createDocumentFragment();
	
	if(results !== null){
	if(results[0] > 0 || results[2]> 0)
	{
		if(results[0] > 0)
			msg+= "Note(s) to bank:" + results[0] +"\n";
		if(results[2] > 0)
			msg+= "Note(s) that are fracked:" +results[2];
		good = document.createElement("div");
		good.setAttribute("class", "callout success");
		good.textContent = msg;
		
	}
	if(results[3] > 0)
	{
		msg ="Note(s) that got slow responses:"
		+ results[3];
		let redetect = document.createElement("button");
		redetect.setAttribute("class", "small button");
		redetect.setAttribute("onclick", "detect.detectAllSuspect(updates)");
		
		if(percent != 100)
		redetect.setAttribute("disabled", "");
		
		suspect = document.createElement("div");
		suspect.setAttribute("class", "callout warning");
		suspect.textContent = msg;
		suspect.appendChild(redetect);
	}
	if(results[1] > 0)
	{
		msg ="Note(s) that are counterfeit:"
		+ results[1];
		counterf = document.createElement("div");
		counterf.setAttribute("class", "callout alert");
		counterf.textContent = msg;
	}
		document.getElementById("detailsTable").textContent += " "+
		cc.sn+" "+cc.getFolder()+" "+cc.pown+" \n";
		
	}
	if(good !== null)
	fullHtml.appendChild(good);
	if(suspect !== null)
	fullHtml.appendChild(suspect);
	if(counterf !== null)
	fullHtml.appendChild(counterf);
	if(document.getElementById("importStatus").hasChildNodes)
	document.getElementById("importStatus").innerHTML ="";
	document.getElementById("importStatus").appendChild(fullHtml);
	log.updateLog(fullHtml.textContent);
	document.getElementById("uploadProgress").style.width = percent +"%";
	document.getElementById("uploadProgress").innerHTML="<p class='progress-meter-text'>"+percent+"%</p>";
	if(percent == 100){
	document.getElementById("uploadProgress").innerHTML="<p class='progress-meter-text'>done</p>";
	document.getElementsByClassName("uphide")[0].style.visibility = "initial";
	document.getElementsByClassName("uphide")[1].style.visibility = "initial";
	document.getElementsByClassName("uphide")[2].style.visibility = "initial";
	files.fileArray = [];
	document.getElementById("uploadList").innerHTML = "";
	document.getElementById("importHeadShown").textContent = "Import Complete";
	document.getElementById("deleteMessage").innerHTML = "Be sure to delete the original file. It is outdated."
	+ "<button class='small button' onclick="+"document.getElementById('importDetails').style.display='block'"+">Details</button>";	
}
	
	//mindlist();
	
	if(importer.importAllFromFolder("counterfeit").length > 0)
	{
		trashFolder("counterfeit");
	}
	if(percent == 100 && results[3] == 0)
	{
		makeBackup();
		
		//document.getElementById("importClose").setAttribute("data-close", "");
	}
}

function updatesTemp(cc, percent=0, results = null)
{
    
	let msg = "";
	let good = null;
	let suspect = null;
	let counterf = null;
	let fullHtml = document.createDocumentFragment();
	
	if(results !== null){
	if(results[0] > 0 || results[2]> 0)
	{
		if(results[0] > 0)
			msg+= "Note(s) to bank:" + results[0] +"\n";
		if(results[2] > 0)
			msg+= "Note(s) that are fracked:" +results[2];
		good = document.createElement("div");
		good.setAttribute("class", "callout success");
		good.textContent = msg;
		
	}
	if(results[3] > 0)
	{
		msg ="Note(s) that got slow responses:"
		+ results[3];
		
		suspect = document.createElement("div");
		suspect.setAttribute("class", "callout warning");
		suspect.textContent = msg;
		
	}
	if(results[1] > 0)
	{
		msg ="Note(s) that are counterfeit:"
		+ results[1];
		counterf = document.createElement("div");
		counterf.setAttribute("class", "callout alert");
		counterf.textContent = msg;
	}
		document.getElementById("detailsTable").textContent += " "+
		cc.sn+" "+cc.getFolder()+" "+cc.pown+" \n";
		
	}
	if(good !== null)
	fullHtml.appendChild(good);
	if(suspect !== null)
	fullHtml.appendChild(suspect);
	if(counterf !== null)
	fullHtml.appendChild(counterf);
	if(document.getElementById("importStatus").hasChildNodes)
	document.getElementById("importStatus").innerHTML ="";
	document.getElementById("importStatus").appendChild(fullHtml);
	log.updateLog(fullHtml.textContent);
	document.getElementById("uploadProgress").style.width = percent +"%";
	document.getElementById("uploadProgress").innerHTML="<p class='progress-meter-text'>"+percent+"%</p>";
	if(percent == 100){
	document.getElementById("uploadProgress").innerHTML="<p class='progress-meter-text'>done</p>";
	document.getElementsByClassName("uphide")[0].style.visibility = "initial";
	document.getElementsByClassName("uphide")[1].style.visibility = "initial";
	document.getElementsByClassName("uphide")[2].style.visibility = "initial";
	files.fileArray = [];
	document.getElementById("uploadList").innerHTML = "";
	document.getElementById("importHeadShown").innerHTML = "Import Complete";
	document.getElementById("deleteMessage").innerHTML = ""
	+ "<button class='small button' onclick="+"document.getElementById('importDetails').style.display='block'"+">Details</button>";	
}
	
	localStorage.removeItem("temp."+cc.sn);
	
	
}

function updatesToMind(cc, percent=0, results = null)
{
    
	trash(cc.sn);
	localStorage.setItem("mind."+cc.sn, "mindstorage");
	let msg = "";
	let good = null;
	let counterf = null;
	let fullHtml = document.createDocumentFragment();
	if(results !== null){
	if(results[0] > 0 || results[2]> 0)
	{
		
			msg+= "Note(s) moved successfully:" + (results[0]+results[2]);
			good = document.createElement("div");
		good.setAttribute("class", "callout success");
		good.textContent = msg;
	}
	if(results[3] > 0)
	{
		
	}
	if(results[1] > 0)
	{
		msg ="Note(s) that are counterfeit:"
		+ results[1];
		counterf = document.createElement("div");
		counterf.setAttribute("class", "callout alert");
		counterf.textContent = msg;
	}
	}


if(good !== null)
	fullHtml.appendChild(good);
	
	if(counterf !== null)
	fullHtml.appendChild(counterf);
	if(document.getElementById("toMindDetails").hasChildNodes)
	document.getElementById("toMindDetails").innerHTML ="";
	document.getElementById("toMindDetails").appendChild(fullHtml);
	log.updateLog(fullHtml.textContent);
	document.getElementById("toMindMessage").style.width = percent +"%";
	document.getElementById("toMindMessage").innerHTML="<p class='progress-meter-text'>"+percent+"%</p>";
	if(percent == 100){
	
	
		document.getElementById("toMindMessage").style.width = "100%";
		document.getElementById("toMindMessage").innerHTML="<p class='progress-meter-text'>done</p>";
		document.getElementById("user2").value = "";
		document.getElementById("pass2").value = "";
		document.getElementById("email2").value = "";
		//mindlist();
	
	
		
	}
	
	//mindlist();
	
	
	//if(percent == 100 && results[3] == 0)
	//{
		
		
		
	//}
}

function updatesFromMind(cc, fileUtil, percent = 0, results=null)
{
	document.getElementById("mindProgress").style.width = percent +"%";
	if(percent == 100)
	document.getElementById("mindProgress").innerHTML="<p class='progress-meter-text'>done</p>";
	let msg = "";
	let good = null;
	let suspect = null;
	let counterf = null;
	let fullHtml = document.createDocumentFragment();
	
	if(results !== null){
	if(results[0] > 0 || results[2]> 0)
	{
		if(results[0] > 0)
			msg+= "Note(s) to bank:" + results[0] +"\n";
		if(results[2] > 0)
			msg+= "Note(s) that are fracked:" +results[2];
		good = document.createElement("div");
		good.setAttribute("class", "callout success");
		good.textContent = msg;
		
	}
	if(results[3] > 0)
	{
		msg ="Note(s) that got slow responses:"
		+ results[3];
		
		suspect = document.createElement("div");
		suspect.setAttribute("class", "callout warning");
		suspect.textContent = msg;
		
	}
	if(results[1] > 0)
	{
		msg ="Note(s) that are counterfeit:"
		+ results[1];
		counterf = document.createElement("div");
		counterf.setAttribute("class", "callout alert");
		counterf.textContent = msg;
	}
		
		
	}
	if(good !== null)
	fullHtml.appendChild(good);
	if(suspect !== null)
	fullHtml.appendChild(suspect);
	if(counterf !== null)
	fullHtml.appendChild(counterf);
	if(document.getElementById("fromMindStatus").hasChildNodes)
	document.getElementById("fromMindStatus").innerHTML ="";
	document.getElementById("fromMindStatus").appendChild(fullHtml);
	log.updateLog(fullHtml.textContent);
	if(cc.getFolder().toLowerCase() == "counterfeit"){
		localStorage.setItem("mind."+cc.sn, "mindstorage");
		mindlist();
	}else{
	
	mindlist();
	//updateTotal(files);
	}
	
	
	
}

function trash(id)
{
    
        if(document.getElementById(id)){
		document.getElementById(id).remove();
		
        //files.overWrite("", "trash", id);
         if ((id < 2097153))
            {
                exportDialMinus(1);
            }
            else if ((id < 4194305))
            {
                exportDialMinus(5);
            }
            else if ((id < 6291457))
            {
                exportDialMinus(25);
            }
            else if ((id < 14680065))
            {
                exportDialMinus(100);
            }
            else if ((id < 16777217))
            {
                exportDialMinus(250);
            }
		}    
		if(document.getElementById("s"+id))
		document.getElementById("s"+id).remove();
        localStorage.removeItem(files.findCoin(id));
        //updateTotal(files);
}

function trashBad(id)
{
    
        if(document.getElementById(id))
		document.getElementById(id).remove();
		if(document.getElementById("s"+id))
		document.getElementById("s"+id).remove();
        //files.overWrite("", "trash", id);
         
            
		
        localStorage.removeItem(files.findCoin(id));
        //updateTotal(files);
}

function trashFolder(folder)
{
    let fnames = importer.importAllFromFolder(folder);

    for(let i = 0; i < fnames.length; i++){
        trashBad(fnames[i].substring(fnames[i].indexOf('.')+1));}
}

function embedCC(cc, N=false)
{
    let inputTag;
	if(N)
	{inputTag = document.getElementById("alltagN").value}
	else
	{inputTag = document.getElementById("alltag").value}
	let tag = cc.getDenomination() + ".cloudcoin.1." + cc.sn + ".";
	if(inputTag !== ""){
	tag += inputTag;
	} else {
		tag += "image";
	}
	tag += ".jpg";
    let oldImg = document.getElementById("jpeg-in").files[0];
    files.embedOneCloudCoinToJpeg(oldImg, cc, function(img){
		saveAs(img, tag);
	});

}

function embedTemplateCC(cc, N=false, canvases)
{
    if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i = 0; i < len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}
	
	//alert(files.bankFolder);
    //let oldImg = document.getElementById("jpeg-in").files[0];
	let tag;
	
	
for(let i = 0; i<cc.length;i++)
{
	let c;
	let ctx;
	//let oldImg;
	
	//oldImg.crossorigin = "use-credentials";
	switch(cc[i].getDenomination())
	{
	case 1:
	c = canvases[0];
	ctx = canvases[1];
	//oldImg = canvases[10];
	break;
	case 5:
	c= canvases[2];
	ctx = canvases[3];
	//oldImg = canvases[11];
	break;
	case 25:
	c = canvases[4];
	ctx = canvases[5];
	//oldImg = canvases[12];
	break;
	case 100:
	c = canvases[6];
	ctx = canvases[7];
	//oldImg = canvases[13];
	break;
	case 250:
	c = canvases[8];
	ctx = canvases[9];
	//oldImg = canvases[14];
	break;
 }
 	ctx.fillStyle = 'white';
	ctx.fillText(cc[i].sn + " of 16777216 on N: 1" , 40, 58);
  c.toBlob(function(blob) {        // get content as JPEG blob
	
	files.embedOneCloudCoinToJpeg(blob, cc[i], function(img){
		tag = cc[i].getDenomination() + ".cloudcoin.1." + cc[i].sn + ".";
	if(N)
	{tag += document.getElementById("alltagN").value;}
	else
	{tag += document.getElementById("alltag").value;}
	tag+= ".jpg";
		saveAs(img, tag);
		
	});
	
  }, "image/jpeg", 0.75);
  ctx.fillStyle = "#C7C5ED";
  ctx.fillText(cc[i].sn + " of 16777216 on N: 1" , 40, 58);
}
}
function emptyprogress(bar)
{
	document.getElementById(bar).style.width = "0%";
	document.getElementById(bar).innerHTML="";
}

function mindStorage(callback)
{
	document.getElementById("mindProgress").style.width = "0%";
	document.getElementById("mindProgress").innerHTML="";
	var usern = "";
	var passw = "";
	if(callback.name == "moveFromMind"){
	 usern = document.getElementById("email").value.toLowerCase();
	 passw = document.getElementById("user").value.toLowerCase();
	passw += document.getElementById("pass").value;
	log.updateLog("Moving from mind pass1:"+ document.getElementById("email").value +" pass2:" +document.getElementById("user").value + document.getElementById("pass").value);
	} else {
		 usern = document.getElementById("email2").value.toLowerCase();
	     passw = document.getElementById("user2").value.toLowerCase();
	     passw += document.getElementById("pass2").value;
		 log.updateLog("Moving to mind pass1:"+ document.getElementById("email2").value +" pass2:" +document.getElementById("user2").value + document.getElementById("pass2").value);
	}
	let phrase1 = "";
	let phrase2 = "";
	let combPhrase = "";
	let fullAn = "";
	let pan = [];
	for(let a = 0; a < usern.length; a++)
		phrase1 += usern.charCodeAt(a).toString(16);
	for(let b = 0; b < passw.length; b++)
		phrase2 += passw.charCodeAt(b).toString(16);
	if(phrase1.length >= phrase2.length){
		var phrasesize = phrase1.length;
	}else{
	var phrasesize = phrase2.length;}
	//alert(phrase1 + " " + phrase2);
	if((document.getElementById("user").value == document.getElementById("pass").value)&& callback.name == "moveFromMind")
	{
		
		alert("Username and Password cannot be the same");
		log.updateLog("Username and Password cannot be the same");// +
		//document.getElementById("user").value + " pass:" + document.getElementById("pass").value
		//);
	}else if((document.getElementById("user2").value == document.getElementById("pass2").value)&& callback.name == "moveToMind")
	{
		
		alert("Username and Password cannot be the same");
		log.updateLog("Username and Password cannot be the same");// +
		//document.getElementById("user").value + " pass:" + document.getElementById("pass").value
		//);
	}else if(phrase1.length + phrase2.length < 24)
	{
		alert("Username or Password is too short");
		log.updateLog("Username or Password is too short");
	}else if(usern[0] == /\s/ || usern[usern.length-1] == /\s/)
	{
		alert("Remove whitespace from the front and end of the Email");
		log.updateLog("Remove whitespace from the front and end of the Email");
	}else if(passw[0] == /\s/ || passw[passw.length-1] == /\s/){
		alert("Remove whitespace from the front and end of the Username and Password");
		log.updateLog("Remove whitespace from the front and end of the Username and Password");
	}else
	{
		for(let i = 0; i < phrasesize; i++){
			if(i<phrase1.length)
			combPhrase += phrase1[i];
			if(i<phrase2.length)
			combPhrase += phrase2[i];
		}
		//console.log(combPhrase);
		for(let k = 0; k < 800/combPhrase.length;k++)
			fullAn += combPhrase;
		fullAn = fullAn.slice(0, 800);
		for(let l = 0; l < 25; l++)
			pan.push(fullAn.slice(l*32, (l+1)*32));
			document.getElementById("mindProgress").style.width = "25%";
	
			callback(pan);
		
	}
	
}

function moveFromMind(pan)
{
	document.getElementById("mindProgress").style.width = "1%";
	
	let fnames = [];
	log.updateLog("Moving from mind coins:");
	for(var j = 0; j< localStorage.length; j++){
            if(localStorage.getItem(localStorage.key(j)) == "mindstorage"){
			id = localStorage.key(j).substring(localStorage.key(j).indexOf('.')+1);
				if(document.getElementById("mcb" + id).checked)
				{fnames.push(id);
				log.updateLine(id +",");}
			}
        }
	for(let i = 0; i < fnames.length; i++)
	{
		let cc = new CloudCoin(1, fnames[i], pan);
		files.saveCloudCoinToJsonFile(cc, "suspect."+cc.sn);
		localStorage.removeItem("mind."+cc.sn);
		//files.writeTo("suspect", cc.sn);
	}
	document.getElementById("mindProgress").style.width = "2%";
	document.getElementById("user").value = "";
		document.getElementById("pass").value = "";
		document.getElementById("email").value = "";
	detect.detectAllSuspect(updatesFromMind);
}

function moveToMind(newPan)
{
	
	let xhttp = new XMLHttpRequest();
	//alert(newPan);
	let data = "email=" + document.getElementById("email2").value;
	let toBeMoved = [];
	let k = 0;
	log.updateLog("Moving into mind coins:");
	for(let j = 0; j < localStorage.length; j++){
        if((localStorage.key(j).includes("bank") ||localStorage.key(j).includes("fracked"))&& localStorage.key(j).includes("le")===false){
			 
			if(document.getElementById("scb" + localStorage.key(j).substring(localStorage.key(j).indexOf('.')+1)).checked){
			toBeMoved.push(files.loadOneCloudCoinFromJsonFile(localStorage.key(j)));
			log.updateLine(toBeMoved[k].sn +",");
			data += "&sn[" + k + "]=" + toBeMoved[k].sn;
			k++; 
			}
		}
    }
xhttp.open("POST", "core/mailMind.php", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send(data);
xhttp.onreadystatechange = function(){
	document.getElementById("toMindMessage").style.width = "2%";
	if(this.readyState == 4 && this.status == 200){
	console.log(this.responseText);
	//let promises = [];
	for(let i = 0; i<toBeMoved.length; i++){
		toBeMoved[i].pans = newPan;
		
		
		
	}
	detect.detectAllToMind(toBeMoved, updatesToMind); //change to detector
}
if(this.status == 400)
console.log(this.responseText);
}

}

function statusButton()
{
	let echo = raida.echoAll();
	for(let i = 0; i < 25; i++)
    {
        echo[i].then(function(rr){
            //alert(rr.success)
        populateRaidaStatus(raida.responseArray[i], i);
        
});
    }
}

function sortTable(table) {
    var tb = document.getElementById(table),//.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 1), // put rows into array
        i,
		col = 2;
    //reverse = -((+reverse) || -1);
    tr = tr.sort(function (a, b) { // sort rows
        return (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
                .localeCompare(b.cells[col].textContent.trim(), undefined, {numeric: true})
               );
    });
   for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
}

function sortList() {
    var ul = document.getElementById("coinlistmind"),
	list = Array.prototype.slice.call(ul.childNodes, 0),
        i;
    list = list.sort(function (a, b) { 
        return (a.textContent.substring(a.textContent.indexOf(" ")+1,a.textContent.indexOf("  ")) 
                .localeCompare(b.textContent.substring(b.textContent.indexOf(" ")+1,b.textContent.indexOf("  ")) , undefined, {numeric: true})
               );
    });
   for(i = 0; i < list.length; ++i) ul.appendChild(list[i]);
}

function convertOld()
{
	let cc;
	let sn = [];
	let data = [];
	let folder = [];
	let mind = [];
	for(let j = 0; j< localStorage.length; j++)
	{
		if(isNaN(localStorage.key(j))===false){
			if(localStorage.getItem(localStorage.key(j)) == "mindstorage")
			{
				mind.push(localStorage.key(j));
			}else{
			cc = files.loadOneCloudCoinFromJsonFile(localStorage.key(j));
			cc.reportDetectionResults();
			sn.push(cc.sn);
			folder.push(cc.getFolder().toLowerCase());
			data.push(localStorage.getItem(localStorage.key(j)));
			}
		}
	}
	for(let i =0; i< data.length; i++)
	{
		localStorage.removeItem(sn[i]);
		localStorage.setItem(folder[i]+"."+sn[i], data[i]);
	}
	for(let k = 0; k<mind.length; k++)
	{
		localStorage.removeItem(mind[k]);
		localStorage.setItem("mind." + mind[k], "mindstorage");
	}
}