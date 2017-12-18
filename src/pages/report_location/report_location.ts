import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ViewController, ActionSheetController  } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AuthService } from '../authservice/authservice';
import { HomePage } from '../home/home';
import { SocialSharing } from '@ionic-native/social-sharing';


declare var google;

@Component({
  selector: 'page-report_location',
  templateUrl: 'report_location.html'
})
export class ReportLocationPage {
    
    @ViewChild('map') mapElement: ElementRef;
        map: any;
    
    pos;
    comune = new google.maps.LatLng(45.780000, 12.495330);
    marker = null;
    modal;
    
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public  geolocation: Geolocation, public authservice: AuthService, public alertCtrl: AlertController, public modalCtrl: ModalController) {}
    

    ionViewDidLoad(){
        
        this.currentPosition();
        this.modal = this.modalCtrl.create(InfoBox,{data:null},{enableBackdropDismiss:false,showBackdrop: false });
        
        
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
        
        google.maps.event.addListener(this.map, 'click', (event) => {
            this.placeMarker(event.latLng, this.map);
        }, false);
       
    
    }
    
    currentPosition(){
        this.geolocation.getCurrentPosition().then((position) => {
        this.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.loadMap();
        this.placeMarker(this.pos,this.map);
            
        }).catch((error) => {
            this.pos = this.comune
            this.loadMap();
        });
        
    }
    
    
    placeMarker(latLng,map){
        
        
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: "./assets/map-marker.png",
            draggable: true
        });
        this.marker = marker;
        google.maps.event.clearInstanceListeners(map);
       
           

    }
    
    
    sendRepo(){
        let photos = this.navParams.get("photos");
        let report = {
            description: this.navParams.get("description"),
            cat: this.navParams.get("cat"),
            subCat: this.navParams.get("subCat"),
            lat: this.marker.position.lat(),
            lng: this.marker.position.lng()
            }       
        
        this.authservice.sendReport(report).then(data => {
            if(data) {
                
                this.authservice.pictureTransfer(photos).then(data => {
                    
                    if(data){
                        this.modal.present();   
                    }
                    else{
                        var alert = this.alertCtrl.create({
                            title: 'Errore',
                            subTitle: 'Si è verificato un errore, riprova più tardiiiii!',
                            buttons: ['ok']
                        });
                        alert.present();
                    }
                })
            }
            else {
    
                var alert = this.alertCtrl.create({
                        title: 'Errore',
                        subTitle: 'Si è verificato un errore, riprova più tardi',
                        buttons: ['ok']
                });
                alert.present();
            }
        });
    
       
    }



}


@Component({
 template: `
<ion-header>
  <ion-toolbar>
    <ion-title text-center>
        Evviva!
    </ion-title>
   
  </ion-toolbar>
</ion-header>

<ion-content>
<div class="modal_container" text-center>
    <p>La tua segnalazione è stata inviata con successo!</p>
<button ion-button icon-left (click)=createActionSheet()> <ion-icon name='share'></ion-icon> Condividi </button>      
    <button ion-button (click)=dismiss()> Torna in Home </button>
</div>   
</ion-content>`
})
export class InfoBox {

 constructor(params: NavParams, public viewCtrl: ViewController, public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, private socialSharing: SocialSharing) {
 }
    
    dismiss() {
        this.viewCtrl.dismiss();
        this.navCtrl.setRoot(HomePage);    
  }
    
    
    createActionSheet(){
            
       const actionSheet = this.actionSheetCtrl.create({
            title: 'Condividi con:',
            buttons: [
            {
                text: 'Facebook',
                icon: 'logo-facebook',
                handler: () => {
                    this.socialSharing.shareViaSMS('messaggio di testo qui','').then((data) => {
                        // Success!
                        console.log('success');
                    }).catch((err) => {
                        // Error!
                        console.log('err');
                    });
                }
           },
           {
                text: 'Twitter',
                icon: 'logo-twitter',
                handler: () => {
                   console.log('twitter clicked');
                }
           },
           {
             text: 'Instagram',
             icon: 'logo-instagram',
             handler: () => {
               console.log('instagram clicked');
             }
           },
            {
                text: 'Annulla',
                role: 'cancel',
                icon: 'close',

            }
         ]
       });

        actionSheet.present();
    }
}
