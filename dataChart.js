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

/*
 * 
 * Gestion des graphiques
 */

/* global chartSeul, color, comps, difCases, ecLCSrules, grafSelState, lastSel, lastSelComp, compsEc */
window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
class DataChart{
    constructor(code, type, label){
        this.code = code;
        this.label = label;
        this.type = type;
        this.labels = [];
        this.datasets = [];
        this.subType = 0;
    }
    set addLabel(label){
        this.labels.push(label);
    }
    set addDataset(data7){
        this.datasets.push(data7);
    }
}
class DataSet{
    constructor(label){
        this.label = label;
        this.data = [];
    }
    set addData(data){
        this.data.push(data);
    }
}
class DatasChart{
    constructor(labels){
        this.labels = labels;
        this.datasets = [];
    }
}
class UnData7{
    constructor(label, data){
        this.label = label;
        this.backgroundColor = undefined;
        this.borderColor = undefined;
        this.borderWidth = 1;
        this.data = data;
	this.COLORS = [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
	];
        this.count = 0;
    }
}
UnData7.prototype.setColor = function(pos){
    if(pos < 6){
        this.backgroundColor = color(this.COLORS[pos]).alpha(0.5).rgbString();
        this.borderColor = this.COLORS[pos];
    }
};
/**
 * charge toutes les données statistiques et fabrique les graphiques
 * @param {string} code 
 * @param {string} label 
 * @returns {undefined}
 */
function loadGrafics(code, label){
    var grafic = new DataChart(code, parseInt(code.charAt(0)), label);
    grafic.subType = parseInt(code.split("_")[1]);
    renewGrafic(getBarChartData(grafic), grafic.label, grafic.type, "chartUn","container1");
    $("#chartUn").show();
}
/**
 * détruit (si existe) et refait graphique dans la bonne dimension
 * @param {data} barChartData 
 * @param {string} titre
 * @param {int} type 1 bar vertical, 2 bar horizontal
 * @param {string} ctxId 
 * @param {string] cntId
 * @returns {undefined}
 */
function renewGrafic(barChartData, titre, type, ctxId, cntId){
    try{
        chartSeul.destroy();
    }catch(ex){
        //meme pas mal
    }
    var typeG = '';
    if(type === 1){
        $('#'+cntId).css({width: '800px',height: '300px'});
        $('#Graphiques').css({height: '500px'});
        typeG = "bar";
    }else if(type === 2 || type === 3 || type === 5){
        $('#'+cntId).css({width: '800px',height: '800px'});
        typeG = "horizontalBar";
    }else if(type === 6){
        $('#'+cntId).css({width: '800px',height: '800px'});
        typeG = "scatter";
    }else if(type === 7){
        $('#'+cntId).css({width: '800px',height: '800px'});
        typeG = "radar";
    }
    chartSeul = new Chart(ctxId, {
        type: typeG,
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: titre
            }
        }
    });
    
    chartSeul.update(true);
}
/**
 * retourne l'objet données pour le graphique
 * @param {objGraficData} objGF
 * @returns {objChartData}
 */
