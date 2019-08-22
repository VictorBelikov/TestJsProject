$(document).ready(function() {
  $('.test').click(function() {
    $('body').prepend('<button class="hello">click me!</button>');
    $('button.hello').click(function() {
      console.log('Hello, world!');
    });
  });
});

// var cpcplayer = USAN.cpcplayers[playerId];
// https://sp.auth.adobe.com/adobe-services/authenticate/saml?noflash=true&mso_id=Cablevision&requestor_id=usa&no_iframe=false&domain_name=adobe.com

// ======================================================
