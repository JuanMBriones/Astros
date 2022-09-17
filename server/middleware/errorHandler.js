/* eslint-disable max-len */
const MyError = require('./customError');

const errorHandler = () => async (err, req, res, next) => {
  switch (err.name) {
  case 'MongoError':
    console.log('MONGOERROR');
    if (err.code === 11000) {
      next(new MyError(409, 'Credentials were already used.'));
    } else {
      next(err);
    }
    break;

  case 'CastError':
    console.log('CASTERROR');
    next(new MyError(400, 'El valor \'' + err.value + '\' is not accepted for the field: ' + err.kind));
    break;

  case 'ValidationError':
    let msg = '';
    for (type in err.errors) {
      if (Object.prototype.hasOwnProperty.call(err.errors, type)) {
        if (msg.length > 0) {
          msg += ' ';
        }
        msg += err.errors[type].message;
      }
    }
    next(new MyError(409, msg, err.stack));
    break;

  case 'ReferenceError':
    console.log('REFERENCEERROR');
    console.log(err.message);
    next(new MyError(400, 'There was an error on: ' + err.message.split(' ')[0], err.stack));
    break;

  case 'CustomError':
    next(err);
    break;

  default:
    console.log('err :', err);
    console.log('=============================');
    if (process.env.NODE_ENV === 'production') {
      next(new MyError(500, 'SERVER ERROR'));
    }
  }
};

module.exports = errorHandler;
