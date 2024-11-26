import user from './user.js';
import ErrHandle from '../app/middleware/errHandle.js'
function route(app){
    app.use('/api/v1/auth', user);
    app.use(ErrHandle.notFound);
    app.use(ErrHandle.errHandler);
};
export default route;