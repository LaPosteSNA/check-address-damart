/* On check les pré-requis ! */
// @TODO : Ajouter check pour ==> jQuery, jQueryUI, Bootstrap, popper
if (typeof jQuery === 'undefined') {
    throw new Error('Le plugin "sercaForm" nécessite jQuery!');
}

(function($) {
    'use strict';
    var options;
    // var Clipboard;
    // Création du formulaire
    /*
     * JIRA ==> [SASNA-10+11+16]
     * @param $params Contient une structure avec les options utilisateurs
     * @return Le formulaire....
     */
    // Les urls sont déplacés dans $.fn.getSercaURL pour pouvoir utilisé les paramètres dans "options"

    var hlWordsMatch = "&hlDebut=<strong>&hlFin=</strong>"; // Tags de debut et de fin pour ce que trouve SERCA.
    var hlWordsNoFound = "&hlDebutRestruct=<p class='color_red'>&hlFinRestruct=</p>"; // Idem mais pour ce qu'il ne trouve pas.

    $.fn.setOptionTitle = function setOptionTitle(title) {
        var html = "";
        if (typeof title !== 'undefined' && title.length > 0) {
            html = '<h1>' + title + '</h1>';
        }
        return html;
    };

    /*
        -- Dictionnaire de données --
        address_row1 : ligne 1 d'adresse
        address_row2 : ligne 2 d'adresse
        address_row3 : ligne 3 d'adresse
        address_row4 : ligne 4 d'adresse
        address_row5 : ligne 5 d'adresse
        address_row6 : ligne 6 d'adresse
        address_row7 : ligne 7 d'adresse
        road_number : numéro de voie
        road_extension : extension du numéro de voie (bis, ter,...)
        road_name : nom de voie
        gender : civilité
        postal_code : code postal
        locality : localité (équivalent à libellé d'acheminement)
        last_name : nom de famille
        first_name : prenom
        geolocation : géolocalisation (format WGS84 longitude puis latitude) et type de geolocalisation
     */
    $.fn.retrieveAddressFromSerca = function retrieveAddressFromSerca(data, typeOfReturn, options) {

        var dataLimitedToNbDisplayedResults = data.reponse.adresse.slice(0, options.nbDisplayedResults);
        var addressResult;

        // todo address_row4, address_row3
        if (typeOfReturn == "address_row6") {

            addressResult = dataLimitedToNbDisplayedResults.map(function(item) {
                return {
                    value: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
                    highlightedResult: $.fn.getHighlightedResult(item.cea, typeOfReturn, item, options),
                    address_row1: "",
                    address_row2: "",
                    address_row3: "",
                    address_row4: "",
                    address_row5: item.ligne5.libelle !== "" ? item.ligne5.libelle : "",
                    address_row6: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
                    address_row7: "",
                    insee_code: item.ligne6.codeInsee,
                    libelle_acheminement: item.ligne6.libelleAcheminement
                };
            });
        }
        if (typeOfReturn == "address_row4") {

            addressResult = dataLimitedToNbDisplayedResults.map(function(item) {
                return {
                    value: item.ligne4.libelle,
                    highlightedResult: $.fn.getHighlightedResult(item.cea, typeOfReturn, item, options),
                    address_row1: "",
                    address_row2: "",
                    address_row3: "",
                    address_row4: item.ligne4.libelle,
                    address_row5: item.ligne5.libelle !== "" ? item.ligne5.libelle : "",
                    address_row6: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
                    address_row7: "",
                    numext: item.ligne4.numero + (item.ligne4.extLongue !== "" ? " " + item.ligne4.extLongue : ""),
                    justVoieaddress_row4: item.ligne4.libelleVoie
                };
            });
        }
        if (typeOfReturn == "address_row3") {

            addressResult = dataLimitedToNbDisplayedResults.map(function(item) {
                if (item.ligne3 !== undefined) {
                    return {
                        value: item.ligne3.libelle,
                        highlightedResult: $.fn.getHighlightedResult(item.cea, typeOfReturn, item, options),
                        address_row1: "",
                        address_row2: "",
                        address_row3: item.ligne3.libelle !== "" ? item.ligne3.libelle : "",
                        address_row4: item.ligne4.libelle,
                        address_row5: item.ligne5.libelle !== "" ? item.ligne5.libelle : "",
                        address_row6: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
                        address_row7: "",
                        insee_code: item.ligne3.codeInsee
                    };
                } else {
                    return {
                        value: "",
                        highlightedResult: '<li><div class="address-autocomplete-result-list address-autocomplete-result-list-style-' + options.autocompleteListStyle + '" + address-autocomplete-result-list-style-empty" id="9999">Aucune Proposition...</div></li>',
                        address_row1: "",
                        address_row2: "",
                        address_row3: "",
                        address_row4: "",
                        address_row5: "",
                        address_row6: "",
                        address_row7: "",
                        insee_code: "-1"
                    };
                }
            });
        }
        return addressResult;
    };

    $.fn.getSercaURL = function getSercaURL(searchedAddress, typeOfReturn, options) {
        // Les critères du filtre sont : code_insee, code_postal, libelle_acheminement, libelle_ligne_5, libelle_voie, numero_ext, et ligne3.
        var url = "";
        var distantServiceUrls = {
            address_row6: "/services/solr/fulltextProfic?chaineRecherche=%strSearch%&typeRecherche=commune&nbItems=" + options.nbDisplayedResults + "&optionMot=CommencePar&optionRecherche=AND_OR&idClient=%login%&passwdClient=%password%&typeResultat=json",
            address_row4_insee_code: "/services/solr/fulltextProfic?chaineRecherche=%strSearch%&nbItems=" + options.nbDisplayedResults + "&optionFiltre=code_insee=%strCodeInsee%&typeRecherche=voie;pdi&optionMot=CommencePar&optionRecherche=AND_OR&idClient=%login%&passwdClient=%password%&typeResultat=json",
            address_row4_acheminement_label: "/services/solr/fulltextProfic?chaineRecherche=%strSearch%&nbItems=" + options.nbDisplayedResults + "&optionFiltre=libelle_acheminement=%strLibAch%&typeRecherche=voie;pdi&optionMot=CommencePar&optionRecherche=AND_OR&idClient=%login%&passwdClient=%password%&typeResultat=json",
            // address_row3: "/services/solr/fulltextProfic?chaineRecherche=%strSearch%&nbItems="+options.nbDisplayedResults+"&optionFiltre=libelle_voie=%strlibVoie%&optionFiltre=numero_ext=%strNumExt%&typeRecherche=ligne3;voie;pdi&optionMot=CommencePar&optionRecherche=AND_OR&idClient=%login%&passwdClient=%password%&typeResultat=json"
            address_row3: "/services/solr/fulltextProfic?chaineRecherche=%strSearch%&nbItems=" + options.nbDisplayedResults + "&optionFiltre=libelle_voie=%strlibVoie%&optionFiltre=numero_ext=%strNumExt%&optionFiltre=libelle_acheminement=%strLibAch%&typeRecherche=ligne3&optionMot=CommencePar&optionRecherche=AND_OR&idClient=%login%&passwdClient=%password%&typeResultat=json"
        };
        if (typeOfReturn == "address_row6") {
            url = (options.corpsProxy || '') + options.distantDNS + distantServiceUrls.address_row6;
            url = url.replace("%strSearch%", searchedAddress);
        } else if (typeOfReturn == "address_row4_insee_code") {
            url = (options.corpsProxy || '') + options.distantDNS + distantServiceUrls.address_row4_insee_code;
            url = url.replace("%strSearch%", searchedAddress);
            url = url.replace("%strCodeInsee%", $("#address_row6").attr("insee_code"));
        } else if (typeOfReturn == "address_row4_acheminement_label") {
            url = (options.corpsProxy || '') + options.distantDNS + distantServiceUrls.address_row4_acheminement_label;
            url = url.replace("%strSearch%", searchedAddress);
            url = url.replace("%strLibAch%", $("#address_row6").attr("libelle_acheminement"));
        } else if (typeOfReturn == "address_row3") {
            url = (options.corpsProxy || '') + options.distantDNS + distantServiceUrls.address_row3;
            if (searchedAddress == "")
                searchedAddress = $("#address_row4").attr("numext") + " " + $("#address_row4").attr("voie");
            url = url.replace("%strSearch%", searchedAddress);
            url = url.replace("%strlibVoie%", $("#address_row4").attr("voie"));
            url = url.replace("%strNumExt%", $("#address_row4").attr("numext"));
            url = url.replace("%strLibAch%", $("#address_row6").attr("libelle_acheminement"));
        }
        // Partie commune
        url = url.replace("%login%", (options.login || ''));
        url = url.replace("%password%", (options.password || ''));
        // console.log(url);
        return url;
    };

    $.fn.getHighlightedResult = function getHighlightedResult(id, field, item, options) {

        var htmlHighlightedResult = '';
        htmlHighlightedResult = htmlHighlightedResult + '<li><div class="address-autocomplete-result-list address-autocomplete-result-list-style-' + options.autocompleteListStyle + '" id="' + id + '">';
        // Ligne ci-dessous n'est plus nécessaire. On utilise les params hl* en appelant SERCA
        // htmlHighlightedResult += address_row6_highlight.replace(/<em>/g, '<strong>').replace(/<\/em>/g, '</strong>');
        if (field == "address_row6") {
            htmlHighlightedResult += item.ligne6.highlight;
            if (item.ligne5.libelle !== "") {
                htmlHighlightedResult += '<br/><span class="text-muted">' + item.ligne5.libelle + "</span>";
            }
        }
        if (field == "address_row4") {
            htmlHighlightedResult += item.ligne4.highlight;
            if (item.ligne5.libelle !== "") {
                htmlHighlightedResult += '<br/><span class="text-muted">' + item.ligne5.libelle + "</span>";
                if (item.ligne4.numero === "")
                    htmlHighlightedResult += ', <span class="text-muted">' + item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement + "</span>";
            } else {
                if (item.ligne4.numero === "" && (item.ligne6.libelleAcheminement === "PARIS" || item.ligne6.libelleAcheminement === "LYON" || item.ligne6.libelleAcheminement === "MARSEILLE"))
                    htmlHighlightedResult += '<br/><span class="text-muted">' + item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement + "</span>";
            }
        }
        if (field == "address_row3") {
            // l'ancien highlight correspondait à la ligne 4 et pas à la ligne 3 --> TODO faire évoluer le highlight pour l'appliquer en local : le highlight de serca n'est pas glop
            htmlHighlightedResult += item.ligne3.libelle + '<br />' + '<span class="text-muted">' + (item.ligne4.numero + ' ' + item.ligne4.extLongue + ' ' + item.ligne4.libelleVoie).trim() + ', ' + item.ligne6.codePostal + ' ' + item.ligne6.libelleAcheminement + '</span>';
        }
        htmlHighlightedResult += '</div></li>';
        return htmlHighlightedResult;
    };

    $.fn.getHtmlForm = function getHtmlForm(options) {

        var html = '';
        var htmlCodeAddressRow1 = '';
        if ("bootstrap4" === options.ihmModelAndVersion) {
            html = '<form id="address-autocomplete-form" class="container" autocomplete="off">\n' +
                $.fn.setOptionTitle(options.title);
            var htmlCodeGender =
                '<div class="form-group row">\n' +
                '    <label id="address_row0_label" for="address_row1" class="col-md-5 col-form-label">Civilité :</label>\n' +
                '    <div class="btn-group colors col-md-7" data-toggle="buttons">\n' +
                '       <label class="btn btn-primary active gender_male">\n' +
                '       <input type="radio" class="form-control"  id="gender_male" name="options" value="M" autocomplete="off" checked> Monsieur\n' +
                '       </label>\n' +
                '       <label class="btn btn-primary gender_female">\n' +
                '       <input type="radio" class="form-control"  id="gender_female" name="options" value="MME" autocomplete="off"> Madame\n' +
                '       </label>\n' +
                '       </div>\n' +
                '</div>\n';

            htmlCodeGender =
                '<div class="form-group row">\n' +
                '    <label id="address_row0_label" class="col-md-5 col-form-label">Civilité :</label>\n' +
                '    <div class="col-md-7 form-check">\n' +
                '        <label class="form-check-label">\n' +
                '            <input class="form-check-input" type="radio" name="options" id="gender_male" value="M" autocomplete="off" checked> Monsieur\n' +
                '        </label>\n' +
                '        <label class="form-check-label">\n' +
                '            <input class="form-check-input" type="radio" name="options" id="gender_female" value="MME" autocomplete="off"> Madame\n' +
                '        </label>\n' +
                '    </div>\n' +
                '</div>\n';

            if (options.oneFieldAddressRow1) {
                htmlCodeAddressRow1 =
                    '<div class="form-group row">\n' +
                    '    <label id="address_row1_label" for="address_row1" class="col-md-5 col-form-label">Prénom Nom :</label>\n' +
                    '    <div class="col-md-7"><div class="input-group-btn">\n' +
                    '        <input type="input" tabindex="1" class="form-control" id="address_row1" maxlength="38" aria-describedby="Prénom Nom" placeholder="Ex: Jean Dupond" autocomplete="off">\n' +
                    '    </div></div>\n' +
                    '</div>\n';
            } else {
                var labelAddressRow1 = "";
                if (options.orderFieldAddressRow1 == "first_name;last_name")
                    labelAddressRow1 = '<label id="address_row1_firstname_label" for="address_row1_first_name" class=" col-form-label">Prénom</label>' +
                    ' - ' +
                    '<label id="address_row1_lastname_name_label" for="address_row1_last_name" class="col-form-label">Nom</label> :';

                else
                    labelAddressRow1 =
                    '<label id="address_row1_lastname_name_label" for="address_row1_last_name" class="col-form-label">Nom </label>' +
                    ' - ' +
                    '<label id="address_row1_firstname_label" for="address_row1_first_name" class="col-form-label">Prénom</label> :';

                htmlCodeAddressRow1 =
                    '<div class="form-group row">\n' +
                    '    <div class="col-md-5  col-form-label">' + labelAddressRow1 + '</div>\n' +
                    '    <div class="col-md-7" id="address_row1"><div class="input-group">\n';
                if (options.orderFieldAddressRow1 == "first_name;last_name") {
                    htmlCodeAddressRow1 = htmlCodeAddressRow1 + '        <input type="input" tabindex="1" class="form-control" xwidth="50%" id="address_row1_first_name" maxlength="38" aria-describedby="Prénom" placeholder="Ex: Albert" autocomplete="off">\n';
                    htmlCodeAddressRow1 = htmlCodeAddressRow1 + '        <input type="input" tabindex="2" class="form-control" xwidth="50%" id="address_row1_last_name" maxlength="38" aria-describedby="Nom" placeholder="Ex: Dupond" autocomplete="off">\n';
                } else {
                    htmlCodeAddressRow1 = htmlCodeAddressRow1 + '        <input type="input" tabindex="1" class="form-control" xwidth="50%" id="address_row1_last_name" maxlength="38" aria-describedby="Nom" placeholder="Ex: Dupond" autocomplete="off">\n';
                    htmlCodeAddressRow1 = htmlCodeAddressRow1 + '        <input type="input" tabindex="2" class="form-control" xwidth="50%" id="address_row1_first_name" maxlength="38" aria-describedby="Prénom" placeholder="Ex: Albert" autocomplete="off">\n';
                }
                htmlCodeAddressRow1 = htmlCodeAddressRow1 + '    </div></div>\n' +
                    '</div>\n';
            }
            var htmlCodeAddress =
                '<div class="form-group row">\n' +
                '    <label id="address_row6_label" for="address_row6" class="col-md-5 col-form-label">Code Postal - Localité * :</label>\n' +
                '    <div class="col-md-7">\n' +
                '        <input type="input" tabindex="2" class="form-control" id="address_row6" maxlength="38" aria-describedby="Code Postal - ville" placeholder="Ex : 33500 Libourne" autocomplete="off">\n' +
                '        <div id="address_row6Help" class="invalid-feedback"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group row">\n' +
                '    <label id="address_row5_label" for="address_row5" class="col-md-5 col-form-label">Lieu dit ou Ancienne Commune :</label>\n' +
                '    <div class="col-md-7">\n' +
                '        <input type="input" tabindex="3" class="form-control" id="address_row5" maxlength="38" aria-describedby="Lieu dit ou ancienne commune" placeholder="" autocomplete="off">\n' +
                '        <div id="address_row5Help" class="invalid-feedback"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group row has-feedback">\n' +
                '    <label id="address_row4_label" for="address_row4" class="col-md-5 col-form-label">Numéro et Nom de la voie * :</label>\n' +
                '    <div class="col-md-7">\n' +
                '        <input type="input" tabindex="4" class="form-control" id="address_row4" maxlength="38" aria-describedby="Numéro et nom de la voie" placeholder="Ex : 3 rue des lilas" autocomplete="off">\n' +
                '        <div id="address_row4Help" class="invalid-feedback"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group row has-feedback">\n' +
                '    <label id="address_row3_label" for="address_row3" class="col-md-5 col-form-label">Bâtiment, résidence :</label>\n' +
                '    <div class="col-md-7">\n' +
                '        <input type="input" tabindex="5" class="form-control" id="address_row3" maxlength="38" aria-describedby="Bâtiment, résidence" placeholder="Ex : Residence la verboise" autocomplete="off">\n' +
                '        <div id="address_row3Help" class="invalid-feedback"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group row has-feedback">\n' +
                '    <label id="address_row2_label" for="address_row2" class="col-md-5 col-form-label">Appartement, Escalier, Etage :</label>\n' +
                '    <div class="col-md-7">\n' +
                '        <input type="input" tabindex="6" class="form-control" id="address_row2" maxlength="38" aria-describedby="Appartement, Escalier, Etage" placeholder="Ex : Appartement 123" autocomplete="off">\n' +
                '        <div id="address_row2Help" class="invalid-feedback"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group row has-feedback">\n' +
                '    <div class="col-md-5"></div>\n' +
                '    <div class="col-md-7">\n' +
                '        <button class="btn btn-secondary" type="reset" id="btn_clear" title="Efface le contenu du formulaire.">Effacer</button>\n' +
                '        <button class="btn btn-primary" tabindex="7" type="button" title="Effectue une RNVP sur la l\'adresse saisie\net affiche des indicateurs en retour." id="btn_validate" role="checkRNVP">Valider</button>\n' +
                '        <button class="btn btn-primary" tabindex="8" type="button" id="btn_copy" role="WholeAdrClipboard" title="Copie l\'adresse dans le presse-papier." class="collapse">Copier l\'adresse complète</button>\n' +
                '    </div>\n' +

                '</div>\n' +
                '<div id="information">* Champs obligatoires</div>' +
                '</form>\n';

            // On concatène...
            html = html + htmlCodeGender + htmlCodeAddressRow1 + htmlCodeAddress; // jshint ignore:line

            if (options.displayAddressLabel) {
                html = html +
                    '<section class="height-100vh center-aligned">\n' +
                    '    <div class="wrapper">\n' +
                    '        <img class="background-image" src="images/envelop_result.png" width="600" height="326"/>\n' +
                    '        <div id="fullAddress" class="text"></div>\n' +
                    '    </div>\n' +
                    '</section>';
            }
        }
        // if (options.displayFinalAddress) {
        //     this.setupClipboard();
        // }
        return html;
    };

    $.fn.updateFinal = function(clearall) {
        // @TODO : Chaque champs dans une variable distincte pour utiliser l'ordre "custom" (ex:Coliposte)

        if (clearall !== undefined) {
            $("#fullAddress")[0].innerHTML = "";
            $(".wrapper").hide("slow");
            return "";
        }
        // Mise à jour de "l'enveloppe"
        var str = "";
        var str2 = "";
        var strcb = "";
        var array_fields = options.fullAddressCopyOrder.split(";");
        var arrays_final = {};
        var address = {};

        // if(options.oneFieldAddressRow1) {
        //     var address = {row1: "", row2: "", row3: "", row4: "", row5: "", row6: ""};
        // }else{
        //     var address = {row1: "", row2: "", row3: "", row4: "", row5: "", row6: ""};
        // }

        if (options.upperCaseFields) {
            $('form').find("input[type=input], input[type=password], textarea").each(function() {
                $(":input").each(function() {
                    this.value = this.value.toUpperCase();
                });
            });
        }
        if (options.oneFieldAddressRow1) {
            str += $('input:radio:checked').val() !== "" ? "<div>" + $('input:radio:checked').val() + " " + "" : "";
            strcb += $('input:radio:checked').val() !== "" ? $('input:radio:checked').val() + " " + "" : "";

            str += $("#address_row1").val() !== "" ? "" + $("#address_row1").val() + "</div>\n" : "";
            strcb += $("#address_row1").val() !== "" ? $("#address_row1").val() + "\n" : "";

            address["address_row1"] = str; // jshint ignore:line

            if ($("#address_row1").val() == "") {
                str = "";
                strcb = "";
                address["address_row1"] = ""; // jshint ignore:line
            }
        } else {
            str += $('input:radio:checked').val() !== "" ? "<div class='row'><div>" + $('input:radio:checked').val() + " </div> " + "" : "";
            strcb += $('input:radio:checked').val() !== "" ? $('input:radio:checked').val() + " " + "" : "";
            if (options.orderFieldAddressRow1 == "first_name;last_name") {
                str += $("#address_row1_first_name").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row1_first_name").val() + " </div>" : "";
                strcb += $("#address_row1_first_name").val() !== "" ? $("#address_row1_first_name").val() + " " : "";
                str += $("#address_row1_last_name").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row1_last_name").val() + " </div></div>\n" : "";
                strcb += $("#address_row1_last_name").val() !== "" ? $("#address_row1_last_name").val() + "\n" : "";
            } else {
                str += $("#address_row1_last_name").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row1_last_name").val() + " </div>" : "";
                strcb += $("#address_row1_last_name").val() !== "" ? $("#address_row1_last_name").val() + "\n" : "";
                str += $("#address_row1_first_name").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row1_first_name").val() + " </div></div>\n" : "";
                strcb += $("#address_row1_first_name").val() !== "" ? $("#address_row1_first_name").val() + " " : "";
            }
            address["address_row1"] = str; // jshint ignore:line

            if (($("#address_row1_first_name").val() == "") && ($("#address_row1_last_name").val() == "")) {
                str = "";
                strcb = "";
                address["address_row1"] = ""; // jshint ignore:line
            }
        }
        str2 += $("#address_row2").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row2").val() + "</div>\n" : "";
        strcb += $("#address_row2").val() !== "" ? $("#address_row2").val() + "\n" : "";
        address["address_row2"] = $("#address_row2").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row2").val() + "</div>\n" : ""; // jshint ignore:line

        str2 += $("#address_row3").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row3").val() + "</div>\n" : "";
        strcb += $("#address_row3").val() !== "" ? $("#address_row3").val() + "\n" : "";
        address["address_row3"] = $("#address_row3").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row3").val() + "</div>\n" : ""; // jshint ignore:line

        str2 += $("#address_row4").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row4").val() + "</div>\n" : "";
        strcb += $("#address_row4").val() !== "" ? $("#address_row4").val() + "\n" : "";
        address["address_row4"] = $("#address_row4").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row4").val() + "</div>\n" : ""; // jshint ignore:line

        str2 += $("#address_row5").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row5").val() + "</div>\n" : "";
        strcb += $("#address_row5").val() !== "" ? $("#address_row5").val() + "\n" : "";
        address["address_row5"] = $("#address_row5").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row5").val() + "</div>\n" : ""; // jshint ignore:line

        str2 += $("#address_row6").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row6").val() + "</div>" : "";
        strcb += $("#address_row6").val() !== "" ? $("#address_row6").val() + "\n" : "";
        address["address_row6"] = $("#address_row6").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row6").val() + "</div>" : ""; // jshint ignore:line

        if ($.trim(str2) != '') {

            // On met dans l'ordre demandé...
            $("#fullAddress")[0].innerHTML = "";
            array_fields.forEach(function(x) {
                if (address[x] !== undefined)
                    arrays_final[x] = address[x];
                $("#fullAddress")[0].innerHTML += arrays_final[x];
            });
            $(".wrapper").show("slow");
        }

        // Gestion du copier-coller par click (survol c'est pas autorisé!)
        // Clic sur une ligne d'adresse dans l'enveloppe
        $('div[id="fullAddress"] > div').click(
            function(e) {
                $.fn.copyToClipboard(e.target, false);
                $(e.target).addClass("copied");
            });

        // Clic sur le bouton "Copier l'adresse complète"
        $("#btn_copy").click(function() {
            $.fn.copyToClipboard($("#fullAddress"), true);
        });

        return strcb.toUpperCase();
    };
    // $("div[id='fullAddress'] > div").click(function(){
    //     $("#fullAddress > div > i").show(1500).hide(500);
    // });
    $.fn.getTypeAddressRow4 = function(commune) {
        // En attendant mieux on check si commune avec arrondissement en dur
        // cad: Parie, Lyon, Marseille
        var communes_arrondissements = ["PARIS", "LYON", "MARSEILLE"];
        var typeAddressRow4 = "";
        if (communes_arrondissements.indexOf(commune) !== -1) {
            typeAddressRow4 = "address_row4_acheminement_label";
        } else {
            typeAddressRow4 = "address_row4_insee_code";
        }
        return typeAddressRow4;
    };
    /* AjaxRetry */
    $.fn.AjaxRetry = function(params, callback) {
        // Nouvelle requête...si le serveur ne répond pas bien on a déjà des requêtes qui tournent
        // Ici on supprime les éventuelles 'settimeout' pour recommencer la recherche avec les nouveaux params.
        var timeOutId = window.setTimeout(function() {}, 0);
        while (timeOutId--) {
            window.clearTimeout(timeOutId); // will do nothing if no timeout with id is present
        }
        // <dev>Tableau de test des 'timeout' (en ms)
        // var timeOutArr = [1,10,50,100,1000];
        // var initimeOutArr = 0;
        // </dev>
        var initTimeOutCount = 0;
        var ajaxRequest = function() {
            $.ajax({
                url: params.urlWS,
                type: 'GET',
                datatype: 'json',
                tryCount: initTimeOutCount,
                retryLimit: options.maxRetries,
                timebeforeTA: options.maxRetriesTimeout,
                timeout: options.ajaxTimeout, // timeOutArr[initTimeOutCount], //
                beforeSend: function() {
                    $(params.object).addClass('ajax-loading');
                },
                success: function(data) {
                    var addressList = $.fn.retrieveAddressFromSerca(data, $(params.object)[0].id, options);
                    clearTimeout(timeOutId);
                    $(params.object).removeClass('ajax-loading');
                    $("#erreur_information").remove();
                    callback(addressList);
                },
                dataFilter: function(data) {
                    var datax = JSON.parse(data);

                    // Remove all address that don't match the street number when collecting data about address_row3.
                    if ($(params.object)[0].id == "address_row3" && params.numero_address_row4 !== "") {
                        for (var i = datax.reponse.adresse.length - 1; i >= 0; i--) {
                            if (datax.reponse.adresse[i].ligne4.numero !== params.numero_address_row4) {
                                datax.reponse.adresse.splice(i, 1);
                            }
                        }
                    }
                    if ($(params.object)[0].id == "address_row3") {
                        // Add empty element in array
                        var empty_adr_element = {

                        };
                        datax.reponse.adresse.unshift(empty_adr_element);
                    }
                    // debugger;
                    return JSON.stringify(datax);
                },
                error: function(xhr, status) //, errThrown)
                {
                    if (status == 'timeout') {
                        this.tryCount++;
                        initTimeOutCount++; //initimeOutArr++;
                        if (this.tryCount <= this.retryLimit) {
                            $("#erreur_information").remove();
                            // Augmentation du délai avec de retenter la requête
                            // Pas certain que ma formule soit la plus interressante.
                            var newTimeOutDelay = parseInt(this.timebeforeTA + ((this.tryCount * 10) / 100 * 10000));
                            // console.log(newTimeOutDelay);
                            $("#information").append("<div id='erreur_information'>Temps de réponse trop long. Nouvel éssai : " + this.tryCount + "/" + this.retryLimit + "</div>");

                            // timeOutId = setTimeout(ajaxRe/quest, parseInt(options.maxRetriesTimeout));
                            timeOutId = setTimeout(ajaxRequest, parseInt(newTimeOutDelay));
                        }
                        return;
                    }

                    if (xhr.status == 500) {
                        $("#erreur_information").remove();
                        $("#information").append("<div id='erreur'>Erreur du serveur! (err:" + xhr.statusText + "=>" + xhr.message + ")</div>");
                    } else {
                        $("#erreur_information").remove();
                        $("#information").append("<div id='erreur'>Le serveur n'est pas accessible! (err:" + xhr.statusText + "=>" + xhr.message + ")</div>");
                    }
                    $(params.object).removeClass('ajax-loading');
                }
            });
        };
        // Lance la première requête sans délai.
        ajaxRequest();
    };

    $.fn.copyToClipboard = function(element, full) {
        var $temp = $("<textarea>");
        $("body").append($temp);
        if (full) {
            $temp.val($.fn.updateFinal()).select();
        } else {
            $temp.val($(element).text()).select();
        }
        document.execCommand("copy");
        $temp.remove();
    };
    $.fn.toggleShow = function() {
        $('.wrapper').toggleClass('show');
    };
    $.fn.findWord = function(word) {
        var words = ['APPT', 'ESC'];
        var final_words = ['APPARTEMENT', 'ESCALIER'];
        var res = words.indexOf(word);
        if (res !== -1) {
            return final_words[res];
        }
        return "";
    };

    $.fn.checkExtend = function(field) {
        var str = field.val().toUpperCase();
        var new_str = "";
        var arrstr = str.split(" ");
        // console.log(arrstr.length);
        for (var i = 0; i < arrstr.length; i++) {
            // console.log(arrstr[i]);
            var rep = $.fn.findWord(arrstr[i]);
            if (rep !== "") {
                if ((new_str + rep).length <= 38)
                    new_str += rep + " ";
                else
                    // On depasse les 38 caractères on reste avec l'ancien mot
                    new_str += arrstr[i] + " ";
            } else {
                new_str += arrstr[i] + " ";
            }
            // console.log(new_str);
        }
        return new_str;
    };

    $.fn.inArray = function(target, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === target) {
                return true;
            }
        }
        return false;
    };

    /**
     * Initialise le plugin pour l'affichage dans une page html.
     * @param $params
     */
    $.fn.sercaForm = function($params) {

        this.each(function() {
            // Notre objet
            var $this = $(this);

            /**
             * JIRA ==> [SASNA-16]
             */
            // Des valeurs par défaut
            var defaults = {
                backColor: '', // couleur de fond du formulaire (par défaut couleur bootstrap)
                upperCaseFields: false, // Force ou pas l'affichage et la saisie en majuscule
                title: '', // titre du formulaire de saisie d'adresse
                autocompleteListStyle: '', // Permet d'ajouter une classe css spécifique à la liste des résultats retournés
                ihmModelAndVersion: 'bootstrap4', // Modele et version d'ihm à utiliser (bootstrap4, bootstrap3,...)
                login: 'ihm_services_adresses', // Login du service serca
                password: 'SAi0DFgoJf', // Mot de passe du service serca
                maxRetries: 3, // Nombre de tentative de rejeu en cas d'erreur du service distant
                maxRetriesTimeout: 3000, // Délai en ms avant de retenter un appel
                ajaxTimeout: 1000, // Délai avant de considérer que ça ne répond
                minDelayBeforeCall: 50, // Délai en millisecondes entre de frappes claiver avant d'appeler la recherche distante
                minLengthBeforeCall: 3, // Nombre de caractères minimal saisi avant recherche distante
                autocompletion: {
                    row3: false, // réalise une autocompletion en prenant en compte la ligne3 dans le référentiel d'adresses
                    row4_number: true, // réalise une autocompletion en prenant en compte le numéro dans la voie dans le référentiel  d'adresses
                    row4_road: true, // réalise une autocompletion en prenant en compte la voie dans le référentiel d'adresses
                    postal_code_locality: true, // réalise une autocompletion en prenant en compte le code postal localité dans le référentiel d'adresses
                    cedex_id: true // réalise une autocompletion en prenant en compte le cedex dans le référentiel d'adresses
                },
                continueOnError: true, // le formulaire peut-être validé même en cas d'erreur
                doRnvp: false,
                rnvp: {
                    row3: false, // réalise un rnvp en prenant en compte la ligne3
                    row4_number: true, // réalise un rnvp en prenant en compte le numéro dans la voie
                    row4_road: true, // réalise un rnvp en prenant en compte la voie
                    postal_code_locality: true, // réalise un rnvp en prenant en compte le code postal localité
                    cedex_id: true // réalise un rnvp en prenant en compte le cedex
                },
                nbDisplayedResults: 5, // Nombre de résultats affiché dans les propositions
                oneFieldAddressRow1: true, // Display one field for firstname/lastname or two separates fields
                orderFieldAddressRow1: "last-first",
                fullAddressCopyOrder: "address_row1;address_row2;address_row3;address_row4;address_row5;address_row6",
                language: 'fr', // Langage des messages d'erreur
                lockFormRow6: true, // Bloque la saisie des autres champs s le champ d'adresse 6 n'ets pas valide
                displayAddressLabel: false, // Affiche l'adresse complète validée en dessous du formulaire
                corpsProxy: "https://cors-proxy.seguret.org/", // Url du proxy cors
                distantDNS: "https://www.serca.preprod.laposte.fr", // Nom de domaine du service serca
            };

            /* @TODO Add user trigger... */
            /* @TODO Add user callback...*/
            /* @TODO Add user options... */
            // On check et on assigne les paramètres utilisateurs si il y en a...sinon ce sont les valeurs par defaut.
            options = $.extend(defaults, $params);
            // var plh = '';
            // On envoie le code html du formulaire...
            $this.append($.fn.getHtmlForm(options));
            // RNVP 
            if (options.doRnvp) {
                $("#btn_validate").show();
            } else {
                $("#btn_validate").hide();
            }

            // bouton Clipboard
            if (options.doFullClipboardCopy) {
                $("#btn_copy").show();
            } else {
                $("#btn_copy").hide();
            }

            // OPTIONS TOUT EN MAJUSCULES
            if (options.upperCaseFields) {
                $('form').find("input[type=input], input[type=password], textarea").each(function() {
                    // plh = $(this).attr("placeholder");
                    // $(this).attr("placeholder", plh.toUpperCase());
                    // $(this).addClass("uppercase");
                    $(this).css("text-transform", "uppercase");
                });
            }
            $.fn.lockForm = function() {
                $('form').find("input[type=input], input[type=password], textarea").each(function() {
                    if (!$.fn.inArray($(this)[0].id.toString(), ["address_row6", "address_row1_first_name", "address_row1_last_name", "address_row1"]))
                        $(this).prop('disabled', true).css('cursor', 'not-allowed');
                });
            };
            $.fn.unlockForm = function() {
                $('form').find("input[type=input], input[type=password], textarea").each(function() {
                    $(this).prop('disabled', false);
                    $(this).css('cursor', 'default');
                });
            };
            if (options.lockFormRow6) {
                // On verrouille tout sauf la ligne 6
                $.fn.lockForm();
            } else {
                $.fn.unlockForm();
            }

            // Pas de "style" dans le js donc...
            if (typeof options.backColor !== 'undefined' && options.backColor.length > 0) {
                $("#address-autocomplete-form").css("background-color", options.backColor);
            }

            $('#btn_clear').click(function() {
                // Nécessaire le form reset de base ne nettoie pas les radio boutons "à la bootstrap"
                $("#civ3").parent().removeClass('active');
                $("#gender_female").parent().removeClass('active');
                $("#gender_male").parent().addClass('active');
                $.fn.updateFinal(true);
                if (options.lockFormRow6) {
                    $.fn.lockForm();
                }
            });

            $('input[type=radio]').change(function() {
                $.fn.updateFinal();
            });
            if (options.oneFieldAddressRow1) {
                $("#address_row1").change(function() {
                    $.fn.updateFinal();
                });
            } else {
                $("#address_row1_first_name").change(function() {
                    $.fn.updateFinal();
                });
                $("#address_row1_last_name").change(function() {
                    $.fn.updateFinal();
                });
            }
            $("#address_row2").change(function() {
                // var retour = $.fn.checkExtend($("#address_row2"));
                // if (retour !== $("#address_row2").val()) {
                //     $("#address_row2").val(retour);
                // }
                $.fn.updateFinal();
            });
            $("#address_row3").change(function() {
                $.fn.updateFinal();
            });
            $("#address_row5").change(function() {
                $.fn.updateFinal();
            });
            // Rendu du menu et de ses items...
            $.widget("ui.autocomplete", $.ui.autocomplete, {
                _renderMenu: function(ul, items) {
                    var footer_menu_html = '<li class="ui-state-disabled footer-autocomplete" id="SNAFooter"><a class="ui-state-disabled" target="_blank" href="https://github.com/LaPosteSNA/serca-form"><img class="ui-state-disabled" src="images/powered-by-laposte-on-white.png" alt="Avec La Poste"/></a></li>';
                    var self = this;
                    if (undefined !== items) {
                        $.each(items, function(index, item) {
                            self._renderItemData(ul, item);
                            if (index + 1 === items.length) {
                                $(footer_menu_html).appendTo(ul).data("ui-autocomplete-item", item);
                            }
                        });
                    }
                },
                _renderItemData: function(ul, item) {
                    // console.log(item.highlightedResult);
                    $(item.highlightedResult).appendTo(ul).data("ui-autocomplete-item", item);
                }
            });

            // @NOTE : jQueryUI AutoComplete
            // - Si on sélectionne une proposition ou que l'on saisie manuellement une des propositions
            // ==> event : select
            // - Si on modifie ou saisie une ligne differente d'une des propositions et qu'on sélectionne une proposition
            // ==> event : select & change
            // - Si on saisie une adresse non proposée et que l'on clique en dehors de la liste des propositions
            // ==> event : change

            /**
             * LIGNE 6 (+5)
             * @param ul
             * @param item
             * @returns {*}
             * @private
             */
            $("#address_row6").autocomplete({
                minLength: options.minLengthBeforeCall,
                autoFocus: true,
                source: function(request, callback) {
                    var params = {
                        object: $('#address_row6'),
                        result: [],
                        urlWS: $.fn.getSercaURL($('#address_row6').val(), "address_row6", options) + hlWordsMatch + hlWordsNoFound
                    };
                    var addressList = $.fn.AjaxRetry(params, callback);
                    callback(addressList);
                },
                select: function(event, ui) {
                    $("#address_row6").val(ui.item.address_row6)
                        .attr("insee_code", ui.item.insee_code)
                        .attr("libelle_acheminement", ui.item.libelle_acheminement);
                    // $("#address_row6").attr("insee_code", ui.item.insee_code);
                    // $("#address_row6").attr("libelle_acheminement", ui.item.libelle_acheminement);
                    $("#address_row5").val(ui.item.address_row5);
                    if (options.displayAddressLabel) {
                        $.fn.updateFinal();
                        $.fn.unlockForm();
                    }
                    return false;
                },
                open: function() {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                },
                close: function() {
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            });

            /**
             * LIGNE 4
             * @param ul
             * @param item
             * @returns {*}
             * @private
             */
            $("#address_row4").autocomplete({
                minLength: options.minLengthBeforeCall,
                autoFocus: true,
                source: function(request, callback) {
                    // console.log("=======");
                    var params = {
                        object: $('#address_row4'),
                        result: [],
                        urlWS: $.fn.getSercaURL($('#address_row4').val(), $.fn.getTypeAddressRow4($("#address_row6").attr("libelle_acheminement")), options) + hlWordsMatch + hlWordsNoFound
                    };
                    var addressList = $.fn.AjaxRetry(params, callback);
                    callback(addressList);
                },
                select: function(event, ui) {
                    // console.log("> select");
                    $("#address_row4").attr("voie", ui.item.justVoieaddress_row4).attr("numext", ui.item.numext);
                    $("#address_row4").val($.trim(ui.item.numext + " " + ui.item.justVoieaddress_row4));
                    $("#address_row5").val(ui.item.address_row5);
                    $("#address_row6").val(ui.item.address_row6);
                    if (options.displayAddressLabel) {
                        $.fn.updateFinal();
                    }
                    $("#address_row3").autocomplete({
                        minLength: 0
                    }).focus().autocomplete("search", "");
                    event.preventDefault(); // On empêche le passage à row2 (ex:dans le cas de TAB)
                },
                open: function() {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                },
                close: function() {
                    // console.log("> close");
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                    if (options.displayAddressLabel) {
                        $.fn.updateFinal();
                    }
                },
                change: function() {

                    if (options.displayAddressLabel) {
                        $.fn.updateFinal();
                    }
                }
            });

            /**
             * LIGNE 3
             * @param ul
             * @param item
             * @returns {*}
             * @private
             */
            $("#address_row3").autocomplete({
                minLength: options.minLengthBeforeCall,
                autoFocus: true,
                source: function(request, callback) {
                    var params = {
                        object: $('#address_row3'),
                        numero_address_row4: $("#address_row4").attr("numext"),
                        result: [],
                        urlWS: $.fn.getSercaURL($('#address_row3').val(), "address_row3", options) + hlWordsMatch + hlWordsNoFound
                    };
                    var addressList = $.fn.AjaxRetry(params, callback);
                    callback(addressList);
                },
                select: function(event, ui) {
                    if (ui.item.insee_code !== "-1") {
                        $("#address_row3").val(ui.item.address_row3).attr("insee_code", ui.item.insee_code);
                        $("#address_row4").val(ui.item.address_row4);
                        $("#address_row5").val(ui.item.address_row5);
                        $("#address_row6").val(ui.item.address_row6);
                    } else {
                        $("#address_row3").val("");
                    }
                    if (options.displayAddressLabel) {
                        $.fn.updateFinal();
                    }
                    if (event.which === 13) {
                        $("#address_row2").focus();
                    }
                },
                open: function() {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                    if (options.displayAddressLabel) {
                        $.fn.updateFinal();
                    }
                },
                close: function() {
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                },
                change: function() {
                    if (options.displayAddressLabel) {
                        $.fn.updateFinal();
                    }
                }
            });
            return $this;
        });
    };
})(jQuery);