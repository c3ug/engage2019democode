import createHistory from 'history/createBrowserHistory';

export default createHistory({
    basename: process.env.PUBLIC_URL
});