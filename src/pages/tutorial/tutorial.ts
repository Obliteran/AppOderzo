import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import {HomePage} from '../home/home';
import {UserData} from '../../providers/user-data'

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage,
  ) { }

  startApp() {
      this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
            this.navCtrl.pop();
            
    
        }
        else {
           this.navCtrl.setRoot(HomePage).then(() => {
            this.storage.set('hasSeenTutorial', 'true');
           
            })
        }     
    
        });
  }
  
  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

	ionViewWillEnter() {
		this.slides.update();
	}

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
      this.storage.get('hasLoggedIn')
      .then((hasLoggedIn) => {
        if (hasLoggedIn) {
            this.menu.enable(hasLoggedIn, 'loggedInMenu');
        } 
        else {
            this.menu.enable(!hasLoggedIn, 'loggedOutMenu');
        }
      
        });

  }
}