/*  jshint strict:false */
/*  eslint strict:0 */
/*  global CasperError, console, phantom, require */
// var test_url = 'https://cors-proxy.seguret.org/https://www.serca.preprod.laposte.fr/services/solr/fulltextProfic?chaineRecherche=33450&typeRecherche=commune&optionMot=Contient&optionRecherche=AND_OR_RES&idClient=ihm_services_adresses&passwdClient=SAi0DFgoJf&typeResultat=json';
var x = require('casper').selectXPath;
casper.test.begin('Affichage du formulaire 6 lignes', function(test) {
    casper.start('index.html').then(function() {
        casper.viewport(1280, 1024, function() {
            // new view port is effective
        });
        this.echo("## Mise en place formulaire par jquery", 'COMMENT');
        this.test.assertExists(('#\\#frm_serca_api'), 'le formulaire est créé');
        this.echo("## Vérification des champs de saisie du formulaire", 'COMMENT');

        this.test.assertExists(('#address_row1'), 'the #address_row1 input exists');
        this.test.assertExists(('#address_row2'), 'the #address_row2 input exists');
        this.test.assertExists(('#address_row3'), 'the #address_row3 input exists');
        this.test.assertExists(('#address_row4'), 'the #address_row4 input exists');
        this.test.assertExists(('#address_row5'), 'the #address_row5 input exists');
        this.test.assertExists(('#address_row6'), 'the #address_row6 input exists');

        // this.echo("## Vérification des textes d'exemple dans les formulaires", 'COMMENT');
        this.test.assertEquals(this.getElementsAttribute('#address_row1', 'placeholder')[0],"Ex: M Jean Dupond","placeholder : Civilité Prénom Nom");
        this.test.assertEquals(this.getElementsAttribute('#address_row6', 'placeholder')[0],"33500 Libourne","placeholder : Code postal et ville");
        this.test.assertEquals(this.getElementsAttribute('#address_row5', 'placeholder')[0],"","placeholder : Lieu dit ou ancienne commune");
        this.test.assertEquals(this.getElementsAttribute('#address_row4', 'placeholder')[0],"Ex : 3 rue des lilas","placeholder : Numéro et nom de la voie");
        this.test.assertEquals(this.getElementsAttribute('#address_row3', 'placeholder')[0],"Ex : Résidence la verboise","placeholder : Bâtiment, résidence");
        this.test.assertEquals(this.getElementsAttribute('#address_row2', 'placeholder')[0],"Ex : Appartement 123","placeholder : Appartement, escalier, étage");


        this.echo("## Test input address_row6 + response");
        casper.sendKeys("#address_row6", "33450");

        // <span class="serca_highlight">MONTUSSAN</span>

        // function getListAC()
        // {
        //     var el = document.querySelectorAll('.serca_highlight');
        //     // return Array.prototype.map.call(el, function(e)
        //     // {
        //     //     debugger;
        //     //     this.echo(e.val());
        //     //     return el;
        //     // });
        //     return el;
        // }

        this.waitForSelector(x('//*[@id="ui-id-1"]'),
            function success()
            {
                this.echo("Le selecteur de la liste des reponses existe.");
                var listOfAnswers = this.evaluate(function()
                {
                    this.echo("List of answers");
                    return document.getElementsByClassName('serca_highlight');
                });

                // var listOfAnswers = document.querySelectorAll('.serca_highlight');
                this.echo("Waiting...");
                // casper.wait(5000);
                this.echo(this.fetchText('#test-form'));
                this.echo(this.fetchText("#ui-id-1"));
                // this.echo(document.getElementsByClassName('serca_highlight').length);
                this.echo("test recup liste");
                this.echo(this.fetchText('.serca_highlight'));
                this.echo(require('utils').dump(document.getElementsByClassName('serca_highlight')));
                if (listOfAnswers !== null)
                {
                    this.echo("# Nombre de reponse : " + listOfAnswers.length);
                    this.test.begin('assertEquals() nb answers = 4', 1, function(test)
                    {
                        test.assertEquals(listOfAnswers.length, 4);
                        test.done();
                    });

                    this.echo('## Check content');
                    // On vide le champs
                    this.test.sendKeys("#address_row6", "data",
                    {
                        reset: true
                    });
                    this.test.sendKeys("#address_row6", "33450 MONTUSSAN");
                    listOfAnswers = this.evaluate(function()
                    {
                        this.echo("List of answers");
                        return document.getElementsByClassName('serca_highlight');
                    });
                    this.echo("# Nombre de reponse : " + listOfAnswers.length);
                    this.test.begin('assertEquals() nb answers = 1', 1, function(test)
                    {
                        test.assertEquals(listOfAnswers.length, 4);
                        test.done();
                    });
                } else {
                    this.echo("Le selecteur de la liste des reponses est vide. (problème d'accès SERCA ?)");
                }
            },
            function fail() {
                this.echo("!!! Pas de liste de reponses !!!");
                // désactivé car ne passe pas eslint
                //this.echo("LS= " + require('utils').dump(listOfAnswers));
            }
        );

    }).run(function() {
        test.done();
    });
});