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

/* global comps, allAttrs, tableRes, compsEc, allAttrsEc, ecusers, lastSelState, lastSel, lastSelComp */
var difCases = [
    {case:1, name:"Both attribute are null", count:0},
    {case:2, name:"One of both is null", count:0},
    {case:3, name:"Both are empty", count:0},
    {case:4, name:"One of both is empty", count:0},
    {case:6, name:"Different", count:0},
    {case:7, name:"Case differencies", count:0},
    {case:8, name:"Both attributes equals", count:0},
    {case:9, name:"One of both is non available", count:0}
];
class CompareSource{
    constructor(cpId, fullName, personId, empNbr){
        this.cpId = cpId;
        this.fullName = fullName;
        this.personId = personId;
        this.empNbr = empNbr;
        this.results = [];
    }
}
//case:8,result:"equals",attribut:"siteCity",production:"GREEN RIVER",sandbox:"GREEN RIVER"})

function addToReportEc(table, nomId, res){
    if(nomId !== ""){
        var trn = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.colSpan = 4;
        td1.className = "centre";
        //var txd1 = document.createTextNode(nomId);
        td1.innerHTML = nomId;
        trn.appendChild(td1);
        table.appendChild(trn);
    }
    if(res === null){
        return;
    }
    var tr = document.createElement('tr');
    var tdc = document.createElement('td');
    var txdc = document.createTextNode(res.result);
    tdc.appendChild(txdc);
    tr.appendChild(tdc);
    var tda = document.createElement('td');
    var txda = document.createTextNode(res.attribut);
    tda.appendChild(txda);
    tr.appendChild(tda);
    var tds = document.createElement('td');
    var txds = document.createTextNode(res.idn);
    tds.appendChild(txds);
    tr.appendChild(tds);
    var tdp = document.createElement('td');
    var txdp = document.createTextNode(res.api);
    tdp.appendChild(txdp);
    tr.appendChild(tdp);
    table.appendChild(tr);
}
/**
 * Ajoute des attributs en plus du matching
 * @param {type} table
 * @param {Object} results
 * @param {String[]} attrs
 * @returns {undefined}
 */
function addAdditionalsEc(table, results, attrs){
    attrs.forEach(function(attr){
        var res = {};
        results.forEach(function(rez){
            if(rez.attribut === attr){
                res = rez;
            }
        });
        var tr = document.createElement('tr');
        var tdc = document.createElement('td');
        var txdc = document.createTextNode(res.result);
        tdc.appendChild(txdc);
        tr.appendChild(tdc);
        var tda = document.createElement('td');
        var txda = document.createTextNode(res.attribut);
        tda.appendChild(txda);
        tr.appendChild(tda);
        var tds = document.createElement('td');
        var txds = document.createTextNode(res.idn);
        tds.appendChild(txds);
        tr.appendChild(tds);
        var tdp = document.createElement('td');
        var txdp = document.createTextNode(res.api);
        tdp.appendChild(txdp);
        tr.appendChild(tdp);
        table.appendChild(tr);
    });
}
function addColumns(results, attrs){
    var lig = "";
    var sep = ";";
    if(attrs !== null){
        attrs.forEach(function(attr){
            var res = {};
            results.forEach(function(rez){
                if(rez.attribut === attr){
                    res = rez;
                }
            });
            lig += sep + res.source;
            lig += sep + res.idn;
        });
    }else{
        lig += sep + results.source;
        lig += sep + results.idn;
    }
    lig += "\n";
    return lig;
}

