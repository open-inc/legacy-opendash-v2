function config($sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist(['**']);
}

config.$inject = ['$sceDelegateProvider'];

export default config;
