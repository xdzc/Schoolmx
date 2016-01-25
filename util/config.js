/**
 * Configuration file.
 */
module.exports = {
    databaseUri: {
        mongodb: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/schoolmx',
    },
    app: {
        name: 'SchoolMx',
        version: '0.0.1',
        email: 'schoolmx@bitrient.com'
    },
    address: {
        lineOne: 'Bitrient Services, Jos 930281',
        lineTwo: 'Plateau State, Nigeria.'
    },
    auth: {
        secret: 'b1tr13nt',
        issuer: 'bitrient.com',
        audience: 'schoolmx.bitrient',
        expiration: '14 days'
    }
};