var BACK_ICON = '<button class="button button-icon icon ion-ios7-arrow-back" onclick="goBack()"></button>';
var RELOAD_ICON = '<i class="icon ion-ios7-reload"></i>';
var RELOADING_ICON = '<i class="icon ion-ios7-reloading"></i>';
var LOADING_ICON = '<i class="icon ion-loading-c"></i>';

function goBack(){
  window.history.back()
  }

function reload(){
    document.getElementById('reloadButton').innerHTML = RELOADING_ICON;
    printGameListWaitingTurn();
    printGameListYourTurn();
    setTimeout(function(){document.getElementById('reloadButton').innerHTML = RELOAD_ICON;}, 1000);
    
}