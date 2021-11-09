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
/* global ecjobs, tableRes, tooltip, Tooltips, lastSelState, lastSel, lastSelComp, comps, ecusers */
class ECjob{
    constructor(positionEntryDate, managerId, emplStatus, employeeStatus, emplClass, employeeClass,
		emplmType, employmentType, division, location, company, jobTitle,
		event, eventReason, position, businessUnit, startDate, endDate, userId){
		this.positionEntryDate = positionEntryDate;
		this.managerId = managerId;
		this.emplStatus = emplStatus;
		this.emplClass = emplClass;
		this.employeeClass = employeeClass;
		this.employmentType = employmentType;
		this.emplmType = emplmType;
		this.employeeStatus = employeeStatus;
		this.division = division;
		this.location = location;
		this.company = company;
		this.jobTitle = jobTitle;
		this.event = event;
		this.eventReason = eventReason;
		this.position = position;
		this.businessUnit = businessUnit;
		this.startDate = startDate;
		this.endDate = endDate;
		this.userId = userId;
		this.personIdExternal = userId;
		this.isMultiJob = false;
    }
}
ECjob.prototype.getInfos = function(){
    return "st="+ this.employeeStatus+" cls="+this.employeeClass+
		" ty="+this.employmentType+" mng="+this.managerId+" evtst="+this.startDate+
		" evtnd="+this.endDate+" evt="+this.event+" "+this.eventReason+" cmp="+this.company;
};
var indxMng = [];

function headListJob(){
    var table = document.createElement('table');
    var tr = document.createElement('tr');   
    var thu = document.createElement('th');
    var txhu = document.createTextNode('personIdExternal / userId');
    thu.appendChild(txhu);
    tr.appendChild(thu);
    var thv = document.createElement('th');
    var txhv = document.createTextNode('infos (st=status, cls= employee class, ty=Employment type, mng=Manager Id, evtst=event start, evtnd=event end, evt=event, cmp=company');
    thv.appendChild(txhv);
    tr.appendChild(thv);
    table.appendChild(tr);
    return table;
}
/**
 * Ajoute une ligne par Job dans le tableau
 * @param {htmlDom} tab 
 * @param {ECjob} unJ
 * @returns {undefined}
 */
function printRowJob(tab, unJ){
    var tr = document.createElement('tr');   
    var tdu = document.createElement('td');
    var txdu = document.createTextNode(unJ.personIdExternal+" / "+unJ.userId);
    tdu.appendChild(txdu);
    tr.appendChild(tdu);
    var tdv = document.createElement('td');
	var txdv = document.createTextNode(unJ.getInfos());
	tdv.appendChild(txdv);
	var x = document.createElement("A");
	x.text = " linked  to Person "+unJ.personIdExternal;
	x.id = unJ.personIdExternal;
	x.href = "#pkx="+unJ.personIdExternal;
	tdv.appendChild(x);
	//lien vers manager
	var xx = document.createElement("A");
	const mngUid = indxMng.find(mUid => mUid === unJ.managerId);
	if(mngUid !== undefined){
		xx.text = " linked  to Manager "+unJ.managerId;
		xx.id = unJ.managerId;
		xx.href = "#pkm="+unJ.managerId;
		tdv.appendChild(xx);
	}
    tr.appendChild(tdv);
    tab.appendChild(tr);
}
/**
 * Fait la liste des Jobs
 * @param {string} inj
 * @returns {undefined}
 */
function getListJobs(inj){
    var tab = headListJob();
    var nbP = 0;
    inj = inj.toLowerCase();
    ecjobs.forEach(function(unJ){
		if(inj !== ""){
			var inf = "";
			inf = unJ.userId+" "+unJ.getInfos();
			inf = inf.toLowerCase();
			if(inf.includes(inj)){
				printRowJob(tab, unJ);
				nbP++;
			}
		}else{
			printRowJob(tab, unJ);
			nbP++;
		}
    });
    setInfoTab(tableRes, "nb jobs="+nbP);
    var div = document.getElementById("tablo");
    div.appendChild(tab);
    
}
/**
* fait une liste de Job
*/
function showListEcJob(){
    var inj = document.getElementById("idnNmIdJob").value;
    if(inj === undefined) inj = "";
    clearTablos();
    getListJobs(inj);
}	
/**
 * Fait le tableau d'un seul Job
 * @param {type} pkj
 * @returns {undefined}
 */
function getJobInfo(pkj){
    clearTablos();
	var p = Number(pkj);
	var tab = undefined;
    ecjobs.forEach(function(unJ){
		var p1 = Number(unJ.personId);
		if(6117 === p1){
			console.log("trouvé 6117");
		}
        if(p === p1){
			tab = headListJob();
            printRowJob(tab, unJ);
        }
    });
	if(tab === undefined){
		setInfoTab(tableErr, "Not found="+pkj);
	}else{
		activeOnglet("JobEc")
		var div = document.getElementById("tablo");
		div.appendChild(tab);
	}
}
