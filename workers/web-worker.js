// Initialize the page
function init() {
  //var cur = window.current_drive_order || 0;
  var buckets = window.buckets;
  var bucket = window.buckets[0];
  window.selectedBucket=bucket;
  
  document.siteName = $('title').html();
  var html = `
  <header>
    <div id="nav">
    </div>
  </header>
  <div class="container-fluid bg-light" style="padding-top: 60px; padding-bottom: 24px;">
    <div class="container">
      <div id="notifications" class="list-group text-break">
      </div>
      <form action="" class="row g-3">

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
          <label for="" class="form-label">Videos Buckets</label>
          
          <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuFolders" data-bs-toggle="dropdown" aria-expanded="true">${bucket}</button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuFolders">`;

          buckets.forEach((bucket) => {
              html += `<li><a class="dropdown-item" style="cursor:pointer;" id="selected_bucket" onclick="setSelectedBucket('${bucket}');">${bucket}</a></li>`;
          });
          
        html += `</ul></div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3">
          <label for="" class="form-label">Playlist ID</label>
          <input type="number" class="form-control" id="playlist_id" placeholder="Enter playlist id" required>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3">
          <label for="" class="form-label">Thumbnail</label>
          <input type="url" class="form-control" id="thumbnail" placeholder="Enter thumbnail url" required>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
          <label for="" class="form-label">Draft</label>
          <select id="draft" class="form-control form-select" aria-label="Draft">
            <option value="0" selected>Undraft</option>
            <option value="1">Draft</option>
          </select>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
          <label for="Script Type" class="form-label">Script Type</label>
          <select id="script_type" class="form-control form-select" aria-label="Script Type">
            <option value="json" selected>JSON</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-start">
          <div class="d-inline-block me-1">Web</div>
          <div class="form-check form-switch d-inline-block">
            <input class="form-check-input" type="checkbox" checked role="switch" id="switch_views">
            <label class="form-check-label" for="switch_views">Scripts</label>
          </div>
        </div>
        
        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 text-end">
          <button id="generate_scripts_loading" class="btn btn-dark" type="button" disabled>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span class="">Loading...</span>
          </button>
          <button class="btn btn-dark" type="button" id="generate_scripts" onclick="generateScripts();">Generate Scripts</button>
        </div>

      </form>
    </div>
  </div>

  <div class="container" id="container_output" style="margin-top: 16px; margin-bottom: 64px;">
      
    <div class="row" style="margin-bottom: 10px;" id="script_view">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4" style="margin-bottom: 6px;">
        <input type="url" class="form-control" id="apiendpoint" placeholder="Enter API endpoint address." required>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4" style="margin-bottom: 6px;">
        <input type="url" class="form-control" id="apikey" placeholder="Enter API key." required>
      </div>
      
      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-2" style="margin-bottom: 6px;">
        <button class="btn btn-outline-dark" id="publish" onclick="publishScripts();" style="width: 100%;" type="submit">Publish</button>
      </div>
      
      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-2" style="margin-bottom: 6px;">
        <button class="btn btn-outline-dark" style="width: 100%;" id="copy_to_clipboard" type="button" onclick="copyToClipboard();">Copy</button>
      </div>

      <div class="col-xm-12 col-sm-12 col-md-12 col-lg-12 mt-4">
          <textarea rows="20" class="form-control bg-light" id="output" placeholder="output" readonly></textarea>
      </div>

    </div>
    

    <div class="row" id="web_view">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 mt-2">
        <input type="url" class="form-control border-primary" id="apiendpoint_web_view" placeholder="Enter API endpoint address." required>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 mt-2">
        <input type="url" class="form-control border-primary" id="apikey_web_view" placeholder="Enter API key." required>
      </div>
      
      <div class="col-xm-12 col-sm-12 col-md-12 col-lg-12 mt-4">
          <div id="output_html"></div>
      </div>
    </div>

  </div>


  <div class="container rounded border border-1 bg-light" id="container_loading" style="padding:200px;margin-top: 16px; margin-bottom: 64px border">
    <div class="d-flex justify-content-center"><div class="spinner-border text-black m-5" role="status"><span class="sr-only"></span></div></div>
  </div>

  <div class="container" style="margin-top: 16px; margin-bottom: 64px">
      <div>
        <p class="text-center text-muted">Supported Media Types</p>
        <p class="text-center text-muted">.mp4 | .webm | .avi | .mpg | .mpeg | .mkv | .rm | .rmvb| .mov | .wmv | .asf | .ts | .flv</p>
        </div>
    </div>`;

  $('body').html(html);
}


