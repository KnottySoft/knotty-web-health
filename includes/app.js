(function() {
    var app = angular.module('knotty', []);

	app.controller('tabController', function () {
		this.tab = 'a';
		this.setTab = function (activeTab) { this.tab = activeTab; };
	});

})();