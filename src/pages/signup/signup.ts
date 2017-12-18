import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { AuthService } from '../authservice/authservice';
import { LoginPage } from '../login/login';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
     form: FormGroup;
  
    newUser = {
        operation: '',
        username: '',
        email: '',
        cf: '',
        password: ''
     }; 
 
submitted :Boolean = false;
    
    
    constructor(public navCtrl: NavController, public userData: UserData, public authservice: AuthService, public alertCtrl: AlertController, public navParams: NavParams, private formBuilder: FormBuilder) {
      
        this.newUser.email = this.navParams.get("email");
      
            this.form = formBuilder.group({
                username: ['', Validators.required],
                email: ['', Validators.required],
                cf: ['', Validators.required],
                passCtrl: this.formBuilder.group({
                    password: ['', Validators.required],
                    confirmPass: ['', Validators.required]
                    }, {validator: this.passwordsMatch})
            });
    }
    


    passwordsMatch(group: FormGroup) {
 
        let password = group.controls.password.value;
        let confirmPass = group.controls.confirmPass.value;
       
        if ((password && confirmPass) && (password !== confirmPass)) {
            
            group.controls['confirmPass'].setErrors({"pw_mismatch": true});  
            return { pw_mismatch: true };
        }
        else return null;
      }
        
    


 
        
    signUp() {
        
        this.submitted = true;
        if(this.form.valid){
            
            this.newUser.username = this.form.value["username"];
            this.newUser.email = this.form.value["email"];
            this.newUser.cf = this.form.value["cf"];
            this.newUser.password = this.form.value.passCtrl["password"];
            
            this.authservice.addUser(this.newUser).then(data => {
                if(data) {

                    this.navCtrl.push(LoginPage);
                }
                else {
                    var alert = this.alertCtrl.create({
                        title: 'Error',
                        subTitle: 'Email già esistente',
                        buttons: ['ok']
                    });
                    alert.present();
                }
            });
    }
    }
}