function setSelectedBucket(bucket){
  window.selectedBucket=bucket;
}

function generateScripts(path){

let playlist_id = $('#playlist_id').val();
let thumbnail   = $('#thumbnail').val();
let script_type = $('#script_type').val();

if(playlist_id === undefined || playlist_id === null || playlist_id === "" || thumbnail === undefined || thumbnail === null || thumbnail === ""){
  //show error message.
  //$('#notifications').show();
  $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Please fill all required fields.</div>`);
}else{
  //hide error message.
  $('#notifications').hide();

  if (script_type === "sql"){
    getGeneratedSQLStatments();
    //$("#apiendpoint, #apikey, #publish").hide();
  }else if (script_type === "json"){
    getGeneratedJsonPayloads(path);
    //$("#apiendpoint, #apikey, #publish").show();
  }
}

}

async function getGeneratedSQLStatments() {
  
  const response = await fetch(window.location.origin+"/objects?bucket="+window.selectedBucket);
  // Check if the response is OK (status code 200-299)
  if (!response.ok) {
    $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Please fill in all required fields or ensure the selected bucket is created in R2.</div>`);
  }
  const data = await response.text(); // JSON data

  // Parse the JSON string into a JavaScript object
  const objects = JSON.parse(data).objects;

  if (!Array.isArray(objects)) {
     $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Invalid objects array.</div>`);
    return;
  }

  let html="";
  let statments = "";
  let statment="";
  
  //$('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>${JSON.stringify(objects)}</div>`);

  for (i in objects) {
    var object  = objects[i];
    var key = objects[i].Key;

    var ext         = key.split('.').pop().toLowerCase();
    var playlist_id = $('#playlist_id').val();
    var user_id     = "4";
    var thumbnail   = $('#thumbnail').val();
    var draft       = $('#draft').val();
    var name        = removeSpecialChars(key.replace('.'+ext,""));
    var duration    = "TIME_FORMAT(SEC_TO_TIME(FLOOR(RAND() * 3600)), '%H:%i:%s')";
    var datetime    = new Date(Date.now()+(i*1000)).toISOString().slice(0, 19).replace('T', ' ');
    var video_url   = window.configs.buckets.find(b => b.bucket === window.selectedBucket).bucketPublicR2Url+"/"+key;

    if ("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
      
      statment="INSERT INTO `videos`(`playlist_id`, `user_id`, `name`, `description`, `url`, `duration`, `type`, `thumbnail`, `created_at`, `updated_at`, `featured`, `draft`, `downloads`, `views`) VALUES ("+playlist_id+","+user_id+",'"+name+"','Watch "+name+" from your favorite entertainment app.','"+video_url+"',"+duration+",1,'"+thumbnail+"','"+datetime+"','"+datetime+"',0,"+draft+",0,0);";

      statments += statment;

      html +=`
      <div class="card border-primary" style="margin-bottom: -1px;">
      <div class="row g-0 d-flex align-items-center">
        <div class="col-sm-12 col-md-4 col-lg-3 p-3">
          <img src="`+thumbnail+`"  class="img-fluid rounded g-0 d-flex align-items-center" alt="image">
        </div>
        <div class="col-sm-12 col-md-8 col-lg-9">
          <div class="card-body">
            <h5 class="card-title text-primary">`+name+`</h5>
            <p class="card-text"><a class="text-primary text-decoration-none" href="`+video_url+`" target="_blank">`+video_url+`</a></p>
            <div class="text-end px-4 mt-4">
                <button class="btn btn-outline-primary btn-sm px-4" id="copy_script" type="button" data-video="`+statment+`">Copy</button>
                <a class="text-primary text-decoration-none" href="`+video_url+`" target="_blank">
                  <button type="button" class="btn btn-outline-primary btn-sm px-4">Download</button>
                </a>
              <button class="btn btn-outline-primary btn-sm px-4" id="publish_script" type="button" data-video="`+statment+`">Publish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    }

  }

  if(statments ===""){
    $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Unable to find videos in this folder.</div>`);
    $('#container_output').hide();
  }else{
    $('#container_output').show();
  }
  $('#output').html(statments);
  $('#output_html').html(html);

}

