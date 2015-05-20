
/*
V desnem zgornjem kotu obvestilo z zeleno da se je dodal, z rdeco odstranil, z rumeno pa change. po 3 sekundah izgine.
TODO: Dodaj se EDIT task

Naj bo fizzbuzz vezan na promise. 
*/
angular.module('frello', ['ui.bootstrap']);

angular.module('frello').controller('FrelloController', function($scope, $modal, FrelloFactory) {
	$scope.frello = FrelloFactory;

	$scope.open = function(task) { 
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'modal.html',
			controller: 'ModalController',
			resolve: {
				clickedTask: function() {
					return task;
				}
			}
    	});
	}

	// listener
	$scope.$on('frello.notification', function(event, data){
        $scope.status = data;
    });
});

angular.module('frello').controller('ModalController', function($scope, $modalInstance, FrelloFactory, clickedTask) {
	$scope.frello = FrelloFactory;
	$scope.editedTask = clickedTask.name;
	$scope.TaskNameChanged = true;

	$scope.Confirm = function () {
		var TaskNameChanged = $scope.frello.editTask(clickedTask, $scope.editedTask);
		if (TaskNameChanged) {
			$scope.TaskNameChanged = true;
			$modalInstance.close('');
		}
		else {
			$scope.TaskNameChanged = false;
		}
	};

	$scope.Cancel = function () {
		$modalInstance.dismiss('cancel');
	};
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
		editTask: function(task, new_task_name) {
			var task_index = this.tasks.indexOf(task);
			if (new_task_name != undefined && !CheckIfTaskAlreadyExists(new_task_name, this.tasks)) {
				var old_task_name = this.tasks[task_index].name;
				this.tasks[task_index].name = new_task_name;
				this.notification_class = 'edited';
				$rootScope.$broadcast('frello.notification', 'Task "'+old_task_name+'" uspešno preimenovan v "'+new_task_name+'"!');
				this.showNotification = true;
				var _this = this;
				$timeout(function() {
					_this.showNotification = false;
				}, 3000);
				return true;
			}
			return false;
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

var CheckIfTaskAlreadyExists = function(task_name, tasksArray) {
	var alreadyExists = false;
	if (tasksArray.length > 0) {
		for (var i = 0; i < tasksArray.length; i++) {
			if (task_name === tasksArray[i].name) {
				alreadyExists = true;
				break;
			}
		}
	}

	return alreadyExists;
};