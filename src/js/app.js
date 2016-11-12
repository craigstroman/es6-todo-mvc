import Controller from './controller/controller';
import {$on} from './helpers/helpers';
import Template from './template/template';
import Store from './store/store';
import View from './view/view';

const store = new Store('todos-vanilla-es6');

const template = new Template();
const view = new View(template);

/**
 * @type {Controller}
 */
const controller = new Controller(store, view);

const setView = () => controller.setView(document.location.hash);
$on(window, 'load', setView);
$on(window, 'hashchange', setView);