var express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    postmark = require('postmark'),
    Validator = require('validatorjs');

var errorHelper = require('../util/helpers');
var emailClient = new postmark.Client("8f4b371b-88c7-4c0b-aa20-45e0203c2c6e");

var User = require('../models/user');

router.post('/authenticate', function(request, response) {

    var validation = new Validator(request.body, {
        email: 'required|email',
        password: 'required|min:4|max:128'
    });


    if (validation.fails()) {

        return response.status(422).json(errorHelper.firstError(validation.errors));
    }

    var _email = request.body.email;
    var _password = request.body.password;

    User.findOne({email: _email}, function (error, user) {
        if (error) {
            return response.status(500).json("Error: " + error);
        }

        if (user) {
            if (user.validatePassword(_password)) {
                if (!user.active) {
                    return response.status(401).json('Inactive account. Please contact admin.');
                }

                return response.json(user.token)
            }
        }

        return response.status(401).json('Invalid login credentials')
    })

});

router.post('/retrieve-password', function (request, response) {
    var validation = new Validator(request.body, {
        email: 'required|email'
    });

    if (validation.fails()) {
        return response.status(422).json(errorHelper.firstError(validation.errors));
    }

    var _email = request.body.email;

    User.findOne({email: _email}, function (error, user) {
        if (error) {
            return response.status(500).json('Error: ' + error);
        }

        if (user) {
            crypto.randomBytes(20, function (error, buffer) {
                if (error) return response.status(500).json('Error: ' + error);

                var token = buffer.toString('hex');

                user.resetPassword.token = token;
                user.resetPassword.expiration = Date.now() + 1800000; //30 min.

                user.save(function (error, user) {
                    if (error) return response.status(500).json('Error: ' + error);

                    var mailOptions = {
                        'TemplateID': 364921,
                        'To': user.email,
                        'From': request.app.locals.email,
                        'TemplateModel': {
                            'product_name': request.app.locals.title,
                            'name': user.name.simple,
                            'action_url': request.headers.host + '/auth/reset-password/' + token,
                            'product_address_line1': request.app.locals.address.lineOne,
                            'product_address_line2': request.app.locals.address.lineTwo
                        }
                    };

                    emailClient.sendEmailWithTemplate(mailOptions, function (error) {
                        // TODO: log key errors.
                        if (error) return console.log('Error: ' + error.message);

                        return response.json('We\'ve sent further instructions to ' + user.email +
                            ' if it exist on our system.');
                    });
                });
            });
        } else {
            return response.json('We\'ve sent further instructions to the e-mail if it exist on our system.');
        }
    });
});

router.post('/reset-password/', function (request, response) {
    var validation = new Validator(request.body, {
        email: 'required|email',
        password: 'required|confirmed',
        token: 'required'
    });

    if (validation.fails()) {
        return response.status(422).json(errorHelper.firstError(validation.errors));
    }

    var _token = request.body.token;
    var _password = request.body.password;
    var _email = request.body.email;

    User.findOne({'resetPassword.token': _token, 'email': _email, 'resetPassword.expiration': {$gt: Date.now()}},
        function (error, user) {
            if (error) return console.log('Error: ' + error);

            if (user) {
                user.password = user.generateHash(_password);
                user.resetPassword.token = undefined;
                user.resetPassword.expiration = undefined;

                user.save(function (error) {
                    if (error) return console.error('Error: ' + error);

                    var mailOptions = {
                        'TemplateId': 365402,
                        'To': user.email,
                        'From': request.app.locals.email,
                        'Subject': 'Password Change Confirmation',
                        'TemplateModel': {
                            'product_name': request.app.locals.title,
                            'name': user.name.simple,
                            'product_address_line1': request.app.locals.address.lineOne,
                            'product_address_line2': request.app.locals.address.lineTwo
                        }
                    };

                    emailClient.sendEmailWithTemplate(mailOptions, function (error) {
                        if (error) return console.error('Error: ' + error.message);

                        return response.json(user.token);
                    });
                });
            } else {
                return response.status(401).json('Password reset token is invalid or has expired.');
            }
    });
});

module.exports = router;