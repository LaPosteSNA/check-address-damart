(function($, QUnit) {

    "use strict";

    $.wait = function(ms) {
        var defer = $.Deferred();
        setTimeout(function() {
            defer.resolve();
        }, ms);
        return defer;
    };

    var $testCanvas = $("#serca-form");

    QUnit.module("jQuery serca-form", {
        beforeEach: function() {

            // initialise plugin
            $testCanvas.sercaForm({
                backColor: "#f7f7f9",
                autocompleteListStyle: "small",
                nbDisplayedResults: 5,
                fullAddressCopyOrder: "address_row1;address_row2;address_row3;address_row4;address_row5;address_row6",
                oneFieldAddressRow1: false,
                orderFieldAddressRow1: "first_name;last_name",
                displayAddressLabel: true,
                upperCaseFields: true,
                lockFormAddressRow6: true,
                maxRetries: 5,
                maxRetriesTimeout: 10000,
                ajaxTimeout: 3000
            });
        },
        afterEach: function() {

        }
    });

    QUnit.test("is inside jQuery library", function(assert) {

        assert.equal(typeof $.fn.sercaForm, "function", "has function inside jquery.fn");

    });

    // @claudio : J'ai désactivé cette partie, car c'est du code jQuery qui met la
    // couleur de fond (pas style dans le js)
    // QUnit.module("#setOptionBackColor");
    // QUnit.test("retourne un style quand une valeur est passée", function(assert) {
    //     assert.equal($.fn.setOptionBackColor('blue'), 'style="background-color:blue"');
    // });

    // QUnit.test("retourne vide quand aucune valeur est passée", function(assert) {
    //     assert.equal($.fn.setOptionBackColor(), '');
    // });


    QUnit.module("#setOptionTitle");
    QUnit.test("retourne un titre quand une valeur est passée", function(assert) {
        assert.equal($.fn.setOptionTitle('mon titre'), '<h1>mon titre</h1>');
    });

    QUnit.test("retourne vide quand aucune valeur est passée", function(assert) {
        assert.equal($.fn.setOptionTitle(), '');
    });



    QUnit.module("#getSercaURL");
    QUnit.test("retourne une url serca avec login pour address_row6 (option.login)", function(assert) {

        var options = {
            login: "mylogin"
        };

        // pre-test réalisé car Qunit n'a pas (contrairement à mocha) des fonctions avancées de recherhe de chaines
        var getSercaURLLogin = "";
        if ($.fn.getSercaURL('searchedAddress', 'address_row6', options).indexOf("idClient=" + options.login) > 0) {
            getSercaURLLogin = "le login est présent dans l'url";
        }
        assert.equal(getSercaURLLogin, "le login est présent dans l'url");

    });

    QUnit.test("retourne une url serca avec le password pour address_row6 (option.login)", function(assert) {

        var options = {
            password: "mypassword"
        };

        // pre-test réalisé car Qunit n'a pas (contrairement à mocha) des fonctions avancées de recherhe de chaines
        var getSercaURLPassword = "";
        if ($.fn.getSercaURL('searchedAddress', 'address_row6', options).indexOf("passwdClient=" + options.password) > 0) {
            getSercaURLPassword = "le password est présent dans l'url";
        }
        assert.equal(getSercaURLPassword, "le password est présent dans l'url");

    });

    QUnit.test("retourne une url serca avec un cors proxy pour address_row6 (option.corpsProxy)", function(assert) {
        var options = {
            corpsProxy: 'http://cors-proxy'
        };

        // pre-test réalisé car Qunit n'a pas (contrairement à mocha) des fonctions avancées de recherhe de chaines
        var getSercaURLCorpsProxy = "";
        if ($.fn.getSercaURL('searchedAddress', 'address_row6', options).indexOf(options.corpsProxy) === 0) {
            getSercaURLCorpsProxy = "le proxy cors est présent dans l'url";
        }
        assert.equal(getSercaURLCorpsProxy, "le proxy cors est présent dans l'url");
    });

    QUnit.test("retourne une url serca avec le champ de recherche pour address_row6", function(assert) {

        // pre-test réalisé car Qunit n'a pas (contrairement à mocha) des fonctions avancées de recherhe de chaines
        var getSercaURLSearchedAddress = "";
        var options = {};
        if ($.fn.getSercaURL('searchedAddress', 'address_row6', options).indexOf("chaineRecherche=searchedAddress") > 0) {
            getSercaURLSearchedAddress = "la chaine de recherche est présente dans l'url";
        }
        assert.equal(getSercaURLSearchedAddress, "la chaine de recherche est présente dans l'url");

    });

    QUnit.test("retourne une url serca avec le nom de domaine pour address_row6 (option.distantService)", function(assert) {

        // pre-test réalisé car Qunit n'a pas (contrairement à mocha) des fonctions avancées de recherhe de chaines
        var getSercaURL = "";
        var options = {
            distantDNS: "https://www.serca.laposte.fr"
        };
        if ($.fn.getSercaURL('searchedAddress', 'address_row6', options).indexOf(options.distantDNS) === 0) {
            getSercaURL = "le nom de domaine est présent dans l'url";
        }
        assert.equal(getSercaURL, "le nom de domaine est présent dans l'url");
    });

    QUnit.test("retourne une url serca valide pour address_row6", function(assert) {

        // pre-test réalisé car Qunit n'a pas (contrairement à mocha) des fonctions avancées de recherhe de chaines
        var getSercaURL = "";
        var options = {
            distantDNS: "https://www.serca.laposte.fr"
        };

        if ($.fn.getSercaURL('searchedAddress', 'address_row6', options).indexOf("https://www.serca.laposte.fr/services/solr/fulltextProfic?chaineRecherche=searchedAddress&typeRecherche=commune&nbItems=" + options.nbDisplayedResults + "&optionMot=CommencePar&optionRecherche=AND_OR&idClient=&passwdClient=&typeResultat=json") === 0) {
            getSercaURL = "l'url serca est valide";
        }
        assert.equal(getSercaURL, "l'url serca est valide");
    });



    //@TODO: - $.fn.retrieveAddressFromSerca - $.fn.getHighlightedResult - $.fn.getHtmlForm - $.fn.updateFinal
    QUnit.module("retourne le contenu des éléments de la liste de proposition.");

    var options = {
        distantDNS: "https://www.serca.laposte.fr",
        displayAddressLabel: true
    };

    QUnit.module(">>>> LIGNE 6");
    QUnit.test("retourne pour la ligne 6", function(assert) {
        options.displayAddressLabel = true;
        var data = ({
            reponse: {
                startIndex: "0",
                nbItems: "5",
                numFound: "4",
                qTime: "6",
                adresse: [{
                    type: "commune",
                    cea: "33207227Y6",
                    x: "434933.9732",
                    y: "6430162.9972",
                    longitudeWGS84: "-0.36001999480083896",
                    latitudeWGS84: "44.919900002460544",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "",
                        libelleVoie: "",
                        numero: "",
                        extCourte: "",
                        extLongue: "",
                        matricule: "",
                        motDirecteur: "",
                        descVoie: "",
                        typeVoie: "",
                        highlight: "",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 IZON",
                        libelleAcheminement: "IZON",
                        libelleCommune: "IZON",
                        codeCedex: "",
                        codeInsee: "33207",
                        codePostal: "33450",
                        idza: "15120",
                        highlight: "<strong>33450</strong> IZON"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }, {
                    type: "commune",
                    cea: "332932249Z",
                    x: "429388.8404",
                    y: "6426138.0885",
                    longitudeWGS84: "-0.42800999537875395",
                    latitudeWGS84: "44.88155000227275",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "",
                        libelleVoie: "",
                        numero: "",
                        extCourte: "",
                        extLongue: "",
                        matricule: "",
                        motDirecteur: "",
                        descVoie: "",
                        typeVoie: "",
                        highlight: "",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 MONTUSSAN",
                        libelleAcheminement: "MONTUSSAN",
                        libelleCommune: "MONTUSSAN",
                        codeCedex: "",
                        codeInsee: "33293",
                        codePostal: "33450",
                        idza: "15203",
                        highlight: "<strong>33450</strong> MONTUSSAN"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }, {
                    type: "commune",
                    cea: "3343322BB7",
                    x: "429481.1509",
                    y: "6430099.6171",
                    longitudeWGS84: "-0.42901999477116737",
                    latitudeWGS84: "44.91722000266618",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "",
                        libelleVoie: "",
                        numero: "",
                        extCourte: "",
                        extLongue: "",
                        matricule: "",
                        motDirecteur: "",
                        descVoie: "",
                        typeVoie: "",
                        highlight: "",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 ST LOUBES",
                        libelleAcheminement: "ST LOUBES",
                        libelleCommune: "ST LOUBES",
                        codeCedex: "",
                        codeInsee: "33433",
                        codePostal: "33450",
                        idza: "15335",
                        highlight: "<strong>33450</strong> ST LOUBES"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }, {
                    type: "commune",
                    cea: "33483226Z3",
                    x: "432139.2709",
                    y: "6429552.2288",
                    longitudeWGS84: "-0.3950699951343733",
                    latitudeWGS84: "44.91333000209921",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "",
                        libelleVoie: "",
                        numero: "",
                        extCourte: "",
                        extLongue: "",
                        matricule: "",
                        motDirecteur: "",
                        descVoie: "",
                        typeVoie: "",
                        highlight: "",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 ST SULPICE ET CAMEYRAC",
                        libelleAcheminement: "ST SULPICE ET CAMEYRAC",
                        libelleCommune: "ST SULPICE ET CAMEYRAC",
                        codeCedex: "",
                        codeInsee: "33483",
                        codePostal: "33450",
                        idza: "15383",
                        highlight: "<strong>33450</strong> ST SULPICE ET CAMEYRAC"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }]
            }
        });
        var addressList = $.fn.retrieveAddressFromSerca(data, "address_row6", options);
        // console.log(QUnit.dump.parse(addressList));
        assert.equal(addressList[1].address_row6, "33450 MONTUSSAN");
    });


    QUnit.module(">>>> LIGNE 4");
    QUnit.test("retourne pour la ligne 4", function(assert) {
        options.displayAddressLabel = true;
        var data = ({
            reponse: {
                startIndex: "0",
                nbItems: "5",
                numFound: "26",
                qTime: "22",
                adresse: [{
                    type: "pdi",
                    cea: "33293222HR",
                    x: "429940.3",
                    y: "6425977.3",
                    longitudeWGS84: "-0.4209448529350055",
                    latitudeWGS84: "44.880318973668594",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "19 ALLEE DES OISEAUX",
                        libelleVoie: "ALLEE DES OISEAUX",
                        numero: "19",
                        extCourte: "",
                        extLongue: "",
                        matricule: "00602636",
                        motDirecteur: "OISEAUX",
                        descVoie: "VAN",
                        typeVoie: "ALL",
                        highlight: "<strong>19</strong>  ALLEE DES OISEAUX",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 MONTUSSAN",
                        libelleAcheminement: "MONTUSSAN",
                        libelleCommune: "MONTUSSAN",
                        codeCedex: "",
                        codeInsee: "33293",
                        codePostal: "33450",
                        idza: "15203",
                        highlight: "33450 MONTUSSAN"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }, {
                    type: "pdi",
                    cea: "332932233G",
                    x: "429409.3",
                    y: "6425074.1",
                    longitudeWGS84: "-0.427166523719748",
                    latitudeWGS84: "44.87198748841552",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "19 ROUTE DE SAMPAU",
                        libelleVoie: "ROUTE DE SAMPAU",
                        numero: "19",
                        extCourte: "",
                        extLongue: "",
                        matricule: "00602671",
                        motDirecteur: "SAMPAU",
                        descVoie: "VAN",
                        typeVoie: "RTE",
                        highlight: "<strong>19</strong>  ROUTE DE SAMPAU",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 MONTUSSAN",
                        libelleAcheminement: "MONTUSSAN",
                        libelleCommune: "MONTUSSAN",
                        codeCedex: "",
                        codeInsee: "33293",
                        codePostal: "33450",
                        idza: "15203",
                        highlight: "33450 MONTUSSAN"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }, {
                    type: "pdi",
                    cea: "3329322344",
                    x: "430616.4",
                    y: "6425572.5",
                    longitudeWGS84: "-0.4121696738086286",
                    latitudeWGS84: "44.87694109987135",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "19 ROUTE DE TAILLEFER",
                        libelleVoie: "ROUTE DE TAILLEFER",
                        numero: "19",
                        extCourte: "",
                        extLongue: "",
                        matricule: "00602673",
                        motDirecteur: "TAILLEFER",
                        descVoie: "VAN",
                        typeVoie: "RTE",
                        highlight: "<strong>19</strong>  ROUTE DE TAILLEFER",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 MONTUSSAN",
                        libelleAcheminement: "MONTUSSAN",
                        libelleCommune: "MONTUSSAN",
                        codeCedex: "",
                        codeInsee: "33293",
                        codePostal: "33450",
                        idza: "15203",
                        highlight: "33450 MONTUSSAN"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }, {
                    type: "pdi",
                    cea: "33293223BH",
                    x: "430203.6",
                    y: "6426118.6",
                    longitudeWGS84: "-0.4176911244561639",
                    latitudeWGS84: "44.88169258776165",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "19 ROUTE D ORTON",
                        libelleVoie: "ROUTE D ORTON",
                        numero: "19",
                        extCourte: "",
                        extLongue: "",
                        matricule: "00602679",
                        motDirecteur: "ORTON",
                        descVoie: "VAN",
                        typeVoie: "RTE",
                        highlight: "<strong>19</strong>  ROUTE D ORTON",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 MONTUSSAN",
                        libelleAcheminement: "MONTUSSAN",
                        libelleCommune: "MONTUSSAN",
                        codeCedex: "",
                        codeInsee: "33293",
                        codePostal: "33450",
                        idza: "15203",
                        highlight: "33450 MONTUSSAN"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }, {
                    type: "pdi",
                    cea: "33293223E2",
                    x: "429697.2",
                    y: "6426114.1",
                    longitudeWGS84: "-0.42409552978045495",
                    latitudeWGS84: "44.88145464784617",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne4: {
                        libelle: "19 ROUTE DU BOURDIEU",
                        libelleVoie: "ROUTE DU BOURDIEU",
                        numero: "19",
                        extCourte: "",
                        extLongue: "",
                        matricule: "00602685",
                        motDirecteur: "BOURDIEU",
                        descVoie: "VAN",
                        typeVoie: "RTE",
                        highlight: "<strong>19</strong>  ROUTE DU BOURDIEU",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 MONTUSSAN",
                        libelleAcheminement: "MONTUSSAN",
                        libelleCommune: "MONTUSSAN",
                        codeCedex: "",
                        codeInsee: "33293",
                        codePostal: "33450",
                        idza: "15203",
                        highlight: "33450 MONTUSSAN"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }]
            }
        });
        var addressList = $.fn.retrieveAddressFromSerca(data, "address_row4", options);
        // console.log(QUnit.dump.parse(addressList));
        assert.equal(addressList[3].address_row4, "19 ROUTE D ORTON");
    });

    QUnit.module(">>>> LIGNE 3");
    QUnit.test("retourne pour la ligne 3", function(assert) {
        options.displayAddressLabel = true;
        var data = ({
            reponse: {
                startIndex: "0",
                nbItems: "5",
                numFound: "1",
                qTime: "143",
                adresse: [{
                    type: "ligne3",
                    cea: "332932243T",
                    x: "430203.6",
                    y: "6426118.6",
                    longitudeWGS84: "-0.4176911244561639",
                    latitudeWGS84: "44.88169258776165",
                    typeProjection: "1",
                    libelleProjection: "LAMBERT 93",
                    ligneNonTrouvee: "",
                    ligneNonTrouveeHl: "",
                    ligne1: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne2: {
                        libelle: "",
                        restructuree: "",
                        highlight: ""
                    },
                    ligne3: {
                        libelle: "LOTISSEMENT LE POSTILLON",
                        restructuree: "",
                        highlight: "<strong>LOTISSEMENT</strong> LE POSTILLON"
                    },
                    ligne4: {
                        libelle: "19 ROUTE D ORTON",
                        libelleVoie: "ROUTE D ORTON",
                        numero: "19",
                        extCourte: "",
                        extLongue: "",
                        matricule: "00602679",
                        motDirecteur: "ORTON",
                        descVoie: "VAN",
                        typeVoie: "RTE",
                        highlight: "<strong>19</strong>  ROUTE D ORTON",
                        ligne4Syn: []
                    },
                    ligne5: {
                        libelle: "",
                        libelleLocalite: "",
                        mentionSpeciale: "",
                        mentionSpecialeNumero: "",
                        highlight: ""
                    },
                    ligne6: {
                        libelle: "33450 MONTUSSAN",
                        libelleAcheminement: "MONTUSSAN",
                        libelleCommune: "MONTUSSAN",
                        codeCedex: "",
                        codeInsee: "33293",
                        codePostal: "33450",
                        idza: "15203",
                        highlight: "33450 MONTUSSAN"
                    },
                    ligne7: {
                        libelle: "",
                        code_afnor: "",
                        highlight: "",
                        ligne7Syn: []
                    }
                }]
            }
        });
        var addressList = $.fn.retrieveAddressFromSerca(data, "address_row3", options);
        // console.log(QUnit.dump.parse(addressList));
        assert.equal(addressList[0].address_row3, "LOTISSEMENT LE POSTILLON");
    });
    QUnit.module("----");

    QUnit.module(">>>> Récupérer une url vers serca");
    QUnit.module(">>>> LIGNE 6");
    QUnit.test("retourne une url pour la ligne 6", function(assert) {
        var hlWordsMatch = "&hlDebut=<strong>&hlFin=</strong>"; // Tags de debut et de fin pour ce que trouve SERCA.
        var hlWordsNoFound = "&hlDebutRestruct=<p class='color_red'>&hlFinRestruct=</p>"; // Idem mais pour ce qu'il ne trouve pas.
        var testurl = $.fn.getSercaURL("33450", "address_row6", options) + hlWordsMatch + hlWordsNoFound;
        // console.log(testurl);
        assert.notEqual(testurl, "");
    });

    QUnit.module(">>>> LIGNE 4");
    QUnit.module(">>>> Récupérer une url vers serca");
    QUnit.test("retourne une url pour la ligne 4 (INSEE)", function(assert) {
        var hlWordsMatch = "&hlDebut=<strong>&hlFin=</strong>"; // Tags de debut et de fin pour ce que trouve SERCA.
        var hlWordsNoFound = "&hlDebutRestruct=<p class='color_red'>&hlFinRestruct=</p>"; // Idem mais pour ce qu'il ne trouve pas.
        var testurl = $.fn.getSercaURL("33293", "address_row4_insee_code", options) + hlWordsMatch + hlWordsNoFound;
        // console.log(testurl);
        assert.notEqual(testurl, "");
    });
    QUnit.test("retourne une url pour la ligne 4 (LIBELLE ACHEMINEMENT)", function(assert) {
        var hlWordsMatch = "&hlDebut=<strong>&hlFin=</strong>"; // Tags de debut et de fin pour ce que trouve SERCA.
        var hlWordsNoFound = "&hlDebutRestruct=<p class='color_red'>&hlFinRestruct=</p>"; // Idem mais pour ce qu'il ne trouve pas.
        var testurl = $.fn.getSercaURL("33293", "address_row4_acheminement_label", options) + hlWordsMatch + hlWordsNoFound;
        // console.log(testurl);
        assert.notEqual(testurl, "");
    });

    QUnit.module(">>>> LIGNE 3");
    QUnit.module(">>>> Récupérer une url vers serca");
    QUnit.test("retourne une url pour la ligne 3", function(assert) {
        var hlWordsMatch = "&hlDebut=<strong>&hlFin=</strong>"; // Tags de debut et de fin pour ce que trouve SERCA.
        var hlWordsNoFound = "&hlDebutRestruct=<p class='color_red'>&hlFinRestruct=</p>"; // Idem mais pour ce qu'il ne trouve pas.
        var testurl = $.fn.getSercaURL("33450", "address_row3", options) + hlWordsMatch + hlWordsNoFound;
        // console.log(testurl);
        assert.notEqual(testurl, "");
    });

    QUnit.module("htmlForm");
    QUnit.test("retourne le code html du formulaire", function(assert) {
        // $.fn.getHtmlForm
        var htmlcode = $.fn.getHtmlForm({
            "ihmModelAndVersion": "bootstrap4"
        });
        // console.log(htmlcode);
        assert.notEqual(htmlcode, "");
    });

    QUnit.module("inputdata row6");
    QUnit.test("Waiting for focus event", function(assert) {
        assert.timeout(1000); // Timeout of 1 second
        var done = assert.async();
        var input = $("#address_row6").focus().val("33450");
        setTimeout(function() {
            assert.equal(document.activeElement, input[0], "Input was focused");
            done();
        });
    });

    QUnit.test("Check input", function(assert) {
        assert.timeout(10000); // Timeout of 1 second
        var done = assert.async();
        // $( "#address_row6" ).trigger("keydown", $.ui.keyCode.DOWN);
        // $("#address_row6").autocomplete("search", "33450");
        var rep = $("#address_row6").val();
        setTimeout(function() {

            assert.equal(rep, "33450", "input is 33450");
            $("#address_row6").trigger("keydown", $.ui.keyCode.DOWN);
            done();
        });
    });
    QUnit.module("Function FindWord");
    QUnit.test("Find word", function(assert) {
        var rep = $.fn.findWord("APPT");
        assert.equal(rep, "APPARTEMENT");
    });

    QUnit.module("updateFinal");
    QUnit.test("updateFinal clear all", function(assert) {
        var rep = $.fn.updateFinal(true);
        assert.equal(rep, "");
    });

    QUnit.test("updateFinal two fields firstname/lastname", function(assert) {
        $("#address_row1_first_name").val("TOTOR");
        $("#address_row1_last_name").val("TOTOR LE CASTOR");
        $("#address_row6").val("33450 MONTUSSAN");
        var rep = $.fn.updateFinal();
        assert.notEqual(rep, "");
    });
    QUnit.test("updateFinal one field f/l", function(assert) {
        $("#address_row1_first_name").val("TOTOR");
        $("#address_row1_last_name").val("TOTOR LE CASTOR");
        $("#address_row6").val("33450 MONTUSSAN");
        options.oneFieldAddressRow1 = true;
        var rep = $.fn.updateFinal();
        assert.notEqual(rep, "");
    });
}(jQuery, QUnit));