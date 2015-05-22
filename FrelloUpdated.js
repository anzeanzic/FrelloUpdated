angular.module('frello', ['ui.bootstrap']);

angular.module('frello').controller('FrelloController', function($scope, $modal, FrelloFactory) {
	$scope.frello = FrelloFactory;

	// modal
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
		closeNotificationTimeout: null,
		addTask: function(task, isCompleted) {
			if (isCompleted === undefined) {
				isCompleted = false;
			}

			if (this.validateTask(task)) {
				this.tasks.push({ name: task, isCompleted: isCompleted });
				this.createBroadcast('Task "'+task+'" successfully added!', 'added');
			}
		},
		editTask: function(task, new_task_name) {
			var task_index = this.tasks.indexOf(task);

			if (this.validateTask(new_task_name)) {
				var old_task_name = this.tasks[task_index].name;
				this.tasks[task_index].name = new_task_name;
				this.createBroadcast('Task "'+old_task_name+'" successfully renamed to "'+new_task_name+'"!', 'edited');
				return true;
			}
			return false;
		},
		removeTask: function(task) {
			var task_index = this.tasks.indexOf(task);
			if (task_index > -1) {
				var task_name = this.tasks[task_index];
				this.tasks.splice(task_index, 1);
				this.createBroadcast('Task "'+task_name.name+'" successfully removed!', 'removed');
			}
		},
		createBroadcast: function(text, css_style) {
			// close notification if it is shown
			this.showNotification = false;
			$timeout.cancel(this.closeNotificationTimeout);

			// create a new broadcast (and notification)
			$rootScope.$broadcast('frello.notification', text);
			this.notification_class = css_style;
			this.showNotification = true;
			var _this = this;
			this.closeNotificationTimeout = $timeout(function() {
				_this.showNotification = false;
			}, 3000);
		},
		validateTask: function(task) {
			var taskOk = true;
			var error_text = "";

			if (task === undefined || task.trim().length === 0) {
				taskOk = false;
				error_text = 'Task must contain at least one alphanumeric sign!';
			}
			else if (CheckIfTaskAlreadyExists(task, this.tasks)) {
				taskOk = false;
				error_text = 'Task "'+task+'" already exists on the task list!';
			}

			if (!taskOk) {
				this.createBroadcast(error_text, 'text-danger');
			}

			return taskOk;
		},
		toogleTaskList: function() {
			this.todoListVisible = this.todoListVisible ? false : true;
		},
		changeTaskState: function(task) {
			task.isCompleted = task.isCompleted ? false : true;
			this.createBroadcast('Task "'+task.name+'" successfully changed it state '+(task.isCompleted ? 'completed' : 'uncompleted')+'!', 'edited');
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