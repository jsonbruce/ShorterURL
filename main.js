// Copyright @Max Xu
// https://github.com/jsonbruce/ShorterURL

function copyTextToClipboard(text) {
  var transfer = document.createElement('textarea');
  transfer.id = '_CopyTransferContainer';
  transfer.style.position = 'absolute';
  transfer.style.left = '-9999px';
  transfer.style.top = '-9999px';
  document.body.appendChild(transfer);

  transfer.value = text;
  transfer.focus();
  transfer.select();

  try {
    document.execCommand('copy', false, null);
  } catch (err) {
    alert("Cannot Copy!");
  }
}


function requestTinyURL(url, callback) {
  var server = "https://tinyurl.com/create.php";
  var method = "POST"

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  xhttp.open(method, server, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("url=" + url);
}


function parseTinyURL(responseText) {
  var parser = new DOMParser()
  var doc = parser.parseFromString(responseText, "text/html");
  // doc.getElementById("copy_div").click()
  var tinyurl = doc.querySelectorAll(".indent>b")[1].innerText

  alert(tinyurl);

  copyTextToClipboard(tinyurl)
}


function getShorterURL(info, tab) {
  var currentPageURL = tab.url;

  requestTinyURL(currentPageURL, function(responseText) {
    parseTinyURL(responseText);
  });

}


chrome.contextMenus.create({
  "title": "Shorter URL",
  "onclick": getShorterURL
});