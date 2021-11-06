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
/* global ecusers, tableRes, tooltip, Tooltips, lastSelState, lastSel, lastSelComp, comps */

class ECuser{
    constructor(userId, emaill, custom01, custom11, custom05, status,
        jobCode, title, location, department, custom10, division,
        custom13, hireDate, defaultFullName){
        this.userId = userId;
        this.email = emaill;
        this.status = status;
        this.custom01 = custom01;
        this.custom11 = custom11;
        this.custom05 = custom05;
        this.jobCode = jobCode;
        this.title = title;
        this.location = location;
        this.department = department;
        this.custom10 = custom10;
        this.division = division;
        this.custom13 = custom13;
        this.hireDate = hireDate;
        this.defaultFullName = defaultFullName;
        this.hasJob = false;
        this.hasMmgr = false;
        this.hasPerson = false;
        this.personId = "";
        this.personIdExternal = "";
        this.managerId = "";
        this.associatedUserIds = [];
		this.isAccount = false;
    }
}
ECuser.prototype.getInfos = function(){
    var hd = "";
    if(this.hireDate !== undefined){
        hd = "; hd=" + this.hireDate;
    }
    var job = "";
    if(this.hasJob){
        job = "; has Job";
    }
    var mngr = "";
    if(this.hasMngr){
        mngr = "; has Manager";
    }
    return "status=" + this.status + "; costcnt=" + this.custom01 + "; site=" + this.custom05
          + "; pos=" + this.custom11 + "; jc=" + this.jobCode + "; tl=" + this.title
          + "; cls="+ this.custom10 + "; lc="+ this.location + "; dpt=" + this.department
          + "; div=" + this.division + "; bu=" + this.custom13
          + hd + job + mngr;
};
function headListUser(){
    var table = document.createElement('table');
    var tr = document.createElement('tr');   
    var tha = document.createElement('th');
    var txha = document.createTextNode('userId');
    tha.appendChild(txha);
    tr.appendChild(tha);
    var thu = document.createElement('th');
    var txhu = document.createTextNode('name / email');
    thu.appendChild(txhu);
    tr.appendChild(thu);
    var thv = document.createElement('th');
    var txhv = document.createTextNode('infos');
    thv.appendChild(txhv);
    tr.appendChild(thv);
    table.appendChild(tr);
    return table;
}
/**
 * Retrouve le nom d'un User depuis son userId
 * @param {string} userId
 * @returns {string}
 */
function getUserDefaultFullName(userId){
    var ret = "";
    ecusers.forEach(function(unU){
       if(userId === unU.userId){
           ret = unU.defaultFullName;
       } 
    });
    return ret;
}
/**
 * Ajoute une ligne par User dans le tableau
 * @param {htmlDom} tab 
 * @param {ECuser} unU
 * @returns {undefined}
 */
function printRowUser(tab, unU){
    var tr = document.createElement('tr');   
    var tda = document.createElement('td');
    var txda = document.createTextNode(unU.userId);
    tda.appendChild(txda);
    tr.appendChild(tda);
    var tdu = document.createElement('td');
    var txdu = document.createTextNode(unU.defaultFullName+" "+unU.email);
    tdu.appendChild(txdu);
    tr.appendChild(tdu);
    var tdv = document.createElement('td');
    var txdv = document.createTextNode(unU.getInfos());
    tdv.appendChild(txdv);
    if(unU.hasMngr && "NA" !== unU.managerId){
        var x = document.createElement("A");
        x.text = " "+getUserDefaultFullName(unU.managerId);
        x.id = unU.managerId;
        x.href = "#pku="+unU.managerId;
        tdv.appendChild(x);
    }
	var xx = document.createElement("A");
	if(!unU.isAccount){
		xx.text = " personId="+unU.personId;
		xx.id = unU.personId;
		xx.href = "#pkp="+unU.personId;
		tdv.appendChild(xx);
	}
    if(unU.associatedUserIds.length > 0){
        unU.associatedUserIds.forEach(function(usr){
            var xxx = document.createElement("A");
            xxx.text = " linked  to "+usr;
            xxx.id = usr;
            xxx.href = "#pku="+usr;
            tdv.appendChild(xxx);
        });
    }
    tr.appendChild(tdv);
    tab.appendChild(tr);
}
/**
 * Fait la liste des Users
 * @param {string} inu
 * @param {boolean} isP
 * @returns {undefined}
 */
function getListUsers(inu, isP){
    var tab = headListUser();
    var nbU = 0;
    inu = inu.toLowerCase();
    ecusers.forEach(function(unU){
		if(isP && unU.isAccount){
		}else{
			if(inu !== ""){
				var inf = "";
				inf = unU.getInfos();
				inf = inf.toLowerCase();
				if(inf.includes(inu) || unU.email.toLowerCase().includes(inu) ||
						unU.userId.toLowerCase().includes(inu)){
					printRowUser(tab, unU);
					nbU++;
				}
			}else{
				printRowUser(tab, unU);
				nbU++;
			}
		}
    });
    setInfoTab(tableRes, "nb users="+nbU);
    var div = document.getElementById("tablo");
    div.appendChild(tab);
    
}
/**
* fait une liste de Users
*/
function showListEcUser(){
    var inu = document.getElementById("idnNmIdUsr").value;
	var isP = document.getElementById("isPerson").checked;
    if(inu === undefined) inu = "";
    clearTablos();
    getListUsers(inu, isP);
}	
/**
 * Fait le tableau d'un seul User
 * @param {type} pku
 * @returns {undefined}
 */
function getUserInfo(pku){
    clearTablos();
    var tab = undefined;
    ecusers.forEach(function(unU){
        if(pku === unU.userId){
			tab = headListUser();
            printRowUser(tab, unU);
        }
    });
	if(tab === undefined){
		setInfoTab(tableErr, "Not found="+pke);
	}else{
		activeOnglet("UserEc")
		var div = document.getElementById("tablo");
		div.appendChild(tab);
	}
}
