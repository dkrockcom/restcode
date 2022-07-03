/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const NodeCronJob = require('cron');
const Logger = require('./Helper/Logger');

const Tasks = [];
const ActiveTask = [];
const isTaskLogEnabled = JSON.parse(process.env.TASK_OR_JOB_TIME_LOG_ENABLED || false);

class TaskManager {
    static get Tasks() { return Tasks };
    static get ActiveTask() { return ActiveTask };

    static set Tasks(val) { Tasks = val };
    static set ActiveTask(val) { ActiveTask = val };

    static Initialize() {
        this.Tasks.forEach(activeTask => {
            const job = new NodeCronJob.CronJob(activeTask.Interval, async () => {
                const TaskKey = `${activeTask.Name}_TASK`;
                try {
                    const d1 = new Date();
                    await activeTask.Task.execute();
                    const d2 = new Date();
                    if (isTaskLogEnabled) {
                        Logger.debug(`Task_Execution_Time  Task: ${activeTask.Name} Time: ${d2 - d1}ms`);
                    }
                } catch (ex) {
                    Logger.error(ex);
                }
            }, null, true);
            this.ActiveTask.push({ name: activeTask.Name, task: job });
            job.start();
        });
    }

    /**
     * Add - function for Add task
     * @param  {Object} task - Task Class instance
     * @param  {String} interval - Task interval
     * @param  {String} name - Taks Name
     */
    static Add(task, interval, name) {
        this.Tasks.push({ Task: task, Interval: interval, Name: name });
    }

    /**
     * Start - function for start task based on name
     * @param  {String} name - Task Name
     */
    static Start(name) {
        let index = this.ActiveTask.findIndex(e => e.name === name);
        if (index > -1) {
            let activeTask = this.ActiveTask[index];
            !activeTask.task.running && activeTask.task.start();
        }
    }

    /**
     * Stop - function for Stop task based on name
     * @param  {String} name - Task Name
     */
    static Stop(name) {
        let index = this.ActiveTask.findIndex(e => e.name === name);
        if (index > -1) {
            let activeTask = this.ActiveTask[index];
            activeTask.task.running && activeTask.task.stop();
        }
    }

    /**
     * StartAll - function for start all Tasks/scheduler
     */
    static StartAll(name) {
        this.ActiveTask.forEach(taskRecord => {
            if (!taskRecord.task.running) {
                taskRecord.task.start();
            }
        });
    }

    /**
     * StopAll - function for stop all Tasks/scheduler
     */
    static StopAll() {
        this.ActiveTask.forEach(taskRecord => {
            if (taskRecord.task.running) {
                taskRecord.task.stop();
            }
        });
    }

    /**
     * RemoveAll - function for remove all Tasks/scheduler
     */
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