async function getGeneratedJsonPayloads() {
  
  const response = await fetch(window.location.origin+"/objects?bucket="+window.selectedBucket);
  // Check if the response is OK (status code 200-299)
  if (!response.ok) {
    $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Please fill in all required fields or ensure the selected bucket is created in R2.</div>`);
  }
  const data = await response.text(); // JSON data

  // Parse the JSON string into a JavaScript object
  const objects = JSON.parse(data).objects;

  if (!Array.isArray(objects)) {
     $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Invalid objects array.</div>`);
    return;
  }

  let html="";
  let payload="";
  let payloads = "[";
  
  //$('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>${JSON.stringify(objects)}</div>`);

  for (i in objects) {
    var object  = objects[i];
    var key = objects[i].Key;

    var ext         = key.split('.').pop().toLowerCase();
    var playlist_id = $('#playlist_id').val();
    var user_id     = "4";
    var thumbnail   = $('#thumbnail').val();
    var draft       = $('#draft').val();
    var name        = removeSpecialChars(key.replace('.'+ext,""));
    var duration    = getRandomTime();
    var datetime    = new Date(Date.now()+(i*1000)).toISOString().slice(0, 19).replace('T', ' ');
    var video_url   = window.configs.buckets.find(b => b.bucket === window.selectedBucket).bucketPublicR2Url+"/"+key;

    if ("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
      
      payload = `{ "playlist_id": `+playlist_id+`,"user_id": `+user_id+`,"name": "`+name+`", "description": "Watch `+name+` from barf entertainment app.", "url": "`+video_url+`", "duration": "`+duration+`", "type": 1, "thumbnail": "`+thumbnail+`", "featured": 0, "draft": `+draft+`,"created_at":"`+datetime+`","updated_at":"`+datetime+`"}`;

      payloads +=payload+',';

      html +=`
      <div class="card border-primary" style="margin-bottom: -1px;">
      <div class="row g-0 d-flex align-items-center">
        <div class="col-sm-12 col-md-4 col-lg-3 p-3">
          <img src="`+thumbnail+`"  class="img-fluid rounded g-0 d-flex align-items-center" alt="image">
        </div>
        <div class="col-sm-12 col-md-8 col-lg-9">
          <div class="card-body">
            <h5 class="card-title text-primary">`+name+`</h5>
            <p class="card-text"><a class="text-primary text-decoration-none" href="`+video_url+`" target="_blank">`+video_url+`</a></p>
            <div class="text-end px-4 mt-4">
                <button class="btn btn-outline-primary btn-sm px-4" id="copy_script" type="button" data-video="`+payload+`">Copy</button>
                <a class="text-primary text-decoration-none" href="`+video_url+`" target="_blank">
                  <button type="button" class="btn btn-outline-primary btn-sm px-4">Download</button>
                </a>
              <button class="btn btn-outline-primary btn-sm px-4" id="publish_script" type="button" data-video="`+payload+`">Publish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    }

  }
  payloads += "]";

  if(payloads ==="[]"){
    $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Unable to find videos in this folder.</div>`);
    $('#container_output').hide();
  }else{
    $('#container_output').show();
    payloads = payloads.replace(',]', ']');
  }
  $('#output').html(payloads);
  $('#output_html').html(html);
}


function publishScript(outputdata){

let api_endpoint = $('#apiendpoint_web_view').val();
let api_key   = $('#apikey_web_view').val();
let script_type = $('#script_type').val();
//let outputdata = outputdata;

if(api_endpoint === undefined || api_endpoint === null || api_endpoint === "" || api_key === undefined || api_key === null || api_key === ""){
  //show error message.
  $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Please enter API Endpoint and API Key then press Publish.</div>`);
} else if (outputdata === undefined || outputdata === null || outputdata === ""){
  $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Please re-generate-scripts then press Publish.</div>`);
}else{
  //hide error message.
  $('#notifications').hide();

  if (script_type === "sql"){
    //alert(outputdata);
    publishSQLStatments(api_endpoint,api_key,outputdata);
  }else if (script_type === "json"){
    //alert(outputdata);
    publishJsonPayloads(api_endpoint,api_key,outputdata);
  }
}

}

