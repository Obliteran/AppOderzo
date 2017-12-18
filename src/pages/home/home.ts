import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewReportPage } from '../new_report/new_report';
import { ReportsPage } from '../public_reports/public_reports';
import { UserData } from '../../providers/user-data';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

constructor(public navCtrl: NavController, public userData: UserData) {}
    
       
    openNewReportPage(){
        this.userData.hasLoggedIn().then((hasLoggedIn) => {
            if(hasLoggedIn === true)
                this.navCtrl.setRoot(NewReportPage);
            else 
                this.navCtrl.push(LoginPage);
        }); 
        
    
    }   
    
    openPublicReportsPage(){
        this.userData.hasLoggedIn().then((hasLoggedIn) => {
            if(hasLoggedIn === true)
                this.navCtrl.push(ReportsPage);
            else 
                this.navCtrl.push(LoginPage);
        }); 
        
    }
    
    
    
    
}