function headTabCompEc(nameCol3){
    var table = document.createElement('table');
    var tr = document.createElement('tr');   
    var thi = document.createElement('th');
    var txhi = document.createTextNode('case');
    thi.appendChild(txhi);
    tr.appendChild(thi);
    var tha = document.createElement('th');
    var txha = document.createTextNode('Attribute(s) same or ec idn=ec api or idn::idn');
    tha.appendChild(txha);
    tr.appendChild(tha);
    var ths = document.createElement('th');
    var txhs = document.createTextNode(nameCol3);
    ths.appendChild(txhs);
    tr.appendChild(ths);
    var thp = document.createElement('th');
    var txhp = document.createTextNode('Employee Central API');
    thp.appendChild(txhp);
    tr.appendChild(thp);
    table.appendChild(tr);
    return table;
}
function printCompareEc(comp, nomId, tab, addAttrs){
    addToReportEc(tab, nomId, null);
    addAdditionalsEc(tab, comp.results, addAttrs);
}

/**
 * le rapport avec le choix de différences
 * @param {String} nmId partial name search 
 * @param {int[]} tiipe
 * @param {String[]} attrs qui match la différence
 * @param {String[]} addAttrs attributs additionnel sans matching
 * @param {Boolean} withIdnt avec ou sans les identités associées
 * @param {Boolean} isFile vers un fichier si vrai
 * @param {String} nameCol3 nom 3ème colonne tableau 
 * @returns {undefined}
 */
function getTypedReportEc(tiipe, nmId, attrs, addAttrs, withIdnt, isFile, nameCol3){
    var tab = undefined;
    var text = "";
    if(!isFile){
        tab = headTabCompEc(nameCol3);
    }else{
        if(withIdnt){
            text = "cpId;fullName;personId;personNber;";
        }
        var sep = "";
        addAttrs.forEach(function(attr){
            var parts = attr.split("=");
            text += sep + parts[0]+";"+parts[1];
            sep = ";";
        });
        text += "\n";
    }
    var countId = 0;
    var mapCase = new Map();
    if(!withIdnt){
        nmId = ""; //prudence
    }
    var last = [];
    if(lastSelState === 2){
        last = lastSel;
    }else if(lastSelState === 3){
        last = lastSelComp;
    }
    if(lastSelState === 2 || lastSelState === 3){
        last.forEach(function(cpId){
            if(isNotInCmn){ //on cherche les pas commun
                var cmn = comps.get(cpId);
                var ec = compsEc.get(cpId);
                if(cmn === undefined && ec !== undefined){
                    var nomId = ec.cpId+" "+ec.fullName+" "+ec.personId;
                    if(ec.empNbr !== "unknown"){
                        nomId += " "+ec.empNbr;
                    }
                    printCompareEc(ec, nomId, tab, addAttrs);
                    countId++;
                }
            }else{
                if(cpId === "63034781"){
                    console.log("trouvé 63034781");
                }
                var comp = compsEc.get(cpId);
                if(comp !== undefined){
                    var nomId = comp.cpId+" "+comp.fullName+" "+comp.personId;
                    if(comp.empNbr !== "unknown"){
                        nomId += " "+comp.empNbr;
                    }
                    printCompareEc(comp, nomId, tab, addAttrs);
                    countId++;
                } else if(lastSelState === 2 && !isNotInCmn){
                    lastSelComp.push(cpId);
                }
            }
        });
        setInfoTab(tableRes, "nb identities="+countId);
        var div = document.getElementById("tablo");
        div.appendChild(tab);
        return;
    }
    var nbComp = 0;
    for(let comp of comps.values()){
        var nomId = comp.cpId+" "+comp.fullName+" "+comp.personId;
        if(comp.empNbr !== "unknown"){
            nomId += " "+comp.empNbr;
        }
        if(nomId.toLowerCase().includes(nmId.toLowerCase()) || nmId === ""){
            var once = true;
            var found = false;
            var ajoute = false;
            comp.results.forEach(function(res){
                for(var i = 0; i < tiipe.length; i++){
                    if(res.case === tiipe[i] && attrs.indexOf(res.attribut) > -1){
                        if(!withIdnt){
                            //on ajoute au map les résultats avec la clé unique somme
                            //des deux valeur d'attribut 
                            mapCase.set(res.idn+res.source, res);
                            ajoute = true;
                        }else{
                            if(once){
                                if(!isFile){
                                    addToReportEc(tab, nomId, res);
                                }else{
                                    if(withIdnt){
                                        text += comp.cpId+";"+comp.fullName+";"+comp.personId+";"+comp.empNbr;
                                    }
                                }
                                once = false;
                                countId++;
                                found = true;
                                ajoute = true;
                            }else{
                                if(!isFile){
                                    addToReportEc(tab, "", res);
                                }
                            }
                        }
                    }
                }
                if(found && withIdnt){
                    if(addAttrs[0] !== "All"){
                        if(!isFile){
                            addAdditionalsEc(tab, comp.results, addAttrs);
                        }else{
                            text += addColumns(comp.results, addAttrs);
                        }
                        found = false;
                    }
                }
            });
            if(ajoute && lastSelState === 1){
                lastSel.push(comp.cpId);
            }else if(lastSelState === 1){
                lastSelComp.push(comp.cpId);
            }
        }
        nbComp++;
    }
    if(!withIdnt){
        //on reprend le Map et on fait le tableau
        mapCase.forEach((value, key)=>{
            if(!isFile){
                addToReportEc(tab, "", value);
            }else{
                text += addColumns(value, null);
            }
        });
    }
    setInfoTab(tableRes, "nb identities="+countId);
    if(!isFile){
        var div = document.getElementById("tablo");
        div.appendChild(tab);
    }else{
        download("export.csv", text);
    }
}