function publishScripts(){

let api_endpoint = $('#apiendpoint').val();
let api_key   = $('#apikey').val();
let script_type = $('#script_type').val();
let outputdata = $('#output').val();

if(api_endpoint === undefined || api_endpoint === null || api_endpoint === "" || api_key === undefined || api_key === null || api_key === ""){
  //show error message.
  $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Please enter API Endpoint and API Key then press Publish.</div>`);
} else if (outputdata === undefined || outputdata === null || outputdata === ""){
  $('#notifications').show().html(`<div class='alert alert-danger text-start' role='alert'>Please re-generate-scripts then press Publish.</div>`);
}else{
  //hide error message.
  $('#notifications').hide();

  if (script_type === "sql"){
    publishSQLStatments(api_endpoint,api_key,outputdata);
  }else if (script_type === "json"){
    publishJsonPayloads(api_endpoint,api_key,outputdata);
  }
}

}
function publishSQLStatments(url,apikey,payloads){

$('#container_output').hide();
$('#container_loading').show();

var settings = {
  "url": url,
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": "Bearer "+apikey,
    "Content-Type": "application/json"
  },
  "data": payloads,
};

$.ajax(settings).done(function (response) {
  //console.log(response);
  if(response.status_code === 201 || response.status_code === 200){
    $('#output').html("");
    $('#container_loading').hide();
    $('#container_output').show();
    $('#notifications').show().html(`<div class='alert alert-success' role='alert'> New Records are submited successfully, From SQL Statments.</div>`);

  }else{
    $('#container_loading').hide();
    $('#container_output').show();
    $('#notifications').show().html(`<div class='alert alert-danger' role='alert'> Unable to submit new records to the Server, Something went wrong.</div>`);
  }
}).fail(function (response) {
  //console.log(response);
  $('#container_loading').hide();
  $('#container_output').show();
  $('#notifications').show().html(`<div class='alert alert-danger' role='alert'> Unable to submit new records to the Server, Something went wrong.</div>`);
});

}
function publishJsonPayloads(url,apikey,payloads){

$('#container_output').hide();
$('#container_loading').show();

var settings = {
  "url": url,
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": "Bearer "+apikey,
    "Content-Type": "application/json"
  },
  "data": payloads,
};

$.ajax(settings).done(function (response) {
  //console.log(response);
  if(response.status_code === 201 || response.status_code === 200){
    $('#output').html("");
    $('#container_loading').hide();
    $('#container_output').show();
    $('#notifications').show().html(`<div class='alert alert-success' role='alert'> New Records are submitted successfully, From JSON Payloads.</div>`);

  }else{
    $('#container_loading').hide();
    $('#container_output').show();
    $('#notifications').show().html(`<div class='alert alert-danger' role='alert'> Unable to submit new records to the Server, Something went wrong.</div>`);
  }
}).fail(function (response) {
  //console.log(response);
  $('#container_loading').hide();
  $('#container_output').show();
  $('#notifications').show().html(`<div class='alert alert-danger' role='alert'> Unable to submit new records to the Server, Something went wrong.</div>`);
});

}

// Listen for fallback events
//The popstate event of the Window interface is fired when the active history entry changes while the user navigates the session history.
window.onpopstate = function() {
  init();
}


$(function() {
  init();
  $('#generate_scripts_loading').hide();
  $('#container_output').hide();
  $('#container_loading').hide();

  $('#script_type').change(function() {
    $('#output').text('');
    $('#output_html').html('');
  });

  switchViews();
  $('#switch_views').change(function() {
    switchViews();
  });

  $(document).on('click', '#publish_script', function(){
    publishScript($(this).attr('data-video'));
   });

   $(document).on('click', '#copy_script', function(){
    copyTextToClipboard($(this).attr('data-video'));
   });

});

function switchViews(){
if($("#switch_views").is(':checked')){
  $('#script_view').show();
  $('#web_view').hide();
} else{
  $('#script_view').hide();
  $('#web_view').show();
}
}

// Copy to Clipboard
function copyToClipboard() {
  var copyText = document.getElementById("output");
  copyText.select();
  var text = copyText.value;
  //copyText.setSelectionRange(0, 99999);
  copyText.setSelectionRange(0, text.length);
  document.execCommand("copy");
}
// Copy to Clipboard from text
function copyTextToClipboard(text) {
var textarea = document.createElement("textarea");
textarea.setAttribute("id", "copy_script_id");
document.body.appendChild(textarea);
textarea.value = text;
textarea.select();
var text = textarea.value;
//textarea.setSelectionRange(0, 99999);
textarea.setSelectionRange(0, text.length);
document.execCommand("copy");
document.body.removeChild(textarea);
}

function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy";
}

//milliseconds to time
function millisecondsToTime(s) {
// Pad to 2 or 3 digits, default is 2
function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}

var ms = s % 1000;
s = (s - ms) / 1000;
var secs = s % 60;
s = (s - secs) / 60;
var mins = s % 60;
var hrs = (s - mins) / 60;

return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

//remove Special Chars
function removeSpecialChars(str) {
return str.replace(/(?!\w|\s)./g, ' ')
  .replace(/\s+/g, ' ')
  .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

function getRandomTime() {
  // Generate a random number of seconds between 0 and 3599 (equivalent to 0 to 59 minutes and 59 seconds)
  const totalSeconds = Math.floor(Math.random() * 3600);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format the result as 'HH:mm:ss'
  const formattedTime = [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
  ].join(':');

  return formattedTime;
}
