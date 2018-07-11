import userService from './services/user.service';
import dataService from './services/data.service';
import eventService from './services/event.service';
import dashboardService from './services/dashboard.service';
import envService from './services/env.service';
import modalService from './services/modal.service';
import notificationService from './services/notification.service';
import presetsService from './services/presets.service';
import headerService from './services/header.service';
import routerService from './services/router.service';

export default [
    ['user', userService],
    ['data', dataService],
    ['event', eventService],
    ['modal', modalService],
    ['notification', notificationService],
    ['presets', presetsService],
    ['dashboard', dashboardService],
    ['header', headerService],
    ['env', envService, true],
    ['router', routerService, true],
];
