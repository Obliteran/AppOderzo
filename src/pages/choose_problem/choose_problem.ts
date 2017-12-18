import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ReportLocationPage } from '../report_location/report_location';


@Component({
  selector: 'page-choose_problem',
  templateUrl: 'choose_problem.html'
})
export class ChooseProblemPage {



    items = [];


    constructor(public navCtrl: NavController, public navParams: NavParams) {
       
       this.setSubCategories(navParams.get("id"),navParams.get("categories"));
            
    }   
    
    
    setSubCategories(parent_id,categories){
        
        
        for(let id in categories){
            if(categories[id][0] == parent_id)
                this.items.push(categories[id]);
   
         
        }
    
    }
    
    itemSelected(item){
        this.navCtrl.push(ReportLocationPage, {
            photos: this.navParams.get("photos"),
            description: this.navParams.get("description"),
            cat: this.navParams.get("cat"),
            subCat: item[1]
           
        });
    
    }
    



        
}