function getBarChartData(objGF){
    var data = {};
	objGF = getData(objGF);
    if(objGF.type === 3){
        data = {
            labels: objGF.labels,
            datasets: [{
                label: objGF.datasets[0].label,
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: 1,
                data: objGF.datasets[0].data
            },{
                label: objGF.datasets[1].label,
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                borderWidth: 1,
                data: objGF.datasets[1].data
            }]
        };
    }else if(objGF.type === 5){
        data = {
            labels: objGF.labels,
            datasets: [{
                label: objGF.datasets[0].label,
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: 1,
                data: objGF.datasets[0].data
            },{
                label: objGF.datasets[1].label,
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                borderWidth: 1,
                data: objGF.datasets[1].data
            },{
                label: objGF.datasets[2].label,
                backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                borderColor: window.chartColors.green,
                borderWidth: 1,
                data: objGF.datasets[2].data
            },{
                label: objGF.datasets[3].label,
                backgroundColor: color(window.chartColors.purple).alpha(0.5).rgbString(),
                borderColor: window.chartColors.purple,
                borderWidth: 1,
                data: objGF.datasets[3].data
            }]
        };
        
    }else if(objGF.type === 6 || objGF.type === 7){
        var labels = [];
        if(objGF.type === 6){
            itms.forEach(function(itm){
                labels.push(itm.fullName);
            });
        }else{
            var lvls = getLevel14Lab(lbls[objGF.subType]);
            lvls.forEach(function(lvl){
                labels.push(lvl.name);
            });
        }
        data = new DatasChart(labels);
        var i = 0;
        objGF.datasets.forEach(function(d7){
            var unD7 = new UnData7(d7.label, d7.data);
            unD7.setColor(i);
            i++;
            if(i > 6) i = 0;
            data.datasets.push(unD7);
        });
    }else{
        data = {
            labels: objGF.labels,
            datasets: [{
                label: objGF.datasets[0].label,
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: 1,
                data: objGF.datasets[0].data
            }]
        };
    }
    return data;
}
function getJobStatsForAttr(attrName){
	var stats = new Map();
	ecjobs.forEach(function(unJ){
		if(unJ.hasManager){
			if(stats.has(unJ[attrName])){
				var count = stats.get(unJ[attrName]);
				count++;
				stats.set(unJ[attrName], count);
			}else{
				stats.set(unJ[attrName], 1);
			}
		}
		
	});
	return stats;
}
function getJobGrafForAttr(objGF, idsTitle, attrName){
	var stats = getJobStatsForAttr(attrName);
	var ids = new DataSet(idsTitle);
	for (let [key, value] of stats) {
		objGF.addLabel = key;
		ids.addData = value;
	}
	return ids;
}
function getData(objGF){
    switch(objGF.code){
        case "2_0":
            //Nb of User
            var ids = new DataSet("nb users");
            var nbU = 0;
			var nbUP = 0;
			ecusers.forEach(function(unU){
				if(!unU.isAccount){
					nbUP++;
				}else{
					nbU++;
				}
			});
            objGF.addLabel = "nb user with Person";
            ids.addData = nbUP;
            objGF.addLabel = "nb user without Person";
            ids.addData = nbU;
            objGF.addDataset = ids;
            break;
        case "2_1":
            //Nb person
            var ids = new DataSet("nb persons");
            var nbP = 0;
			var nbPU = 0;
			var nb0E = 0;
			var nbM = 0;
			var nbPUM = 0;
			ecpersons.forEach(function(unP){
				if(unP.verified){
					nbPU++;
				}else{
					nbP++;
				}
				const empPid = indxEmp.find(emp => emp === unP.personId)
				if(empPid === undefined){
					nb0E++;
				}
				if(unP.isManager){
					nbM++;
				}
				if(unP.isManager && unP.verified){
					nbPUM++;
				}
			});
            objGF.addLabel = "nb Person with User";
            ids.addData = nbPU;
            objGF.addLabel = "nb Person without User";
            ids.addData = nbP;
            objGF.addLabel = "nb Person without Employment";
            ids.addData = nb0E;
            objGF.addLabel = "nb Person is Manager";
            ids.addData = nbM;
            objGF.addLabel = "nb Person is Manager with User";
            ids.addData = nbPUM;
            objGF.addDataset = ids;
        break;
        case "2_2":
            //Nb Employment
            var ids = new DataSet("nb employment");
            var nbE = 0;
			var nbEJ = 0;
			ecemps.forEach(function(unE){
				if(unE.hasJob){
					nbEJ++;
				}else{
					nbE++;
				}
			});
            objGF.addLabel = "nb Employment with Job";
            ids.addData = nbEJ;
            objGF.addLabel = "nb Employment without Job";
            ids.addData = nbE;
            objGF.addDataset = ids;
        break;
        case "2_3":
            //Nb Job
            var ids = new DataSet("nb job");
            var nbJ = 0;
			var nbJM = 0;
			var nbE = 0;
			var nbU = 0;
			ecjobs.forEach(function(unJ){
				if(unJ.hasManager){
					nbJM++;
				}else{
					nbJ++;
				}
				const uidJ = indxEmpUid.find(uid => uid === unJ.userId)
				if(uidJ !== undefined){
					nbE++;
				}
				if(unJ.hasUser){
					nbU++;
				}
			});
            objGF.addLabel = "nb Job with Manager";
            ids.addData = nbJM;
            objGF.addLabel = "nb Job without Manager";
            ids.addData = nbJ;
            objGF.addLabel = "nb Job with Employment";
            ids.addData = nbE;
            objGF.addLabel = "nb Job with User";
            ids.addData = nbU;
            objGF.addDataset = ids;
        break;
        case "2_4":
            //Pertinent Job infos Employee Class
            objGF.addDataset = getJobGrafForAttr(objGF, "nb per employee class", "employeeClass");
		break;
		case "2_5":
            //Pertinent Job infos Employment Type
            objGF.addDataset = getJobGrafForAttr(objGF, "nb per employment type", "employmentType");
		break;
		case "2_6":
            //Pertinent Job infos Event
            objGF.addDataset = getJobGrafForAttr(objGF, "nb per event", "event");
		break;
		case "2_7":
            //Pertinent Job infos Status
            objGF.addDataset = getJobGrafForAttr(objGF, "nb per employee status", "employeeStatus");
		break;
		case "2_8":
            //Pertinent Job infos Company
            objGF.addDataset = getJobGrafForAttr(objGF, "nb per company", "company");
		break;
		case "2_9":
            //Pertinent Job infos Company
            objGF.addDataset = getJobGrafForAttr(objGF, "nb per business unit", "businessUnit");
		break;
        case "2_2x":
            //top ten attributes
            var attrs = new Map();
            for(let comp of comps.values()){
                comp.results.forEach(function(res){
                    if(attrs.has(res.attribut)){
                        var count = attrs.get(res.attribut);
                        count++;
                        attrs.set(res.attribut, count);
                    }else{
                        attrs.set(res.attribut, 1);
                    }
                });
            }
            attrs[Symbol.iterator] = function* () {
                yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
            };
            var ids = new DataSet("nb identities");
            for (let [key, value] of attrs) {
                objGF.addLabel = key;
                ids.addData = value;
            }
            objGF.addDataset = ids;
        break;
        case "2_3x":
            //Attributes with not match
            var attrs = new Map();
            for(let comp of comps.values()){
                comp.results.forEach(function(res){
                    comp.results.forEach(function(res){
                        if(res.case === 4 || res.case === 6 || res.case === 2){
                            if(attrs.has(res.attribut)){
                                var count = attrs.get(res.attribut);
                                count++;
                                attrs.set(res.attribut, count);
                            }else{
                                attrs.set(res.attribut, 1);
                            }
                        }
                    });
                });
            }
            var ids = new DataSet("nb occurence (identities * case[2 or 4 or 6])");
            for (let [key, value] of attrs) {
                objGF.addLabel = key;
                ids.addData = value;
            }
            objGF.addDataset = ids;
        break;
        case "2_4x":
            //EC LCS identities
            var stats = getStatsForAttr("lcsRuleName");
            var ids = new DataSet("nb identities");
            for (let [key, value] of stats) {
                objGF.addLabel = key;
                ids.addData = value;
            }
            objGF.addDataset = ids;
        break;
        case "2_5x":
            //le nb identités par compagnie
            var stats = getStatsForAttr("Company Name=Company");
            var ids = new DataSet("nb identities");
            for (let [key, value] of stats) {
                objGF.addLabel = key;
                ids.addData = value;
            }
            objGF.addDataset = ids;
        break;
        case "2_6x":
            //le nb identités par status
            var stats = getStatsForAttr("ZSTATUS=EmployeeStatus");
            var ids = new DataSet("nb identities");
            for (let [key, value] of stats) {
                objGF.addLabel = key;
                ids.addData = value;
            }
            objGF.addDataset = ids;
        break;
        case "2_7x":
            //le nb identités par class
            var stats = getStatsForAttr("ecEmpClass(E Group)=EmployeeClass");
            var ids = new DataSet("nb identities");
            for (let [key, value] of stats) {
                objGF.addLabel = key;
                ids.addData = value;
            }
            objGF.addDataset = ids;
        break;
        case "2_8x":
            //les identités pas en commun g6  EC idn
            var stats = getNotInCommon();
            var ids = new DataSet("nb identities");
            for (let [key, value] of stats) {
                objGF.addLabel = key;
                ids.addData = value;
            }
            objGF.addDataset = ids;
        break;
    }
    return objGF;
}
function getStatsForAttr(attrName){
    var stats = new Map();
    stats.set("Identities not common", 0);
    if(grafSelState === 0){
        //toute la collection
        for(let comp of comps.values()){
            comp.results.forEach(function(res){
                if(res.attribut === attrName){
                    var count = 0;
                    if(res.ec !== ""){
                        count = stats.get(res.ec);
                        if(count === undefined){
                            count = 1;
                        }else{
                            count++;
                        }
                        stats.set(res.ec, count);
                    }
                }
            });
        }
    }else{
        var sel = [];
        if(grafSelState === 2){
            sel = lastSel;
        }else{
            sel = lastSelComp;
        }
        sel.forEach(function(cpId){
            var comp = comps.get(cpId);
            if(comp !== undefined){
                comp.results.forEach(function(res){
                    if(res.attribut === attrName){
                        var count = 0;
                        if(res.ec !== ""){
                            count = stats.get(res.ec);
                            if(count === undefined){
                                count = 1;
                            }else{
                                count++;
                            }
                            stats.set(res.ec, count);
                        }
                    }
                });
            }else{
                var notFound = 0;
                notFound = stats.get("Identities not common");
                notFound++;
                stats.set("Identities not common", notFound);
            }
        });
    }
    stats[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };
    return stats;
}
function getNotInCommon(){
    var stats = new Map();
    stats.set("Identities not EC source", 0);
    var sel = [];
    if(grafSelState === 2){
        sel = lastSel;
    }else{
        sel = lastSelComp;
    }
    sel.forEach(function(cpId){
        var comp = comps.get(cpId);
        if(comp === undefined){
            var ecSrc = compsEc.get(cpId);
            if(ecSrc === undefined){
                var notFound = 0;
                notFound = stats.get("Identities not EC source");
                notFound++;
                stats.set("Identities not EC source", notFound);
            }else{
                stats.set(ecSrc.cpId+ " "+ecSrc.fullName, 1);
            }
        }
    });
    return stats;
}
/**
 * 
 * @param {Item} oItm
 * @param {Label} oLab
 * @returns {htmlDiv|Function}
 */
function getNoteLabelItem(oItm, oLab){
    const lblRoots = nots.filter(function(not){
        if(not.root === true && not.hiera === false && not.oidLbl === oLab.oid
                && not.oidItm === oItm.oid){
            return not;
        }
    });
    return lblRoots[0].note;
}

/**
 * fabrique le graphe sélectionné
 * @returns {htmlDiv}
 */
function showGraph(){
    var choix = $("#grafs :selected").val();
    var label = $("#grafs :selected").text();
    loadGrafics(choix, label);
}


