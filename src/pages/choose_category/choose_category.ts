import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ChooseProblemPage } from '../choose_problem/choose_problem';
import { AuthService } from '../authservice/authservice';

@Component({
  selector: 'page-choose_category',
  templateUrl: 'choose_category.html'
})
export class ChooseCategoryPage {
    categories =  [];
    


    constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {}
    
    ionViewDidLoad(){
        
         let loading = this.loadingCtrl.create({
                   
                });
        loading.present();
        
        let parent_id = null;
        this.authservice.getCategories(parent_id).then((data:any)=>{
            
            loading.dismiss();
            
            if(data){
                this.categories = data;
            }
            else{
               var alert = this.alertCtrl.create({
                        title: 'Errore',
                        subTitle: 'Si è verificato un errore, riprova più tardi',
                        buttons: ['ok']
                });
                alert.present();

            }
          
      });
       
    }
    
    
    
    itemSelected(item) {
    
        this.navCtrl.push(ChooseProblemPage,{
            
            photos: this.navParams.get("photos"),
            description: this.navParams.get("description"),
            cat_id: item.id,
            
        });
                      
    }

    /* var cat_id: number;
        for(let i in this.items)
            if(item[1] == this.items[i][1])
                cat_id = Number(i)+1;
    
        this.navCtrl.push(ChooseProblemPage,cat_id);
   */
  }
