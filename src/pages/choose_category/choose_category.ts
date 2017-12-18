import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ChooseProblemPage } from '../choose_problem/choose_problem';


@Component({
  selector: 'page-choose_category',
  templateUrl: 'choose_category.html'
})
export class ChooseCategoryPage {
    categories =  [];
    items = [];


    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.categories[1] = [0,'Strada'];
        this.categories[2] = [0,'Spazio Pubblico'];
        this.categories[3] =  [0,'Illuminazione'];
        this.categories[4] =  [0,'Marciapiede'];
        this.categories[5] =  [0,'Segnali Stradali'];
        this.categories[6] = [0,'Servizi pubblici'];
        this.categories[7] =   [1,'Buca'];
        this.categories[8] =   [1,'Ostacolo'];
        this.categories[9] =   [2,'Lampadina Rotta'];
        this.setMainCategories();
       
        
        
    }
    
        
    
    
    
    itemSelected(item) {
    
        for(let id in this.categories)
            if(item[1] == this.categories[id][1]){
                    
                this.navCtrl.push(ChooseProblemPage,{
                    photos: this.navParams.get("photos"),
                    description: this.navParams.get("description"),
                    cat: item[1],
                    id: id,
                    categories: this.categories
                });
                      
            }

    /* var cat_id: number;
        for(let i in this.items)
            if(item[1] == this.items[i][1])
                cat_id = Number(i)+1;
    
        this.navCtrl.push(ChooseProblemPage,cat_id);
   */
  }
     setMainCategories(){
        
         
        for(let id in this.categories){
            
            if(this.categories[id][0] == 0){
                this.items.push(this.categories[id]);
                
            }
        
        }
    
     }
}