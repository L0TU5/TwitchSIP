var live; // streamer online status
var name; // streamer account name
var logo;// streamer logo
var status;// streamer text status
var preview; // streamer live stream preview

function getAll() { // get and display JSON data results - all channels
  $("#all").append(`${displayData()}`);
}
function getOnline() {
  $("#online").append(`${displayData()}`); // get and display JSON data results - online channels
}
function getOffline() {
  $("#offline").append(`${displayData()}`); // get and display JSON data results - offline channels
}
function displayData() { // JSON data displauy formatting 
  return `<div class="w3-third result"><div class="w3-card-4 w3-margin" id="template"><div class="w3-row"><div class="w3-col w3-display-container w3-purp-l2" id="dispName">${live}<a href="https://www.twitch.tv/${name}" title="Go to ${name}'s channel" target="_blank">${name}</a></div></div><div class="w3-display-container"><img src="${preview}" alt="Preview" style="width:100%"><div class="w3-padding w3-display-topright"><img src="${logo}" alt="logo" id="logo" title="${name}'s logo!"></div></div><div class="w3-container w3-purp-l4 w3-center" style="padding-top:.5vw, min-height:150px;"><p>${status}</p></div></div></div>`;
}
//BEGIN JQ
$(document).ready(function() {
  //BEGIN TWITCH.TV USERNAME SUBMISSION
  var nameInput = document.getElementById("userName");
  document
    .querySelector("form.pure-form")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      console.log(nameInput.value);
      //FCC FOLLOWERS API CALL
      var followerURL =
        "https://wind-bow.glitch.me/twitch-api/channels/" +
        nameInput.value +
        "/follows";
      var channels = [];
      $.getJSON(followerURL, function(data1) {
        for (var a = 0; a < data1.follows.length; a++) {
          var displayName = data1.follows[a].user.display_name;
          channels.push(displayName);
        }
        //BEGIN Channel forEach
        channels.forEach(function(channel) {
          var streamURL =
            "https://wind-bow.glitch.me/twitch-api/streams/" + channel;
          //BEGIN Channel getJSON
          $.getJSON(streamURL, function(streamData) {
            if (streamData.stream === null) {
              var chanURL =
                "https://wind-bow.glitch.me/twitch-api/channels/" + channel;
              $.getJSON(chanURL, function(chanData) {
                if (chanData.error) {
                  //NULL CHANNEL DATA
                  live = "";
                  name = channel;
                  logo = "http://i66.tinypic.com/2la67br.png";
                  status = "Channel Not Found!";
                  preview = "http://i65.tinypic.com/ih35e9.png";
                  getAll();
                  getOffline();
                } else {
                  //OFFLINE CHANNEL DATA
                  live =
                    '<div class="w3-round-xxlarge w3-red w3-left" id="activeStat" style="width:2vw"></div>';
                  name = chanData.display_name;
                  logo = chanData.logo;
                  if (chanData.status === null) {
                    status = "Not streaming, probably dreaming.";
                  } else {
                    status = chanData.status;
                  }
                  if (!chanData.video_banner) {
                    preview = "http://i67.tinypic.com/29cl0go.png";
                  } else preview = chanData.video_banner;
                  getAll();
                  getOffline();
                }
              });
            } else {
              // ONLINE CHANNEL DATA
              live =
                '<div class="w3-round-xxlarge w3-green w3-left" id="activeStat" style="width:2vw"></div>';
              name = streamData.stream.channel.display_name;
              url = logo = streamData.stream.channel.logo;
              if (streamData.stream.channel.status === null) {
                status = "";
              } else {
                status = streamData.stream.channel.status;
              }
              preview = streamData.stream.preview.large;
              getAll();
              getOnline();
            }
          }); //END Channel getJSON
        }); //END Channel forEach
      }); //END FCC FOLLOWERS API CALL AND PUSH UPDATE
    }); //END TWITCH.TV USERNAME SUBMISSION
}); //END JQ

//BEGIN TAB NAVIGATION
function openTab(evt, tabName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-purp-l5", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " w3-purp-l5";
}
//END TAB  NAVIGATION