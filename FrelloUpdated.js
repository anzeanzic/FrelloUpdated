
/*
V desnem zgornjem kotu obvestilo z zeleno da se je dodal, z rdeco odstranil, z rumeno pa change. po 3 sekundah izgine.
TODO: Dodaj se EDIT task

Naj bo fizzbuzz vezan na promise. 
*/
angular.module('frello', []);

angular.module('frello').controller('FrelloController', function($scope, FrelloFactory) {
	$scope.frello = FrelloFactory;

	// listener
	$scope.$on('frello.notification', function(event, data){
        $scope.status = data;
    });
});

angular.module('frello').controller('FrelloController2', function($scope, FrelloFactory) {
	$scope.frello = FrelloFactory;

	// listener
	$scope.$on('frello.notification', function(event, data){
        $scope.status = data;
    });
});

angular.module('frello').factory('FrelloFactory', function($rootScope, $timeout) {
	return {
		tasks: [],
		todoListVisible: true,
		showNotification: false,
		notification_class: '',
		addTask: function(task, isCompleted) {
			if (isCompleted === undefined) {
				isCompleted = false;
			}
			// check if task is not empty
			if (task != undefined && !CheckIfTaskAlreadyExists(task, this.tasks)) {
				this.tasks.push({ name: task, isCompleted: isCompleted });
				$rootScope.$broadcast('frello.notification', 'Task "'+task+'" uspešno dodan!');
				this.notification_class = 'added';
				this.showNotification = true;
				var _this = this;
				$timeout(function() {
					_this.showNotification = false;
				}, 3000);
			}
		},
		removeTask: function(task) {
			var task_index = this.tasks.indexOf(task);
			if (task_index > -1) {
				var task_name = this.tasks[task_index];
				this.tasks.splice(task_index, 1);
				this.notification_class = 'removed';
				$rootScope.$broadcast('frello.notification', 'Task "'+task_name.name+'" uspešno odstranjen!');
				this.showNotification = true;
				var _this = this;
				$timeout(function() {
					_this.showNotification = false;
				}, 3000);
			}
		},
		toogleTaskList: function() {
			this.todoListVisible = this.todoListVisible ? false : true;
		},
		changeTaskState: function(task) {
			task.isCompleted = task.isCompleted ? false : true;
		},
		changeNotificationState: function(state) {
			this.showNotification = state;
		}
	};
});

var CheckIfTaskAlreadyExists = function(task, tasksArray) {
	var alreadyExists = false;
	if (tasksArray.length > 0) {
		for (var i = 0; i < tasksArray.length; i++) {
			if (task === tasksArray[i].name) {
				alreadyExists = true;
				break;
			}
		}
	}

	return alreadyExists;
};