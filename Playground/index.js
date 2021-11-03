const jwt = require('jsonwebtoken');

const verify = (token) => {
	return jwt.verify(token, 'SECRET', { algorithms: ['HS256', 'none'] });
};
// verify('eyAiYWxnIjogIm5vbmUiLCAidHlwIjogIkpXVCIgfQ.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjM0OTk4MTI3fQ');

const sign = async (data) => {
	return jwt.sign(data, 'SECRET', { algorithm: 'none' });
};

console.log(sign({ user: 'admin' }));
