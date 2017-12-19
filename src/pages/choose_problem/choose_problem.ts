import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ReportLocationPage } from '../report_location/report_location';
import { AuthService } from '../authservice/authservice';


@Component({
  selector: 'page-choose_problem',
  templateUrl: 'choose_problem.html'
})
export class ChooseProblemPage {



    sub_categories = [];


    constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {}   
    
     ionViewDidLoad(){
         let loading = this.loadingCtrl.create({
                
                });
        loading.present();
        let parent_id = this.navParams.get("cat_id");
        this.authservice.getCategories(parent_id).then((data:any)=>{
          loading.dismiss();
          if(data){
              this.sub_categories = data;
          }
            else{
               var alert = this.alertCtrl.create({
                        title: 'Errore foto',
                        subTitle: 'Si è verificato un errore, riprova più tardi',
                        buttons: ['ok']
                });
                alert.present();
              
          }
          
      });
    }
    

    
    
    
    itemSelected(item){
        this.navCtrl.push(ReportLocationPage, {
            photos: this.navParams.get("photos"),
            description: this.navParams.get("description"),
            cat_id: this.navParams.get("cat_id"),
            subCat_name: item.name,
            subCat_id: item.id
           
        });
    
    }
    



        
}