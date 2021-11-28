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

/* global comps, allAttrs, tableRes, apiLCSrules, lastSelState, lastSel */

function feedTableRules(table, lesLCSrules, isCode){
    lesLCSrules.forEach(function(rule){
        var tr = document.createElement('tr');
        var tdn = document.createElement('td');
        var txdn = document.createTextNode(rule.name);
        tdn.appendChild(txdn);
        tr.appendChild(tdn);
        var tdl = document.createElement('td');
        var txdl = document.createTextNode(rule.lifecycle);
        tdl.appendChild(txdl);
        tr.appendChild(tdl);
        var tdc = document.createElement('td');
        var classes = "";
        var sep = "";
        rule.classe.forEach(function(cl){
            classes += sep + cl;
            sep = ", ";
        });
        var txdc = document.createTextNode(classes);
        tdc.appendChild(txdc);
        tr.appendChild(tdc);

        var tds = document.createElement('td');
        var status = "";
        sep = "";
        rule.status.forEach(function(st){
            status += sep;
            if(isCode){
                status += st.code;
            }else{
                status += st.name;
            }
            sep = ", ";
        });
        var txds = document.createTextNode(status);
        tds.appendChild(txds);
        tr.appendChild(tds);
        
        var tde = document.createElement('td');
        var event = "";
        sep = "";
        rule.event.forEach(function(ev){
            event += sep;
            if(isCode){
                event += ev.code;
            }else{
                event += ev.name;
            }
            sep = ", ";
        });
        var txde = document.createTextNode(event);
        tde.appendChild(txde);
        tr.appendChild(tde);
        var tdg = document.createElement('td');
        var gd = "";
        if(rule.isAfter !== 0 && rule.isStart === 1){
            if(rule.isAfter === 1){
                gd = "in less than "+rule.gapDate+" days before "+rule.dateName;
            }else if(rule.isAfter === -1){
                gd = "more than "+rule.gapDate+" days before "+rule.dateName;
            }
        }else if(rule.isAfter !== 0 && rule.isStart === -1){
            if(rule.gapDate < 0){
                gd = "in less than "+rule.gapDate+" days before "+rule.dateName;
            }else if(rule.gapDate > 0){
                gd = "more than "+rule.gapDate+" days after "+rule.dateName;
            }
        }
        var txdg = document.createTextNode(gd);
        tdg.appendChild(txdg);
        tr.appendChild(tdg);
        var tdk = document.createElement('td');
        var txdk = document.createTextNode(rule.enabled);
        tdk.appendChild(txdk);
        tr.appendChild(tdk);
        table.appendChild(tr);
    });
}
/**
* Remplit le tableau des résultat pour tous avec le détail des jobs
*/
function feedTableRulesStatsIdnt(tab1, ecLCSrules, src){
    var stats = new Map();
    ecLCSrules.forEach(function(rule){
       stats.set(rule.name, {count:0, ids:[]}); 
    });
    stats.set("no rule", {count:0,ids:[]});
    var tot = 0;
	ecjobs.forEach(function(job){
		const ruleName = job.lcs.ruleName;
		if(ruleName !== undefined){
			var count = 0;
			var obj = stats.get(ruleName);
			if(obj !== undefined){
				count = obj.count;
				count++;
				obj.count = count;
				obj.ids.push(job.personIdExternal);
				stats.set(ruleName, obj);
				tot++;
				if(lastSelState === 1){
					lastSel.push(job.personIdExternal);
				}
			}
		}else{
			var obj = stats.get("no rule");
			count = obj.count;
			count++;
			obj.count = count;
			obj.ids.push(job.personIdExternal);
			stats.set("no rule", obj);
		}
	});
    ecLCSrules.forEach(function(rule){
        var obj = stats.get(rule.name);
        obj.ids.forEach(function(id){
            feedTableLCSstats(rule, id, tab1, true); 
        });
    });
    var no = stats.get("no rule");
    var roule = {};
    roule.name = "identities with no match";
    roule.lifecycle = "unknown";
    no.ids.forEach(function(id){
        feedTableLCSstats(roule, id, tab1, true);
    });
    setInfoTab(tableRes, "total identities="+tot);
    var div = document.getElementById("tablo");
    div.appendChild(tab1);
}
/**
 * Analyse les donnnées d'une sur la partie LCS et remplit un tableau
 * @param {type} tab1
 * @param {type} ecLCSrules
 * @param {type} src
 * @returns {undefined}
 */
