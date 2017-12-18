import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../authservice/authservice';
import { UserData } from '../../providers/user-data';
import { HomePage } from '../home/home';
import { NewReportPage } from '../new_report/new_report';
import { UserReportsPage } from '../user_reports/user_reports';

@IonicPage()
@Component({
  selector: 'page-userpage',
  templateUrl: 'userpage.html',
})
export class UserPage {
username:string;
    
  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public creds: UserData) {
  }

   ionViewDidLoad() {
        this.getUsername();
    }

    getInfo() {
        this.authservice.getUserInfo().then( (data: any) => {
            if(data) {
                console.log(data);
                /*var alert = this.alertCtrl.create({
                    title: "Username: " + data.data.username,
                    subTitle: "Data Creazione: " + data.data.date_create,
                    buttons: ['ok']
                });
                alert.present();
          */  }
            
        }) 
    }
    
     getUsername() {
        this.creds.getUsername().then((username) => {
            this.username = username;
        });
    }
    
    userReports(){
        this.navCtrl.push(UserReportsPage);
    }
    
    newReport(){
        this.navCtrl.setRoot(NewReportPage);
    }
}
