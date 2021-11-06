/*
Copyright Stéphane Georges Popoff, (juillet 2009 - novembre 2021)

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


/* global aps, fetch, tableRes, tableErr, PAT_NAME, l */

/**
 * nettoie les tableaux en cours
 * @return {undefined}
 */
function clearTablos(){
    tableRes = document.createElement('table');
    tableErr = document.createElement('table');
    var div = document.getElementById("tabloRes");
    div.innerHTML = '';
    div.appendChild(tableRes);
    div = document.getElementById("tabloErr");
    div.innerHTML = '';
    div.appendChild(tableErr);
    div = document.getElementById("tablo");
    div.innerHTML = '';
    try{
        setInfoP("");
    }catch(ex){}
}
/**
 * les tableaux d'erreur our d'information
 * @param {type} tab
 * @param {type} divName
 * @param {type} title
 * @return {undefined}
 */
function tableInfos(tab, divName, title){
    if(tab.childNodes.length === 0){
        var tr = document.createElement('tr');   
        var th1 = document.createElement('td');
        var txh1 = document.createTextNode(title);
        th1.appendChild(txh1);
        tr.appendChild(th1);
        tab.appendChild(tr);
    }
    var div = document.getElementById(divName);
    div.innerHTML = '';
    div.appendChild(tab);
    $(div).hide();
}
/**
 * Met à jour une ligne d'un tableau d'info ou d'erreur
 * @param {type} tab
 * @param {type} info
 * @return {undefined}
 */
function setInfoTab(tab, info){
    $(tab.parentNode).show();
    var tr = document.createElement('tr');   
    var th1 = document.createElement('td');
    var txh1 = document.createTextNode(info);
    th1.appendChild(txh1);
    tr.appendChild(th1);
    tab.appendChild(tr);
}
/**
 * fabrique un paragraphe invisible pour des infos
 * @returns {undefined}
 */
function newInfosP(){
    var div = document.getElementById("infos");
    var p = document.createElement('p');
    $(p).css("margin-top","8px");
    $(p).css("margin-bottom","2px");
    div.innerHTML = '';
    div.appendChild(p);
    $(div).hide();
}
/**
 * remplit un paragraphe d'un texte
 * @param {type} info
 * @returns {undefined}
 */
function setInfoP(info){
    var div = document.getElementById("infos");
    $(div).show();
    $(div.firstChild).text(info);
}
/**
 * provoque le téléchargement d'un texte
 * @param {type} filename
 * @param {type} text
 * @return {undefined}
 */
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
/**
 * transforme une fichier (texte avec retour chariot) dans un tableau
 * @param {type} strData
 * @param {type} strDelimiter
 * @return {Array|CSVToArray.arrData}
 */
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter !== strDelimiter)
            ){
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            /*var strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );
            */
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];

        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}
/**
 * interaction avec le checkbox force update appli
 * @param {type} chk
 * @return {undefined}
 */
function setButtons(chk){
    if(chk.checked && aps.length > 0){
        $("#updApp").show();
        $("#compAP").show();
        $("#intAP").hide();
    }else if(!chk.checked && aps.length > 0){
        $("#updApp").hide();
        $("#intAP").show();
    }
}
/**
 * Retourne les valeurs uniques d'un tableau
 * @param {type} arr
 * @returns {Array|unique.a}
 */
function unique(arr) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
}
function activeOnglet(nom){
	var evt = {}
	evt.currentTarget = {};
	evt.currentTarget.className = "tablinks";
	var but = document.getElementById("Id"+nom);
	but.className += " active";
	openTab(evt, nom);
	but.className += " active";
}