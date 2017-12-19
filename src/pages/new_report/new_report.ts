import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Slides, Platform, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { AddDescriptionPage } from '../add_description/add_description';
import { AuthService } from '../authservice/authservice';
import { MyModal } from '../public_reports/public_reports';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Toast } from '@ionic-native/toast';

const area = 1000;
declare var google;

@Component({
  selector: 'page-new_report',
  templateUrl: 'new_report.html'
})
  
export class NewReportPage {
     @ViewChild(Slides) slides: Slides;
    
    nearReports: Boolean;
    pos;
    
    report = {
        id:null,
        title:null,
        img:null,
        description:null,
        lat:null,
        lng:null
    };

    reports = [];
    photoTaken:Boolean;
    isCamera = false;
    photos = [];
    numMaxPhotos = 3;
    
    isBlocked: Boolean;

    
    constructor(public navCtrl: NavController, public authservice: AuthService, public modalCtrl: ModalController, public geolocation: Geolocation, private camera: Camera, private imagePicker: ImagePicker, platform: Platform, private toast: Toast, private diagnostic: Diagnostic, public loadingCtrl: LoadingController ) {}
    
    ionViewDidLoad(){
         
        let loading = this.loadingCtrl.create({
                });
        loading.present();
        
        this.authservice.getUserStatus().then((data :any) => {
            
            loading.dismiss();
            if(data.status != 0) {
                this.isBlocked = false;
                this.photoTaken = false;
                this.currentPosition();
            }
            else 
                
                this.isBlocked = true;
        });
          console.log(this.photos); // debug
    }
    
        
    currentPosition(){
        
        this.diagnostic.isLocationEnabled().then((isAvaiable) => {
            if(isAvaiable){
                let loading = this.loadingCtrl.create({
                    content: 'Sto cercando tua posizione'
                });
                 setTimeout(() => {
                    loading.dismiss();
                }, 10000);

                loading.present();

                this.geolocation.getCurrentPosition({timeout:10000}).then((position) => {
                    this.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    
                    this.createReportsList();
                    this.nearReports = true;
                    loading.dismiss();
                    
                }).catch((error) => {
                    
                    this.nearReports = false;
                    this.pos = null;
                    console.log(error);
                    loading.dismiss();
                });
            }
            
            else{
                
                this.nearReports = false;
                this.pos = null;
              
            }
       }).catch(error=>{
            console.log(error);
             this.nearReports = false;
            this.pos = null;
        });
        
        
    }

    createReportsList(){
        this.authservice.getReports().then( (data: any) => {
            if(data.length >0) {
    
                for(let report of data){
                    this.selectInfo(report);
                }
                if(!(this.reports.length > 0))
                    this.nearReports = false;

                }
            else    
                this.nearReports = false;
        }) 
   }


    selectInfo(report){
        var coords = report.latitude + "," + report.longitude;
        var latlng = this.getLatLngFromString(coords);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, this.pos);
        if(distance<area){
            this.report.id = report.id;
            this.report.title = report.title;
            this.report.img = report.img;
            this.report.description = report.description;
            this.reports.push(report);
                
        }
    }
        
    
    getLatLngFromString(coords) {
        var latlng = coords.split(/, ?/)
        return new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1])); 
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


    changeStatus(){
        
        this.nearReports = false;
    }
    
    
    takePicture(){
        this.toast.hide();
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true
        }
        
        
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            this.photos.push(imageData);
            if(this.photos.length > 0){
                this.photoTaken = true;
                this.isCamera = true;
           
            }
        }, (err) => {
                // Handle error
                console.log(err);
            });    
    }   
    
    
    addPicture(){
        if(this.isCamera)
            this.takePicture();
        else 
            this.choosePicture();
    }
    


    choosePicture(){
        
        
         this.toast.hide();   
         const options: ImagePickerOptions = {
            maximumImagesCount: this.numMaxPhotos-this.photos.length,
        }
        
        this.imagePicker.getPictures(options).then((results) => {
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                this.photos.push(results[i])
            }
            if(this.photos.length > 0){
                
                this.photoTaken = true;
            }
        }, (err) => { console.log(err) });
        this.isCamera = false;
    }

    deletePicture(){
        let currentIndex = this.slides.getActiveIndex();
        this.photos.splice(currentIndex, 1);
            if(currentIndex == this.photos.length)
                this.slides.slidePrev();
     
        this.slides.update();
        if(this.photos.length<1)
            this.photoTaken = false;
        
    }
    
    openSelectCategoryPage(){
        
       this.navCtrl.push(AddDescriptionPage,{
            photos : this.photos
        });

    }
}