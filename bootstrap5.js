/*
Copyright Stéphane Georges Popoff, (juillet 2009 - juin 2021)

spopoff@rocketmail.com

Ce logiciel est un programme informatique servant à gérer des habilitations.

Ce logiciel est régi par la licence [CeCILL|CeCILL-B|CeCILL-C] soumise au droit français et
respectant les principes de diffusion des logiciels libres. Vous pouvez
utiliser, modifier et/ou redistribuer ce programme sous les conditions
de la licence [CeCILL|CeCILL-B|CeCILL-C] telle que diffusée par le CEA, le CNRS et l'INRIA
sur le site "http://www.cecill.info".

En contrepartie de l'accessibilité au code source et des droits de copie,
de modification et de redistribution accordés par cette licence, il n'est
offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
seule une responsabilité restreinte pèse sur l'auteur du programme,  le
titulaire des droits patrimoniaux et les concédants successifs.

A cet égard  l'attention de l'utilisateur est attirée sur les risques
associés au chargement,  à l'utilisation,  à la modification et/ou au
développement et à la reproduction du logiciel par l'utilisateur étant
donné sa spécificité de logiciel libre, qui peut le rendre complexe à
manipuler et qui le réserve donc à des développeurs et des professionnels
avertis possédant  des  connaissances  informatiques approfondies.  Les
utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
logiciel à leurs besoins dans des conditions permettant d'assurer la
sécurité de leurs systèmes et ou de leurs données et, plus généralement,
à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.

Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
pris connaissance de la licence [CeCILL|CeCILL-B|CeCILL-C], et que vous en avez accepté les
termes.
 */
/* global Chart, ecLCSrules */

var digIdnt = {};
var ecSrc = {};
var g6Src = {};
var gsSrc = {};
var tableErr = {};
var tableRes = {};
var idnId = "";
var idnNm = "";
var idnSt = "";
var comps = new Map();
var compsEc = new Map();
var chartSeul = {};
var allAttrs = [];
var allAttrsEc = [];
var ecusers = [];
var ecpersons = [];
var ecemps = [];
var lastSel = [];
var lastSelState = 0; //0 fait rien vide; 1 collecte vide ajoute; 2 utilise
/**
 * Affiche le contenu d'un onglet
 * @param {type} evt
 * @param {type} tabName
 * @returns {undefined}
 */
function openTab(evt, tabName) {
    // Declare all variables
    clearTablos();
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    var div = document.getElementById("tablo");
    div.innerHTML = '';
    $("#chartUn").hide();
    if(digIdnt.attrs !== undefined && evt.path[0].firstChild.data === "Profile"){
        var div = document.getElementById("infos");
        div.innerHTML = '';
        feedTable(digIdnt);
    }
    if(lastSelState === 0 && tabName === "CompareG6Ec"){
        $("#ecg6None").prop("checked", true);
    }else if(lastSelState === 0 && tabName === "CompareEcs"){
        $("#ececNone").prop("checked", true);
    }else if(lastSelState === 0 && tabName === "LifecycleRule"){
        $("#lcsNone").prop("checked", true);
    }else if(lastSelState === 0 && tabName === "Report"){
        $("#ecNone").prop("checked", true);
    }else if(lastSelState === 0 && tabName === "Multi"){
        $("#mulNone").prop("checked", true);
    }else if(lastSelState === 1 && tabName === "CompareG6Ec"){
        $("#ecg6GET").prop("checked", true);
    }else if(lastSelState === 1 && tabName === "LifecycleRule"){
        $("#lcsGET").prop("checked", true);
    }else if(lastSelState === 1 && tabName === "CompareEcs"){
        $("#ececGET").prop("checked", true);
    }else if(lastSelState === 1 && tabName === "Report"){
        $("#ecGET").prop("checked", true);
    }else if(lastSelState === 1 && tabName === "Multi"){
        $("#mulGET").prop("checked", true);
    }else if(lastSelState === 2 && tabName === "CompareG6Ec"){
        $("#ecg6USE").prop("checked", true);
    }else if(lastSelState === 2 && tabName === "CompareEcs"){
        $("#ececUSE").prop("checked", true);
    }else if(lastSelState === 2 && tabName === "Report"){
        $("#ecUSE").prop("checked", true);
    }else if(lastSelState === 2 && tabName === "Multi"){
        $("#mulGET").prop("checked", true);
    }else if(tabName === "CompareG6Ec"){
        $("#ecg6CMP").prop("checked", true);
    }else if(tabName === "CompareEcs"){
        $("#ececCMP").prop("checked", true);
    }else if(tabName === "Report"){
        $("#ecCMP").prop("checked", true);
    }else if(tabName === "Multi"){
        $("#mulCMP").prop("checked", true);
    }
}
/**
 * planque les boutons et récupères les cookies
 */
$(document).ready(function(){
    tableErr = document.createElement('table');
    var tr = document.createElement('tr');   
    var th1 = document.createElement('th');
    var txh1 = document.createTextNode("Error");
    th1.appendChild(txh1);
    tr.appendChild(th1);
    tableErr.appendChild(tr);
    //setSelectAttrsEc();
    var tabcontent = document.getElementsByClassName("tabcontent");
    tabcontent[0].style.display = "block";
    $("#lesAttrs2").hide();
    createPersons();
});
/**
 * Retourne le paramètre seulement de l'url
 * @param {type} href
 * @returns {unresolved}
 */
function getQueryString(href){
    var result = {};
    var qs = href.slice(1);
    var parts = qs.split("#");
    var prms = parts[1].split("&");
    if(prms.length > 1){
        for(var i = 0, len=prms.length; i<len; i++){
            var tokens = prms[i].split("=");
            result[tokens[0]] = tokens[1];
        }
    }else{
        var tokens = parts[1].split("=");
        result[tokens[0]] = tokens[1];
    }
    return result;
}

window.onhashchange = function( e ) {
    console.log( location.hash );
    if(location.hash !== ""){
        var prms = getQueryString(location.href);
        if(prms.pku !== undefined){
            getUserInfo(prms.pku);
        }
        if(prms.pkp !== undefined){
            getPersonInfo(prms.pkp);
        }
        if(prms.pke !== undefined){
            getEmploymentInfo(prms.pke);
        }
    }
};
if(!window.HashChangeEvent)(function(){
    var lastURL=document.URL;
    window.addEventListener("hashchange",function(event){
        Object.defineProperty(event,"oldURL",{enumerable:true,configurable:true,value:lastURL});
        Object.defineProperty(event,"newURL",{enumerable:true,configurable:true,value:document.URL});
        lastURL=document.URL;
    });
}());
