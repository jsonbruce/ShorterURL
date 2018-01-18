// Copyright @Max Xu
// https://github.com/jsonbruce/ShorterURL

/**
 * Copy string to Clipboard.
 * @param  {String} text [description]
 * @return {[type]}      [description]
 */
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


/**
 * Service of TinyURL.
 * @param  {String}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
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


/**
 * After request TinyURL.
 * @param  {[type]} responseText [description]
 * @return {[type]}              [description]
 */
function parseTinyURL(responseText) {
  var parser = new DOMParser()
  var doc = parser.parseFromString(responseText, "text/html");
  // doc.getElementById("copy_div").click()
  var tinyurl = doc.querySelectorAll(".indent>b")[1].innerText

  alert(tinyurl);

  copyTextToClipboard(tinyurl)
}


/**
 * Service for GitHub.com or GitHub.io URL.
 * @param  {String}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function requestGitHubURL(url, callback) {
  var server = "https://git.io/create";
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


/**
 * After request GitURL.
 * @param  {String} responseText [description]
 * @return {[type]}              [description]
 */
function parseGitHubURL(responseText) {
  var giturl = "https://git.io/" + responseText;

  alert(giturl);

  copyTextToClipboard(giturl);
}


/**
 * Service Dispatcher.
 * @param  {[type]} info [description]
 * @param  {[type]} tab  [description]
 * @return {[type]}      [description]
 */
function getShorterURL(info, tab) {
  var currentPageURL = tab.url;

  var url = new URL(currentPageURL);
  var host = url.host.split(".")
  host = host[host.length - 2]

  if (host == "github") {
    requestGitHubURL(currentPageURL, function(responseText) {
      parseGitHubURL(responseText);
    });
  } else {
    requestTinyURL(currentPageURL, function(responseText) {
      parseTinyURL(responseText);
    });
  }

}


chrome.contextMenus.create({
  "title": "Shorter URL",
  "onclick": getShorterURL
});