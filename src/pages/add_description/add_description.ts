import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChooseCategoryPage } from '../choose_category/choose_category';

@Component({
  selector: 'page-add_description',
  templateUrl: 'add_description.html'
})
export class AddDescriptionPage {
        
    form = {
        description: null
    };
    submitted:boolean = false;
    
constructor(public navCtrl: NavController, public navParams: NavParams) {}
    
     
     openSelectCategoryPage(form){
        this.submitted = true;
        if(form.valid){
            this.navCtrl.push(ChooseCategoryPage,{
                photos : this.navParams.get("photos"),
                description: this.form.description
            });
        }
    }
}