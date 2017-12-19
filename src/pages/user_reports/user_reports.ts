import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import { MyModal } from '../public_reports/public_reports';
import { AuthService } from '../authservice/authservice';


@Component({
  selector: 'page-user_reports',
  templateUrl: 'user_reports.html',
})
export class UserReportsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    
      this.createReportsList();
  
  }
    active_reports= [];
    pending_reports= [];
    report = {
        id:null,
        title:null,
        img:null,
        description:null,
        
    };
    
     createReportsList(){
        let loading = this.loadingCtrl.create({
                    content: 'Sto caricando le tue segnalazioni'
                });
        loading.present();
         
        this.authservice.getUserReports().then( (data: any) => {
            
            loading.dismiss();
            if((data!=false) && (data.length >0)) {
   
                for(let report of data){
                    this.selectInfo(report);
    
                }
    
            }
        }) 
   }


    selectInfo(report){
        
            this.report.id = report.id;
            this.report.title = report.title;
            this.report.img = report.img;
            this.report.description = report.description;
            if(report.status == 0)
                this.pending_reports.push(report);
            else 
                this.active_reports.push(report);   
        
    }

    addInfoWindow(rid){
        this.showDetails(rid );
    }
    
    showDetails(rid){
        this.authservice.getReportInfo(rid).then( (data: any) => {
            if(data.error_code == null) {

                let modal = this.modalCtrl.create(MyModal,{rid:data.data});
                modal.present();
            }      
        })
       
    }


}
