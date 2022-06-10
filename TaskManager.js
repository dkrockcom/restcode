/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const NodeCronJob = require('cron');

let Tasks = [];
let ActiveTask = [];

class TaskManager {
    static get Tasks() { return Tasks };
    static get ActiveTask() { return ActiveTask };

    static set Tasks(val) { Tasks = val };
    static set ActiveTask(val) { ActiveTask = val };

    static Initialize() {
        this.Tasks.forEach(activeTask => {
            const job = new NodeCronJob.CronJob(activeTask.Interval, activeTask.Task.execute, null, true);
            this.ActiveTask.push({ name: activeTask.Name, task: job });
            job.start();
        });
    }

    static Add(task, interval, name) {
        this.Tasks.push({ Task: task, Interval: interval, Name: name });
    }

    static Start(name) {
        let index = this.ActiveTask.findIndex(e => e.name === name);
        if (index > -1) {
            let activeTask = this.ActiveTask[index];
            !activeTask.task.running && activeTask.task.start();
        }
    }

    static Stop(name) {
        let index = this.ActiveTask.findIndex(e => e.name === name);
        if (index > -1) {
            let activeTask = this.ActiveTask[index];
            activeTask.task.running && activeTask.task.stop();
        }
    }

    static StartAll(name) {
        this.ActiveTask.forEach(taskRecord => {
            if (!taskRecord.task.running) {
                taskRecord.task.start();
            }
        });
    }

    static StopAll() {
        this.ActiveTask.forEach(taskRecord => {
            if (taskRecord.task.running) {
                taskRecord.task.stop();
            }
        });
    }

    static RemoveAll() {
        this.ActiveTask.forEach(taskRecord => {
            if (taskRecord.task.running) {
                taskRecord.task.stop();
            }
        });
        this.ActiveTask = [];
    }
}
module.exports = TaskManager;