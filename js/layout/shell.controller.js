'use strict';

//ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];

/* @ngInject */
function ShellController($rootScope, $timeout, config, logger) {
    var vm = this;
    vm.busyMessage = 'Please wait ...';
    vm.isBusy = true;
    $rootScope.showSplash = false;
    vm.navline = {
        title: config.appTitle,
        text: 'Created by Ryan Brooks',
        link: 'http://twitter.com/spikeheap'
    };

    activate();

    function activate() {
        hideSplash();
    }

    function hideSplash() {
        //Force a 1 second delay so we can see the splash.
        $timeout(function() {
            $rootScope.showSplash = false;
        }, 1000);
    }
}

module.exports = ShellController;
