import user from './user.js';
function route(app){
    app.use('/user/api', user);
};
export default route;