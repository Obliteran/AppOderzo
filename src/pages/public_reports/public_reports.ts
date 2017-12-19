import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, ModalController, NavParams, ViewController } from 'ionic-angular';
import {Http} from '@angular/http';
import { AuthService } from '../authservice/authservice';

declare var google;

@Component({
  selector: 'page-public_reports',
  templateUrl: 'public_reports.html'
})
export class ReportsPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    
    infoWindow = new google.maps.InfoWindow({
        content: null
    });
    
    comune = new google.maps.LatLng(45.780000, 12.495330);
    pos;
    
    constructor(public navCtrl: NavController, public http: Http, public alertCtrl: AlertController, public modalCtrl: ModalController, public authservice: AuthService) {
     
    }
        
    ionViewDidLoad(){
        
        this.pos = this.comune;
        this.loadMap();
        this.getMarkers();
        this.addInfoWindows();
             
    }
           

    loadMap() {
        // create LatLng object
    
        let mapOptions = {
          center: this.pos,
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          fullscreenControl: true
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        
    
    }
    
    getMarkers(){
        
        this.authservice.getReports().then( (data: any) => {
            
            for(let report of data){
                    this.addMarkers(report);
                }

        });      
          
    }
    
    
    
    addMarkers(rep){
        
        var id = rep.id;
        var x = rep.latitude;
        var y = rep.longitude;
        var title = rep.title;
        var description = rep.description;
        var icon;
        var img = rep.img;
       
        
        let pos = new google.maps.LatLng(x,y);
        
        /*switch (vet.status) {
            case '0': 
                color =  {url: "../../assets/map-marker.png"} ;
                break;
            case '1':
                color = "yellow";
                break;
            case '2':
                color = "green";
                break;
            default:
                color = "red";
                    
        }*/
    
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: pos,
            icon: "./assets/map-marker.png"
        
        });
        
     
        let content = "<h6>"+title+"</h6> <img src='"+img+"' width='200px' height='150px' name='"+title+"' alt='"+title+"'> <a class='info' rid='"+id+"'> DETTAGLI > </a>" ;
 
        //this.addInfoWindow(marker, content);
      
        google.maps.event.addListener(marker, 'click', () => {
        this.infoWindow.close();
        this.infoWindow.setContent(content);
        this.infoWindow.open(this.map, marker);
        
       });
        
       }
        
    addInfoWindows(){
 
        google.maps.event.addListener(this.infoWindow, 'domready', () => {
            document.getElementsByClassName('info')[0].addEventListener('click', () => {
            let rid = document.getElementsByClassName("info")[0].getAttribute("rid");
                this.showDetails(rid);
            }, false);
        }); 
        
   
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

@Component({
 template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      {{modal.title}}
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" hideWhen="ios"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
 <ion-item >
  <ion-slides class="slides" pager="true" zoom="true">

    <ion-slide *ngFor="let item of modal.images">
    <div class="swiper-zoom-container">
      <img src="{{item}}"/>
    </div>
      
    </ion-slide>
    </ion-slides>
  </ion-item>

        
        
        
      <ion-item>
        
        <h2>{{modal.address}}</h2>
        <p> {{modal.description}}</p>
      </ion-item>
    
     
   
        
    
    
</ion-content>`
})



export class MyModal {
modal = {
    
    title:null,
    description:null,
    images:null,
    address:null
    
}
constructor(params: NavParams, public viewCtrl: ViewController) {
    this.modal.title = params.get('rid').title;
    this.modal.description = params.get('rid').description;
    this.modal.images = params.get('rid').images;
    this.modal.address = params.get('rid').address;
}
      
    
    
dismiss() {
    this.viewCtrl.dismiss();
  }

}




