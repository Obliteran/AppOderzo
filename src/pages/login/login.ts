import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { SignupPage } from '../signup/signup';
import { UserPage } from '../userpage/userpage';
import { AuthService } from '../authservice/authservice';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
 

     usercreds = {
        operation: '',
        username: '',
        password: ''
    }; 
    submitted :boolean = false;
    
    constructor(public navCtrl: NavController, public userData: UserData, public auth: AuthService, public alertCtrl: AlertController) {}

  
    
    
    
    login(form) {
        
        this.submitted = true;

        if(form.valid){
        
            this.auth.authenticate(this.usercreds).then((data : any) => {
                    if(data.error_code == null) {
                
                        this.navCtrl.setRoot(UserPage);
                
                    }
                    else {
                        var alert = this.alertCtrl.create({
                            title: 'Errore',
                            subTitle: 'Utente Inesistente',
                            buttons: ['ok']
                        });
                        alert.present();
                    }
            });
        }
    }
   
   /* eventHandler(keyCode, form: NgForm) {
            if(keyCode == "13")
                 this.login(form);
        
    } */

    
    onSignup() {
        this.navCtrl.push(SignupPage,{
            email : this.usercreds.username
        });

    }
    
    
}