function feedTableRulesStats(tab1, ecLCSrules, src){
    var stats = new Map();
    ecLCSrules.forEach(function(rule){
       stats.set(rule.name, 0); 
    });
    stats.set("no rule", 0);
    var tot = 0;
	ecjobs.forEach(function(job){
		const ruleName = job.lcs.ruleName;
		if(ruleName !== undefined){
			var count = 0;
			var obj = stats.get(ruleName);
			if(obj !== undefined){
				obj++;
				stats.set(ruleName, obj);
				tot++;
				if(lastSelState === 1){
					lastSel.push(job.personIdExternal);
				}
			}
		}else{
			var obj = stats.get("no rule");
			obj++;
			obj.count = count;
			stats.set("no rule", obj);
		}
	});
    ecLCSrules.forEach(function(rule){
        var val = stats.get(rule.name);
        feedTableLCSstats(rule, val, tab1, false); 
    });
    var val = stats.get("no rule");
    var roule = {};
    roule.name = "identities with no match";
    roule.lifecycle = "unknown";
    feedTableLCSstats(roule, val, tab1, false); 
    setInfoTab(tableRes, "total identities="+tot);
    var div = document.getElementById("tablo");
    div.appendChild(tab1);
}
/**
* Remplit le tableau de résultat pour une règle et un identifiant
*/
function feedTableLCSstats(rule, val, table, linked){
    var tr = document.createElement('tr');   
    var tda = document.createElement('td');
    var txda = document.createTextNode(rule.name);
    tda.appendChild(txda);
    tr.appendChild(tda);
    var tdp = document.createElement('td');
    var txdp = document.createTextNode(rule.lifecycle);
    tdp.appendChild(txdp);
    tr.appendChild(tdp);
    var tdc = document.createElement('td');
	//un lien ?
	if(!linked){
		var txdc = document.createTextNode(val);
		tdc.appendChild(txdc);
	}else{
		var xe = document.createElement("A");
		xe.text = val;
		xe.id = val;
		xe.href = "#pkj="+val;
		tdc.appendChild(xe);
	}
    tr.appendChild(tdc);
    table.appendChild(tr);
}

function headTabLCS(nom){
    var table = document.createElement('table');
    var trn = document.createElement('tr');   
    var thn = document.createElement('th');
    thn.colSpan = 7;
    thn.className = "centre";
    var txhn = document.createTextNode(nom);
    thn.appendChild(txhn);
    trn.appendChild(thn);
    table.appendChild(trn);
    var tr = document.createElement('tr');   
    var tha = document.createElement('th');
    var txha = document.createTextNode('name');
    tha.appendChild(txha);
    tr.appendChild(tha);
    var thp = document.createElement('th');
    var txhp = document.createTextNode('Lifecycle State');
    thp.appendChild(txhp);
    tr.appendChild(thp);
    var thc = document.createElement('th');
    var txhc = document.createTextNode('Employee Class');
    thc.appendChild(txhc);
    tr.appendChild(thc);
    var ths = document.createElement('th');
    var txhs = document.createTextNode('Employee Status');
    ths.appendChild(txhs);
    tr.appendChild(ths);
    var the = document.createElement('th');
    var txhe = document.createTextNode('Event');
    the.appendChild(txhe);
    tr.appendChild(the);
    var thg = document.createElement('th');
    var txhg = document.createTextNode('Date gap');
    thg.appendChild(txhg);
    tr.appendChild(thg);
    var thk = document.createElement('th');
    var txhk = document.createTextNode('Enable Accounts');
    thk.appendChild(txhk);
    tr.appendChild(thk);
    table.appendChild(tr);
    return table;
}
function headTabLCSstats(nom, troize){
    var table = document.createElement('table');
    var trn = document.createElement('tr');   
    var thn = document.createElement('th');
    thn.colSpan = 3;
    thn.className = "centre";
    var txhn = document.createTextNode(nom);
    thn.appendChild(txhn);
    trn.appendChild(thn);
    table.appendChild(trn);
    var tr = document.createElement('tr');   
    var tha = document.createElement('th');
    var txha = document.createTextNode('name');
    tha.appendChild(txha);
    tr.appendChild(tha);
    var thp = document.createElement('th');
    var txhp = document.createTextNode('Lifecycle State');
    thp.appendChild(txhp);
    tr.appendChild(thp);
    var thc = document.createElement('th');
    var txhc = document.createTextNode(troize);
    thc.appendChild(txhc);
    tr.appendChild(thc);
    table.appendChild(tr);
    return table;
}
/**
 * Fabrique le tableau des règles
 * @returns {undefined}
 */
function getLCS(){
    clearTablos();
    var tab1 = headTabLCS("API Lifecycle Rules");
    feedTableRules(tab1, apiLCSrules, true);
    
    var div = document.getElementById("tablo");
    div.appendChild(tab1);
}

function getStatLCS(){
    if(lastSelState === 1 || lastSelState === 0){
        lastSel = [];
    }
    clearTablos();
    var choix = $("#cmpLCS").val();
    if(!document.getElementById('noIdntLcs').checked){
		//détail
        var tab1 = headTabLCSstats("Lifecycle Rules statistics",
        "Person External Id");
        if(choix.length === 1 & choix[0] === "All"){
            feedTableRulesStatsIdnt(tab1, apiLCSrules, "ec");
        }else{
            var lesRules = [];
            choix.forEach(function(rule){
                apiLCSrules.forEach(function(r){
                    if(r.name === rule){
                        lesRules.push(r);
                    }
                });
            });
            feedTableRulesStatsIdnt(tab1, lesRules, "ec");
        }
    }else{
		//résumé
        var tab1 = headTabLCSstats("Lifecycle Rules statistics",
        "Nb Identities");
        if(choix.length === 1 & choix[0] === "All"){
            feedTableRulesStats(tab1, apiLCSrules, "ec");
        }else{
            var lesRules = [];
            choix.forEach(function(rule){
                apiLCSrules.forEach(function(r){
                    if(r.name === rule){
                        lesRules.push(r);
                    }
                });
            });
            feedTableRulesStats(tab1, lesRules, "ec");
        }
    }
}
