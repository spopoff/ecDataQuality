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
/* global ecpersons, tableRes, tooltip, Tooltips, lastSelState, lastSel, lastSelComp, comps, ecusers */

class ECperson{
    constructor(personId, personIdExternal, nativePreferredLang, preferredName,
		firstName, vide, lastName, countryOfBirth, displayName){
        this.personId = personId;
        this.personIdExternal = personIdExternal;
        this.nativePreferredLang = nativePreferredLang;
        this.preferredName = preferredName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.preferredName = preferredName;
		this.countryOfBirth = countryOfBirth;
		this.displayName = displayName;
        this.associatedUserIds = [];
		//associé à User par défaut
		this.verified = false;
		this.isManager = false;
    }
}
ECperson.prototype.getInfos = function(){
    return this.personId+" "+this.personIdExternal+" "+ this.countryOfBirth+
		" "+this.displayName;
};
var indxUid = [];

function headListPerson(){
    var table = document.createElement('table');
    var tr = document.createElement('tr');   
    var tha = document.createElement('th');
    var txha = document.createTextNode('personId');
    tha.appendChild(txha);
    tr.appendChild(tha);
    var thu = document.createElement('th');
    var txhu = document.createTextNode('personIdExternal / firstName lastName');
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
 * Ajoute une ligne par User dans le tableau
 * @param {htmlDom} tab 
 * @param {ECperson} unP
 * @returns {undefined}
 */
function printRowPerson(tab, unP){
    var tr = document.createElement('tr');   
    var tda = document.createElement('td');
    var txda = document.createTextNode(unP.personId);
    tda.appendChild(txda);
    tr.appendChild(tda);
    var tdu = document.createElement('td');
    var txdu = document.createTextNode(unP.personIdExternal+" "+unP.firstName
		+" "+unP.lastName);
    tdu.appendChild(txdu);
    tr.appendChild(tdu);
    var tdv = document.createElement('td');
	if(unP.associatedUserIds !== undefined){
		if(unP.associatedUserIds.length > 0){
			//attention pas toujours de User pour un personIdExternal
			unP.associatedUserIds.forEach(function(usr){
				if(indxUid.indexOf(usr) > -1){
					var x = document.createElement("A");
					x.text = " linked to User "+usr;
					x.id = usr;
					x.href = "#pku="+usr;
					tdv.appendChild(x);
				}
			});
		}
	}
	const empPid = indxEmp.find(emp => emp === unP.personId)
	if(empPid !== undefined){
		var xe = document.createElement("A");
		xe.text = " link to Employment ";
		xe.id = empPid;
		xe.href = "#pke="+empPid;
		tdv.appendChild(xe);
	}
	tr.appendChild(tdv);
	tab.appendChild(tr);
}
/**
 * Fait la liste des Users
 * @param {string} inp
 * @param {boolean} isReal
 * @returns {undefined}
 */
function getListPersons(inp, isReal){
    var tab = headListPerson();
    var nbP = 0;
    inp = inp.toLowerCase();
    ecpersons.forEach(function(unP){
		if(isReal && unP.verified){
			//Pas les Person avec User
		}else{
			if(inp !== ""){
				var inf = "";
				inf = unP.getInfos();
				inf = inf.toLowerCase();
				if(inf.includes(inp)){
					printRowPerson(tab, unP);
					nbP++;
				}
			}else{
				printRowPerson(tab, unP);
				nbP++;
			}
		}
    });
    setInfoTab(tableRes, "nb persons="+nbP);
    var div = document.getElementById("tablo");
    div.appendChild(tab);
    
}
/**
* fait une liste de Users
*/
function showListEcPerson(){
    var inu = document.getElementById("idnNmIdPer").value;
	var isU = document.getElementById("isUser").checked;
    if(inu === undefined) inu = "";
    clearTablos();
    getListPersons(inu, isU);
}	
/**
 * Fait le tableau d'un seul Person
 * @param {type} pkp
 * @returns {undefined}
 */
function getPersonInfo(pkp){
    clearTablos();
	var p = Number(pkp)
	var tab = undefined;
    ecpersons.forEach(function(unP){
		var p1 = Number(unP.personId);
		if(772 === p1){
			console.log("trouvé 772");
		}
        if(p === p1){
			tab = headListPerson();
            printRowPerson(tab, unP);
        }
    });
	if(tab === undefined){
		setInfoTab(tableErr, "Not found="+pkp);
	}else{
		activeOnglet("PersonEc")
		var div = document.getElementById("tablo");
		div.appendChild(tab);
	}
}
/**
* Fait le tableau d'un Person
* @param {string} pkm personIdExternal du manager
*/
function getPersonUserIdInfo(pkm){
    clearTablos();
	var tab = undefined;
    ecpersons.forEach(function(unP){
        if(pkm === unP.personIdExternal){
			tab = headListPerson();
            printRowPerson(tab, unP);
        }
    });
	if(tab === undefined){
		setInfoTab(tableErr, "Not found="+pkm);
	}else{
		activeOnglet("PersonEc")
		var div = document.getElementById("tablo");
		div.appendChild(tab);
	}
}

/**
 * Vérifie que les Users sont associés à une Person vérifié
 * Si pas le cas ce sont des comptes sans emplois
 * fait un index pour les emplois et les jobs
 * @returns {undefined}
 */
function createPersons(){
	var indxU = [];
	ecpersons.forEach(function(unP){
		indxU.push(unP.personId);
		indxMng.push(unP.personIdExternal);
	});
    ecusers.forEach(function(unU){
		indxUid.push(unU.userId);
		if(unU.personId === 5971){
			console.log("trouvé 5971");
		}
		if(indxU.indexOf(unU.personId) === -1){
			unU.isAccount = true;
		}else{
			//alors Person sans User
			const unP = ecpersons.find(per => per.personId === unU.personId)
			unP.verified = true;
		}
        
    });
	ecjobs.forEach(function(unJ){
		indxJob.push(unJ.userId);
		const mngUid = indxMng.find(mUid => mUid === unJ.managerId);
		if(mngUid !== undefined){
			unJ.hasManager = true;
			const unP = ecpersons.find(per => per.personIdExternal === mngUid);
			unP.isManager = true;
		}
		const unU = ecusers.find(usr => usr.userId === unJ.userId)
		if(unU !== undefined){
			unJ.hasUser = true;
		}
	});
	ecemps.forEach(function(unE){
		indxEmp.push(unE.personId);
		const jobUid = indxJob.find(job => job === unE.userId)
		if(jobUid !== undefined){
			unE.hasJob = true;
		}
		indxEmpUid.push(unE.userId);
	});
}
