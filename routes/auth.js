var express = require('express'),
    router = express.Router(),
    Validator = require('validatorjs');

var errorHelper = require('../util/helpers');

var User = require('../models/user');

router.post('/authenticate', function(request, response) {

    var validation = new Validator(request.body, {
        email: 'required|email',
        password: 'required|min:4|max:5'
    });


    if (validation.fails()) {

        return response.status(422).json(errorHelper.firstError(validation.errors));

    } else {
        var _email = request.body.email;
        var _password = request.body.password;

        User.findOne({email: _email}, function (error, user) {
            if (error) {
                response.status(500).json("Error: " + error);
            } else {
                if (user) {
                    if (user.validatePassword(_password)) {
                        if (!user.active) {
                            return response.status(401).json('Inactive account. Please contact admin.');
                        }

                        return response.json(user.token)
                    }
                }

                return response.status(401).json('Invalid login credentials')
            }
        })
    }
});

router.post('/retrieve-password', function (req, res) {

});

router.post('/reset/:token', function (req, res) {

});

module.exports = router;