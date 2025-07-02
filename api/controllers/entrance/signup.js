const _ = require('@sailshq/lodash');

module.exports = {


  friendlyName: 'Signup',


  description: 'Sign up for a new user account.',


  extendedDescription:
`This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in an "unconfirmed" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,


  inputs: {

    emailAddress: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    fullName:  {
      required: true,
      type: 'string',
      example: 'Frida Kahlo de Rivera',
      description: 'The user\'s full name.',
    }

  },


  exits: {

    success: {
      description: 'New user account was created successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },


  // fn: async function (inputs) {
  //   sails.log.warn('📩 SIGNUP INPUTS:', inputs);

  //   var newEmailAddress = inputs.emailAddress.toLowerCase();

  //   // Build up data for the new user record and save it to the database.
  //   // (Also use `fetch` to retrieve the new ID so that we can use it below.)
  //   var newUserRecord = await User.create(_.extend({
  //     emailAddress: newEmailAddress,
  //     password: await sails.helpers.passwords.hashPassword(inputs.password),
  //     fullName: inputs.fullName,
  //     tosAcceptedByIp: this.req.ip
  //   }, sails.config.custom.verifyEmailAddresses? {
  //     emailProofToken: await sails.helpers.strings.random('url-friendly'),
  //     emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
  //     emailStatus: 'unconfirmed'
  //   }:{}))
  //   .intercept('E_UNIQUE', 'emailAlreadyInUse')
  //   .intercept({name: 'UsageError'}, 'invalid')
  //   .fetch();

  //   // If billing feaures are enabled, save a new customer entry in the Stripe API.
  //   // Then persist the Stripe customer id in the database.
  //   if (sails.config.custom.enableBillingFeatures) {
  //     let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
  //       emailAddress: newEmailAddress
  //     }).timeout(5000).retry();
  //     await User.updateOne({id: newUserRecord.id})
  //     .set({
  //       stripeCustomerId
  //     });
  //   }

  //   // Store the user's new id in their session.
  //   this.req.session.userId = newUserRecord.id;

  //   if (sails.config.custom.verifyEmailAddresses) {
  //     // Send "confirm account" email
  //     await sails.helpers.sendTemplateEmail.with({
  //       to: newEmailAddress,
  //       subject: 'Please confirm your account',
  //       template: 'email-verify-account',
  //       templateData: {
  //         fullName: inputs.fullName,
  //         token: newUserRecord.emailProofToken
  //       }
  //     });
  //   } else {
  //     sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
  //   }

  // }

//   fn: async function (inputs) {
//   sails.log.info('📥 Inputs recibidos:', inputs);

//   const newEmailAddress = inputs.emailAddress.toLowerCase();

//   let newUserRecord;
//   try {
//     newUserRecord = await User.create(_.extend({
//       emailAddress: newEmailAddress,
//       password: await sails.helpers.passwords.hashPassword(inputs.password),
//       fullName: inputs.fullName,
//       tosAcceptedByIp: this.req.ip
//     }, sails.config.custom.verifyEmailAddresses ? {
//       emailProofToken: await sails.helpers.strings.random('url-friendly'),
//       emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
//       emailStatus: 'unconfirmed'
//     } : {}))
//     .intercept('E_UNIQUE', 'emailAlreadyInUse')
//     .intercept({ name: 'UsageError' }, 'invalid')
//     .fetch();
//   } catch (err) {
//     sails.log.error('❌ Error en User.create:', err);
//     throw err;
//   }

//   sails.log.info('✅ Usuario creado:', newUserRecord);
//   this.req.session.userId = newUserRecord.id;
// }

  fn: async function (inputs) {

    const newEmailAddress = inputs.emailAddress.toLowerCase();

    // Construir payload explícito
    const payload = {
      emailAddress: newEmailAddress,
      password: await sails.helpers.passwords.hashPassword(inputs.password),
      fullName: inputs.fullName,
      tosAcceptedByIp: this.req.ip,
      emailStatus: sails.config.custom.verifyEmailAddresses ? 'unconfirmed' : 'confirmed'
    };

    if (sails.config.custom.verifyEmailAddresses) {
      payload.emailProofToken = await sails.helpers.strings.random('url-friendly');
      payload.emailProofTokenExpiresAt = Date.now() + sails.config.custom.emailProofTokenTTL;
    }

    sails.log.info('👤 Intentando crear usuario con payload:', payload);

    let newUserRecord;
    try {
      newUserRecord = await User.create(payload)
        .intercept('E_UNIQUE', 'emailAlreadyInUse')
        .intercept({ name: 'UsageError' }, 'invalid')
        .fetch();
    } catch (err) {
      sails.log.error('❌ Error en User.create:', err);
      throw err;
    }

    if (sails.config.custom.enableBillingFeatures) {
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
        emailAddress: newEmailAddress
      }).timeout(5000).retry();

      await User.updateOne({id: newUserRecord.id}).set({stripeCustomerId});
    }

    this.req.session.userId = newUserRecord.id;

    if (sails.config.custom.verifyEmailAddresses) {
      await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: 'Please confirm your account',
        template: 'email-verify-account',
        templateData: {
          fullName: inputs.fullName,
          token: newUserRecord.emailProofToken
        }
      });
    } else {
      sails.log.info('📩 Registro sin verificación de correo (modo simplificado)');
    }
  }


};
