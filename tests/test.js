// var casper = require('casper').create();
casper.start('index.html');

casper.then(function () {
    this.echo('Current page : ' + this.getTitle());
    this.waitForSelector('form #l1');
});
// Est-ce que le formulaire existe ?
casper.then(function () {
    this.test.assertExists(('#\\#frm_serca_api'), 'the element exists');
});

// Je peux écrire dans le champ l1
casper.then(function () {
    this.fill('#\\#frm_serca_api',
        {
            'l1': 'Francis'
        }, true);
});

// Capture du popup autocomplete et check first value
casper.then(function () {

});

casper.run(function () {
    this.echo('message sent').exit();
});
