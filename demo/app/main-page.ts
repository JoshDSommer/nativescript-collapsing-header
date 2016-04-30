import * as observable from 'data/observable';
import * as pages from 'ui/page';
let songs = require('./songs.json');
import {ListView} from 'ui/list-view';

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
	let page = <pages.Page>args.object;
	page.actionBarHidden = true;
	page.bindingContext = {
		items:
		songs
	};
	console.log('hello');
	let songList = <ListView>page.getViewById('songList');
	//let scroll = <ScrollView>page.getViewById('scroll');

}