function populate(rr, id)
{
    document.getElementById("r_" + id).innerHTML = rr.outcome;
    document.getElementById("p_" + id).innerHTML = rr.milliseconds;
}

function coinlist(cc, fileUtil)
{
    let id = cc.sn;
    if(document.getElementById(id) != null){
        document.getElementById(id).remove();
        document.getElementById("tag"+id).remove();
        document.getElementById("dl"+id).remove();
        document.getElementById("im"+id).remove();}
    let listname = "coinlist" + cc.getFolder().toLowerCase();
    let htmltext = "<li id = '"+id+"'>sn:" + id + " pown:" + cc.pown + " denomination:"
    + cc.getDenomination() + " tag:</li><input type='text' id ='tag" +id + "'>"
    + "<button id = 'dl"+id+"'>Download File</button><button id ='im"+id+"'>Download Image</button>";
    document.getElementById(listname).innerHTML += htmltext;
    //let tag = document.getElementById("tag"+ id); 
    let el = document.getElementById(listname);
    el.addEventListener("click",download);
    
}
function download(e)
{
    //let files = new FileUtils();
    let id = e.target.id.slice(2);
    let tag = document.getElementById("tag" + id)
    if(e.target.id == "dl" + id){
        files.downloadCloudCoinToJsonFile(id, tag.value);
        trash(id);
    }else if(e.target.id == "im" + id && document.getElementById("jpeg-in").files.length != 0)
    {
        //alert("clicked");
        embedCC(files.loadOneCloudCoinFromJsonFile(id));
        trash(id);
    }
    //e.stopPropogation();
}

function downloadAll()
{
    let ffnames = files.frackedFolder.split(",");
    let bfnames = files.bankFolder.split(",");
    ffnames.pop();
    bfnames.pop();
    let fnames = bfnames.concat(ffnames);
    let tag = document.getElementById("alltag").value;
    files.downloadAllCloudCoinToJsonFile(fnames, tag);
    trashFolder(files.bankFolder);
    trashFolder(files.frackedFolder);
}

function showFolder(){
        alert("cf:" + files.counterfeitFolder);
        alert("b:" + files.bankFolder);
        alert("s:" + files.suspectFolder);
        alert("f:" + files.frackedFolder);
    }
	
function uploadButtonAppear(){
	//alert(document.getElementById("myFile").value);
    document.getElementById("upButtonDiv").innerHTML="<button id='upButton' onclick='uploadFile()'>Upload</button>";
}

function uploadFile(){
	let elFile = document.getElementById("myFile");
    for(let i = 0; i < elFile.files.length; i++){
    let upJson = elFile.files[i];
    if(elFile.value.slice(-5) == "stack"){
	files.uploadCloudCoinFromJsonFile(upJson, files.saveCloudCoinToJsonFile);
    } else if(elFile.value.slice(-4) == "jpeg" || elFile.value.slice(-4) == "jfif" || elFile.value.slice(-3) == "jpg"){
        files.uploadCloudCoinFromJpegFile(upJson, files.saveCloudCoinToJsonFile);
    } else{alert("Valid File Type Please");}
    }
	setTimeout(function(){
		detect.detectAllSuspect(updates);
        
        //let importer = new Importer();
    //let coins = importer.importAll(fileUtil);
		//coins.forEach(coinlist);
		//updateTotal(fileUtil);
		}, 500);
}

function updateTotal(fileUtil)
{
	let banker = new Banker();
    let total = banker.countCoins(fileUtil);
    document.getElementById("cointotal").innerHTML ="total: " + total[0];
}

function updates(cc, fileUtil)
{
    coinlist(cc, fileUtil);
    updateTotal(fileUtil);
}

function trash(id)
{
    
        document.getElementById(id).remove();
        document.getElementById("tag"+id).remove();
        document.getElementById("dl"+id).remove();
        document.getElementById("im"+id).remove();
        localStorage.removeItem(id);
        updateTotal(files);
}

function trashFolder(folder)
{
    let fnames = [];
    
    for(var j = 0; j< localStorage.length; j++){
            if(folder.includes(localStorage.key(j)))
            fnames.push(localStorage.key(j));
    }

    for(let i = 0; i < fnames.length; i++){
        trash(fnames[i]);}
}

function embedCC(cc)
{
    //alert(files.bankFolder);
    let oldImg = document.getElementById("jpeg-in").files[0];
    files.embedOneCloudCoinToJpeg(oldImg, cc, function(img){document.getElementById("jpeg-out").innerHTML+="image with cloud coin: " + cc.sn + img.outerHTML});
}