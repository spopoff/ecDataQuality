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
    constructor(positionEntryDate, managerId, emplStatus, employeeClass,
		emplStatus, employmentType, division, location, company, jobTitle,
		event, eventReason, position, businessUnit, startDate, endDate){
		this.positionEntryDate = positionEntryDate;
		this.managerId = managerId;
		this.emplStatus = emplStatus;
		this.employeeClass = employeeClass;
		this.employmentType = employmentType;
		this.division = division;
		this.location = location;
		this.department = department;
		this.company = company;
		this.jobTitle = jobTitle;
		this.event = event;
		this.eventReason = eventReason;
		this.position = position;
		this.businessUnit = businessUnit;
		this.startDate = startDate;
		this.endDate = endDate;
    }
}
ECjob.prototype.getInfos = function(){
    return this.personIdExternal+" st="+ this.emplStatus+
		" ty="+this.employmentType+" mng="+this.managerId+" 1st="+this.firstDateWorkedString+
		" lst="+this.lastDateWorkedString+" cmp="+this.company;
};
function headListJob(){
    var table = document.createElement('table');
    var tr = document.createElement('tr');   
    var tha = document.createElement('th');
    var txha = document.createTextNode('personId');
    tha.appendChild(txha);
    tr.appendChild(tha);
    var thu = document.createElement('th');
    var txhu = document.createTextNode('personIdExternal / userId');
    thu.appendChild(txhu);
    tr.appendChild(thu);
    var thv = document.createElement('th');
    var txhv = document.createTextNode('infos (st=status, ty=Employment type, mng=Manager Id, 1st=1st date Worked, lst=last date worked, cmp=company');
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
    var tda = document.createElement('td');
    var txda = document.createTextNode(unE.personId);
    tda.appendChild(txda);
    tr.appendChild(tda);
    var tdu = document.createElement('td');
    var txdu = document.createTextNode(unE.personIdExternal+" / "+unE.userId);
    tdu.appendChild(txdu);
    tr.appendChild(tdu);
    var tdv = document.createElement('td');
	var txdv = document.createTextNode(unE.getInfos());
	tdv.appendChild(txdv);
	var x = document.createElement("A");
	x.text = " linked  to Person "+unE.personId;
	x.id = unE.personId;
	x.href = "#pkp="+unE.personId;
	tdv.appendChild(x);
    tr.appendChild(tdv);
    tab.appendChild(tr);
}
/**
 * Fait la liste des Users
 * @param {string} inj
 * @param {boolean} isReal
 * @returns {undefined}
 */
function getListJobs(inj){
    var tab = headListJob();
    var nbP = 0;
    ine = ine.toLowerCase();
    ecjobs.forEach(function(unJ){
		if(ine !== ""){
			var inf = "";
			inf = unJ.getInfos();
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
    setInfoTab(tableRes, "nb jobss="+nbP);
    var div = document.getElementById("tablo");
    div.appendChild(tab);
    
}
/**
* fait une liste dde Job
*/
function showListEcJob(){
    var inj = document.getElementById("idnNmIdJob").value;
    if(inj === undefined) inj = "";
    clearTablos();
    getListJobs(ine);
}	
/**
 * Fait le tableau d'un seul Job
 * @param {type} pkj
 * @returns {undefined}
 */
function getJobInfo(pkj){
    clearTablos();
	var p = Number(pke);
	var tab = undefined;
    ecemps.forEach(function(unE){
		var p1 = Number(unE.personId);
		if(6117 === p1){
			console.log("trouvé 6117");
		}
        if(p === p1){
			tab = headListEmployment();
            printRowEmployment(tab, unE);
        }
    });
	if(tab === undefined){
		setInfoTab(tableErr, "Not found="+pke);
	}else{
		activeOnglet("EmploymentEc")
		var div = document.getElementById("tablo");
		div.appendChild(tab);
	}
}
