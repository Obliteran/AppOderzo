import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ViewController, App, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AuthService } from '../authservice/authservice';
import { HomePage } from '../home/home';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Toast } from '@ionic-native/toast';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { Transfer} from '@ionic-native/transfer';

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
    postal_code = 31046;
    marker = null;
    
    
    // Property used to store the callback of the event handler to unsubscribe to it when leaving this page
    public unregisterBackButtonAction: any;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public  geolocation: Geolocation, public authservice: AuthService, public alertCtrl: AlertController, public modalCtrl: ModalController, private toast: Toast, private diagnostic: Diagnostic, public platform: Platform, private transfer: Transfer, public loadingCtrl: LoadingController) {}
      
    ionViewDidEnter() {
        this.initializeBackButtonCustomHandler();
        this.currentPosition();
    }

    ionViewDidLoad(){
        
        this.pos = this.comune;
        this.loadMap();
       
    }
        
    ionViewWillLeave() {
        // Unregister the custom back button action for this page
        this.unregisterBackButtonAction && this.unregisterBackButtonAction();
    }
       
    loadMap() {
        let loading = this.loadingCtrl.create({
                    
                });
        loading.present();
        // create LatLng object
        let mapOptions = {
          center: this.pos,
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          fullscreenControl: true
        }
        
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        loading.dismiss();
       
            google.maps.event.addListener(this.map, 'click', (event) => {
                if(this.marker==null){
                    this.placeMarker(event.latLng, this.map);
                    this.toast.hide();
                    
                }
        }, false);
       
       
        
        
    }
    
    currentPosition(){
        this.toast.hide();
        this.diagnostic.isLocationEnabled().then((isAvaiable) => {
            if(isAvaiable){
                let options = {
                message: 'Sto cercando la tua posizione, in alternativa puoi selezionare un punto della mappa',
                duration: 30000,
                position: 'top',
                styling: {opacity:0.7,backgroundColor:'black', textColor:'white'},
                dismissOnPageChange: true
                }
                this.toast.showWithOptions(options).subscribe(toast => {

                });
                this.geolocation.getCurrentPosition().then((position) => {

                    this.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    if(this.marker==null){
                        this.placeMarker(this.pos,this.map);
                        this.map.setCenter(this.pos);
                        
                    }
                    console.log('posizione presa');
                    this.toast.hide();

                }).catch((error) => {
                    console.log('posizione non presa');
                    this.toast.hide();
                });
            }
            
            else{
                let options = {
                message: 'Attiva la posizione o seleziona manualmente un punto della mappa',
                duration: 5000,
                position: 'center',
                styling: {opacity:1,backgroundColor:'black', textColor:'white'},
                dismissOnPageChange: true
                }
                this.toast.showWithOptions(options).subscribe(toast => {

                });
            }
       }).catch(error=>{
            console.log(error);
        });
        
       }
    
                                           
                                                
    placeMarker(latLng,map){
        this.toast.hide();
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: "./assets/map-marker.png",
            draggable: true
        });
        
        google.maps.event.clearInstanceListeners(map);
        this.marker = marker;

        
    }
    
    send(){ 
        
        if(this.marker!=null){
        //reverse geocoding(Google maps api)
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({location:this.marker.position}, 
        ((results, status) => {
            if (status == 'OK') { 
                
                for(let address of results){
                    if(address.types[0] == "street_address" || address.types[0] == "route")
                            for(let item of address.address_components)
                                if(item.types[0]=="postal_code")
                                    this.sendReport(address.formatted_address,item.short_name);
                
                
                }
            }
            else {
                this.sendReport(null,null)
               
            }
        }));
    
        }
        else{
             var alert = this.alertCtrl.create({
                title: 'Attenzione',
                subTitle: 'Per favore specifica il punto del problema',
                buttons: ['ok']
            });
            alert.present();
        }
    }
    
    sendReport(address,postal_code){
        this.toast.hide(); //per assicurarsi che non siano rimasti toast aperti
        
        if(postal_code != this.postal_code){
            
            var alert = this.alertCtrl.create({
                title: 'Attenzione',
                subTitle: 'Devi selezionare una zona all\'interno del tuo comune',
                buttons: ['ok']
            });
            alert.present();
            
        }
        else{
        
        
        let photos = this.navParams.get("photos");
        
         let report = {
            description: this.navParams.get("description"),
            cat_id: this.navParams.get("cat_id"),
            title: this.navParams.get("subCat_name"),
            lat: this.marker.position.lat(),
            lng: this.marker.position.lng(),
            subCat_id: this.navParams.get("subCat_id"),
            address: address
            }       
        
         let loading = this.loadingCtrl.create({
            content: 'Invio in corso...il tempo di attesa dipende dalla velocità della tua rete'
        });
                 
        loading.present();
        
        this.authservice.sendReport(report).then((data : any) => {
           var  id = data.data.id;
            
            if(data.error_code == null) {
                
               this.authservice.pictureTransfer(photos,id).then((photoOk)=>{
                   
                   if(photoOk){
                        loading.dismiss();
                       let modal = this.modalCtrl.create(InfoBox,{id},{enableBackdropDismiss:false,showBackdrop: false });
                        modal.present();
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
   

                         
    
    initializeBackButtonCustomHandler(): void {
        this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
           
        }, 10);
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
<button ion-button icon-left (click)=showShare()> <ion-icon name='share'></ion-icon> Condividi </button>      
    <button ion-button (click)=dismiss()> Torna in Home </button>
</div>   
</ion-content>`
})
export class InfoBox {
    
    id;
 constructor(public navParams: NavParams, public viewCtrl: ViewController, public navCtrl: NavController, private socialSharing: SocialSharing, public appCtrl : App) {
 
     this.id= navParams.get('id');
    }
    

    dismiss() {
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNav().setRoot(HomePage);
    }
    
    
    showShare(){
            
     let url = 'https://segnalazioni.epiave.com/'+this.id; //da aggiungere l'id della segnalazione che è nella variabile "id"
        
         this.socialSharing.share('Ciao, ho appena segnalato un problema al comune di Oderzo con questa fantastica app, provala anche tu!','OderzoApp','',url).then((data) => {
                 // Success!
                 console.log('success');
            }).catch((err) => {
                 // Error! 
                 console.log('err');
            });
    }
}
