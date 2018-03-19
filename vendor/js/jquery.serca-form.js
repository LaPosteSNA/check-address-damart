/* On check les pré-requis ! */
// @TODO : Ajouter check pour ==> jQuery, jQueryUI, Bootstrap, popper
if (typeof jQuery === 'undefined') {
    throw new Error('Le plugin "sercaForm" nécessite jQuery!');
}
// if (typeof EasyAutocomplete === 'undefined') {
//     throw new Error('Le plugin "sercaForm" nécessite EasyAutoComplete!');
// }

(function($) {
    'use strict';
    // Création du formulaire
    /*
     * JIRA ==> [SASNA-10+11+16]
     * @param $params Contient une structure avec les options utilisateurs
     * @return Le formulaire....
     */
    $.fn.sercaForm = function($params) {
        // return this.each(function ()
        this.each(function() {
            // Notre objet
            var $this = $(this);
            var url_corpsproxy = "https://cors-proxy.seguret.org/";
            var url_serca = [];
            url_serca[1] = "";
            url_serca[2] = "";
            url_serca[3] = "";
            url_serca[4] = "https://www.serca.preprod.laposte.fr/services/solr/fulltextProfic?chaineRecherche=%strSearch%&typeRecherche=commune&optionMot=Contient&optionRecherche=AND_OR_RES&idClient=ihm_services_adresses&passwdClient=SAi0DFgoJf&typeResultat=json";
            url_serca[5] = "";
            url_serca[6] = "https://www.serca.preprod.laposte.fr/services/solr/fulltextProfic?chaineRecherche=%strSearch%&typeRecherche=commune&optionMot=Contient&optionRecherche=AND_OR_RES&idClient=ihm_services_adresses&passwdClient=SAi0DFgoJf&typeResultat=json";
            /**
             * JIRA ==> [SASNA-16]
             */
            // Des valeurs par défaut
            var defaults = {
                backColor: '#FFFFFF',
                formTitle: 'Saisie d\'adresse',
                login: '',
                password: '',
                maxRetries: 3,
                minDelayBeforeCall: 50,
                autocompletion: {
                    row3: true,
                    row4_number: true,
                    row4_road: true,
                    postal_code_locality: true,
                    cedex_id: true
                },
                minLengthBeforeCall: 3,
                continueOnError: true,
                rnvp: {
                    row3: false,
                    row4_number: true,
                    row4_road: true,
                    postal_code_locality: true,
                    cedex_id: true
                },
                nbDisplayedResults: 5,
                language: 'fr',
                lockFormRow6: true,
                displayFullAddressLabel: false
            };
            /* @TODO Add user trigger... */
            /* @TODO Add user callback...*/
            /* @TODO Add user options... */
            // On check et on assigne les paramètres utilisateurs si il y en a...sinon ce sont les valeurs par defaut.
            var options = $.extend(defaults, $params);

            // Mise en place du formulaire dans le tag passé en parametre
            $this.html('<div></div>');
            var div = $('div', $this);
            div.css('border', '1px solid silver');
            // div.css('display', 'inline-block');
            div.css('width', '500px');
            div.css('min-height', 'auto');
            div.css('margin', '0px');
            div.css('font-size', '10px !important');
            // margin-left:auto !important;margin-right:auto !important;vertical-align: middle !important;
            div.css('margin-left', 'auto');
            div.css('margin-right', 'auto');
            div.css('vertical-align', 'middle;');
            // div.css('display', 'flex');
            div.css('align-items', 'center');
            // @TODO : Renommer les champs en utilisant les noms dans la jira !!
            var html = '<form style="display:block;background-color: ' + options.backColor + ';margin-left:auto;margin-right:auto;" id="#frm_serca_api" class="form-inline align-content-sm-start">\n' +
                '<div style="display:inline-block; width:100%;"\n' +
                '     class="label label-danger label-as-badge badge-info">' + options.formTitle + '</div>' +
                '    <div class="form-group">\n' +
                '        <label for="address_row1" class="control-label col-sm-4">Civilité Prénom Nom</label>\n' +
                '        <input type="text" value=\'\' class="serca_form_input form-control col-sm-8" style="display:inline-block;" name="address_row1" id="address_row1" placeholder="Ex: M Jean Dupond">\n' +
                '    </div>\n' +
                '    <div class="form-group">\n' +
                '        <label for="address_row6" class="control-label col-sm-4">Code postal ou ville</label>\n' +
                '        <input type="text" value=\'\' class="serca_form_input form-control col-sm-8" style="display:inline-block;" name="address_row6" id="address_row6" placeholder="33500 Libourne">\n' +
                '    </div>\n' +
                '    <div class="form-group">\n' +
                '        <label for="address_row5" class="control-label col-sm-4">Lieu dit ou ancienne commune</label>\n' +
                '        <input type="text" value=\'\' class="serca_form_input form-control col-sm-8" style="display:inline-block;" name="address_row5" id="address_row5" placeholder="">\n' +
                '    </div>\n' +
                '    <div class="form-group">\n' +
                '        <label for="address_row4" class="control-label col-sm-4">Numéro et nom de la voie</label>\n' +
                '        <input type="text" value=\'\' class="serca_form_input form-control col-sm-8" style="display:inline-block;" name="address_row4" id="address_row4" placeholder="Ex : 3 rue des lilas">\n' +
                '    </div>\n' +
                '    <div class="form-group">\n' +
                '        <label for="address_row3" class="control-label col-sm-4">Appartement, escalier, étage</label>\n' +
                '        <input type="text" value=\'\' class="serca_form_input form-control col-sm-8" style="display:inline-block;" name="address_row3" id="address_row3" placeholder="Ex : Résidence la verboise">\n' +
                '    </div>\n' +
                '    <div class="form-group">\n' +
                '        <label for="address_row2" class="control-label col-sm-4">Bâtiment, résidence</label>\n' +
                '        <input type="text" value=\'\' class="serca_form_input form-control col-sm-8" style="display:inline-block;" name="address_row2" id="address_row2" placeholder="Ex : Appartement 123">\n' +
                '    </div>\n' +
                '<div class="form-group" style="margin-top: 10px;align-content: center">\n' +
                '<button id="bt_valid" type="button" class="btn btn-outline-primary col-sm-6">Valider</button>\n' +
                '<button id="br_reset" type="reset" class="btn btn-outline-secondary col-sm-6">Effacer</button>\n' +
                '</div>\n' +
                '</form><!--<div class="container"></div>-->';
            div.append(html);

            // div.css('height', div.css('height'));
            div.css('height', '50%');

            // debugger;
            // Set value of a field
            // div.find('#l1').val('Monsieur Philippe CLEC\'H');
            // Get value of a field
            // var usrinput = div.find('#l1').val();
            // console.log(usrinput);


            /* JIRA ==> [SASNA-18] */
            // Autocomplete using jQueryUI...
            // debugger;
            div.find("#address_row6").autocomplete({
                    source: function(request, response) {
                        $.ajax({
                            // Options...
                            url: url_corpsproxy + url_serca[6].replace("%strSearch%", div.find('#address_row6').val()),
                            dataType: "json",
                            minLength: options.minLengthBeforeCall,
                            // Events...
                            focus: function(event, ui) {

                                $(this).val(ui.item.label);
                                return false;
                            },
                            success: function(data) {
                                response($.map(data.reponse.adresse.slice(0, options.nbDisplayedResults), function(item) {
                                    return {
                                        label: item.ligne6.codePostal + " " + item.ligne6.libelleCommune,
                                        value: item.ligne6.codePostal + " " + item.ligne6.libelleCommune,
                                        hl: item.ligne6.highlight.replace(/<em>/g, '<span class="serca_highlight">').replace(/<\/em>/g, '</span>'),
                                        insee: item.ligne6.codeInsee,
                                        oldlabel: item.ligne5.libelle !== "" ? item.ligne5.libelle : ""
                                    };
                                }));
                            } //,
                            // error: function (jqXHR, textStatus, errorThrown) {
                            //     // console.log(jqXHR,);
                            // }
                        });
                    },
                    select: function(event, ui) {
                        // debugger;
                        $(this).val(ui.item.label);
                        $("#address_row5").val(ui.item.oldlabel);
                    },
                    open: function() {
                        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                    },
                    close: function() {
                        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                    }
                })
                .autocomplete("instance")._renderItem = function(ul, item) {
                    if (item.oldlabel === "") {
                        return $("<li ><div class='acstyle'>" + item.hl + "</div></li>").appendTo(ul);
                    } else {
                        return $("<li ><div class='acstyle'>" + item.hl + "<br><span class='serca_oldlabel'>" + item.oldlabel + "</span></div></li>").appendTo(ul);
                    }
                };

            return $this;
        });
    };

    /**
     * JIRA --> [SASNA-??]
     * Copie la chaine 'text' dans le presse-papier.
     * @param text
     * @returns {boolean}
     */
    // Commenté car par utilisé pour l'instant et génère une anomalie eslint
    // function copyToClipboard(text) {
    //     if (window.clipboardData && window.clipboardData.setData) {
    //         // Code pour IE pour éviter l'affichage du textarea pendant l'affichage du dialogue.
    //         return window.clipboardData.setData("Text", text);
    //     }
    //     else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    //         var textarea = document.createElement("textarea");
    //         textarea.textContent = text;
    //         // On évite de déroulement en bas de page dans MS Edge.
    //         textarea.style.position = "fixed";
    //         document.body.appendChild(textarea);
    //         textarea.select();
    //         try {
    //             return document.execCommand("copy");  // Security exception may be thrown by some browsers.
    //         }
    //         catch (ex) {
    //             // console.warn("Copy to clipboard failed.", ex);
    //             return false;
    //         }
    //         finally {
    //             document.body.removeChild(textarea);
    //         }
    //     }
    // }

    /**
     * JIRA ==> [SASNA-24]
     */
    // Commenté car par utilisé pour l'instant et génère une anomalie eslint
    // function addFooterMenu() {
    //     return $(".easy-autocomplete-container ul").append('<div class="footer-menu"><a href="http://www.laposte.fr/sna" target="_blank">LA POSTE - SNA<img src="images/logo-de-la-poste-seule-24.png" width="18px" height="16px"/></a>');
    // }
})(jQuery);