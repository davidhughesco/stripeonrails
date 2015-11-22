jQuery(function($) {

  // jquery.payment validations
  $('#card-number').payment('formatCardNumber');
  $('#cvc').payment('formatCardCVC');

  // Add card brand icon using FontAwesome
  $('#card-number').keyup(function() {
    var cardType = $.payment.cardType($('#card-number').val());    
    // Add card type to class
    $('#card-brand').addClass(function() {
      return "fa-cc-" + cardType;
    });

    // Show correct CVC location icon
    if ( cardType == "amex" ) {
      $('#cvc-back').hide();
      $('#cvc-front').show();
    } else {
      $('#cvc-front').hide();
      $('#cvc-back').show();
    }

    // Change CVC placeholder text
    if ( cardType == "amex" ) {
      $('#cvc').attr("placeholder","1234");
    } else {
      $('#cvc').attr("placeholder","123");
    }    

    // Remove all icons if card-number is empty
    if($('#card-number').val() == '') {
      $('#card-brand').removeClass();
      $('#card-brand').addClass('fa');
      $('.cvc-location').hide();
    };
  });

  // Auto-tabbing: disabled following poor feedback

  // card-number input: at 19 characters, move to cc-exp-month
  $('#card-number').keyup(function() {
    if($(this).val().length == 19) {
      $('#expiry-month').focus()
    }; 
  });

  // card-exp-month input: at 2 characters, move to cc-exp-year
  $('#expiry-month').keyup(function() {
    if($(this).val().length == 2) {
      $('#expiry-year').focus()
    }; 
  });

  // cc-exp-year input: at 4 characters, move to cc-cvc
  $('#expiry-year').keyup(function() {
    if($(this).val().length == 4) {
      $('#cvc').focus()
    }; 
  });

  // end auto-tabbing */

  // Set Stripe Publishable Key
  Stripe.setPublishableKey($('meta[name="stripe-publishable-key"]').attr('content'))
  
  // Locate form by id
  $('#new_transaction').submit(function(event) {
    var $form = $(this);

    // If the token doesn't already exist, then...
    if($('#transaction_stripe_token').val().length === 0) {

      // Disable the submit button to prevent repeated clicks and replace with 'Please wait...'
      $("button[name*='commit']").prop('disabled', true).hide();
      $("#please-wait").show();

      // Use Stripe's createToken call to get token
      Stripe.card.createToken($form, stripeResponseHandler);

      // Prevent the form from submitting with the default action
      return false;

    } // end if
  });
});

// Handle response from Stripe server
function stripeResponseHandler(status, response) {
  var $form = $('#new_transaction');

  if (response.error) {
    
    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
    $form.find('.payment-errors').addClass('visible-error');

    // Remove 'Please wait...' and show original submit button
    $("#please-wait").hide();
    $("button[name*='commit']").prop('disabled', false).show();
  } else {
    
    // Response contains id and card, which contains additional card details
    var token = response.id;
    
    // Insert the token into the form so it gets submitted to the server...
    $form.find($('#transaction_stripe_token').val(token));
    
    // and submit the form
    $form.get(0).submit();
  }
};