function getReportTypeEc(choix, nmId, attrs, withIdnt, isFile, nameCol3){
    var addAttrs = $('#cmpAddAttr').val();
    if(addAttrs.length === 1 && addAttrs[0] === "All" && !isFile){
        addAttrs = allAttrsEc;
    }
    switch(choix){
        case "0":
            //tout
            getTypedReportEc([1,2,3,4,6,7,8,9], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "8":
            //equals
            getTypedReportEc([8], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "1":
            //both null"
            break;
        case "2":
            //one of both null
            getTypedReportEc([2], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "3":
            //both empty
            getTypedReportEc([3], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "4":
            //one of both empty
            getTypedReportEc([4], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "6":
            //non equal
            getTypedReportEc([6], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "7":
            //different case
            getTypedReportEc([7], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "9":
            //different case
            getTypedReportEc([9], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "78":
            //Quite equals"
            getTypedReportEc([7,8], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
        case "23469":
            //Can't match
            getTypedReportEc([2,4,6,9], nmId, attrs, addAttrs, withIdnt,
                isFile, nameCol3);
            break;
    }
    
}
function showReportEc(){
    var choix = $("#cmpRpt :selected").val();
    var inp = document.getElementById("idnNmId");
    var nmId = inp.value;
    clearTablos();
    var attrs = $('#cmpAttr').val();
    var withIdnt = true;
    if(document.getElementById('noIdnt').checked){
        //on fait une comparaison des valeurs mais sans les identités
        withIdnt = false;
    }
    if(attrs.length === 1 & attrs[0] === "All"){
        getReportTypeEc(choix, nmId, allAttrsEc, withIdnt, false, "EC IdN source");
    }else{
        getReportTypeEc(choix, nmId, attrs, withIdnt, false, "Ec IdN source");
    }
}
function getFileReportEc(){
    var choix = $("#cmpRpt :selected").val();
    var inp = document.getElementById("idnNmIdEc");
    var nmId = inp.value;
    var attrs = $('#cmpAttr').val();
    var withIdnt = true;
    if(document.getElementById('noIdnt').checked){
        //on fait une comparaison des valeurs mais sans les identités
        withIdnt = false;
    }
    if(lastSelState === 1 || lastSelState === 0){
        lastSel = [];
    }
    if(attrs.length === 1 & attrs[0] === "All"){
        alert("Only limited number of additional attributes");
    }else{
        getReportTypeEc(choix, nmId, attrs, withIdnt, true, "EC IdN source");
    }
}
