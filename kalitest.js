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
/* global eckali, tableRes, tooltip, Tooltips, lastSelState, lastSel, lastSelComp, comps, ecusers */
class KalitestResult{
    constructor(qualState, dataObject, name, reasons){
		this.qualState = qualState;
		this.dataObject = dataObject;
		this.name = name;
		this.reasons = reasons;
    }
}
ECjob.prototype.getInfos = function(){
    return "st="+ this.employeeStatus+" cls="+this.employeeClass+
		" ty="+this.employmentType+" mng="+this.managerId+" evtst="+this.startDate+
		" evtnd="+this.endDate+" evt="+this.event+" "+this.eventReason+" cmp="+this.company;
};

function headListKali(){
    var table = document.createElement('table');
    var tr = document.createElement('tr');   
    var thu = document.createElement('th');
    var txhu = document.createTextNode('Data Quality Status');
    thu.appendChild(txhu);
    tr.appendChild(thu);
    var thv = document.createElement('th');
    var txhv = document.createTextNode('Datas tested');
    thv.appendChild(txhv);
    tr.appendChild(thv);
    table.appendChild(tr);
    return table;
}
function objectToString(obj){
	var sep = "";
	var ret = "";
	for (const key of Object.keys(obj)) {
	  const val = obj[key];
	  ret += sep+key+":"+val;
	  sep = ", ";
	}
	return ret;
}
function getLink(obj, td){
	const xe = document.createElement("A");
	var found = false;
	for (const key of Object.keys(obj)) {
		const val = obj[key];
		if(key === "personIdExternal"){
			found = true;
			xe.text = " link to Person ";
			xe.id = val;
			xe.href = "#pkm="+val;
		}else if(key === "userId"){
			found = true;
			xe.text = " link to User ";
			xe.id = val;
			xe.href = "#pku="+val;
			found = true;
		}
	}
	if(found){
		td.appendChild(xe);
	}
}
/**
 * Ajoute une ligne par Job dans le tableau
 * @param {htmlDom} tab 
 * @param {ECjob} unJ
 * @returns {undefined}
 */
function printRowKali(tab, unK){
    var tr = document.createElement('tr');   
    var tdu = document.createElement('td');
    var txdu = document.createTextNode(unK.qualState+" "+unK.reasons);
    tdu.appendChild(txdu);
    tr.appendChild(tdu);
    var tdv = document.createElement('td');
	var txdv = document.createTextNode(objectToString(unK.dataObject));
	tdv.appendChild(txdv);
	getLink(unK.dataObject, tdv);
    tr.appendChild(tdv);
    tab.appendChild(tr);
}
/**
 * Fait la liste des Jobs
 * @param {string} kaliName
 * @param {string} filter
 * @returns {undefined}
 */
function getKaliTest(kaliName, filter){
    var tab = headListKali();
    var nbK = 0;
	var sel = []
    eckali.forEach(function(unK){
		if(kaliName === unK.name && filter === "ALL"){
			sel.push(unK)
			nbK++;
		}else if(kaliName === unK.name && filter === unK.qualState){
			sel.push(unK)
			nbK++;
		}
    });
	sel = sel.sort((k1, k2) => (k1.qualState > k2.qualState) ? 1 : -1);
	sel.forEach(function(unK){
		printRowKali(tab, unK);
    });
    setInfoTab(tableRes, "nb case="+nbK);
    var div = document.getElementById("tablo");
    div.appendChild(tab);
    
}
/**
* Donne le rapport pour un test qualité
*/
function showKaliTest(){
    var choix = $("#kali :selected").val();
	var filter = $("#kaliState :selected").val();
    clearTablos();
    getKaliTest(choix, filter);
}	
