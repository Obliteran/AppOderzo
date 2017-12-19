import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { UserData } from '../../providers/user-data';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';



@Injectable()
export class AuthService {
    url_server = 'https://appoderzo.epiave.com/'
    //url_server = 'https://segnalazioni.epiave.com/api/';
    //url_server = 'http://192.168.2.125/';  //test da device
    //url_server = 'http://lumen/';  //test da pc
    
    info = {
        operation: ''
    }; 
    
    constructor(public http: Http, public creds: UserData, private transfer: Transfer) {
        this.http = http;
    }
    
    //---------------------------------------------------------------------------------------
    //user context
    //---------------------------------------------------------------------------------------
    authenticate(user) {
        user.operation = "user-login";
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data_to_server = user;
        
        return new Promise(resolve => {
            this.http.post(this.url_server+"login", data_to_server, {headers: headers}).subscribe(data => {
                if(data.json().error_code == null){
                    this.creds.login(data.json().data.username,data.json().data.token);
                    resolve(data.json());
                    
                }
                else
                    resolve(data.json());
            });
        });
    }
    
    addUser(user) {
        user.operation = "user-create";
        var data_to_server = user;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(resolve => {
            this.http.post(this.url_server+"signup", data_to_server, {headers: headers}).subscribe(data => {
                if(data.json().error_code == null){
                   //this.creds.signup(data.json().data.username,data.json().data.token);
                    resolve(true);
                }
                else
                    resolve(false);
            });
        });
    }
    
    
    
    getUserInfo() { //da sistemare o cancellare
        
        var headers = new Headers();
        this.info.operation = "user-info";
            
        return new Promise(resolve => {
    
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            var data_to_server = this.info;
            this.http.post(this.url_server,data_to_server,{headers: headers}).subscribe(data => {
                if(data.json().error_code == null){
                   
                    resolve( data.json() );
                }
                else {
                    
                    resolve(data.json());
               
                }

            });
        })
    }
    
    getUserStatus(){ //la risposta del server restituisce tutti i campi dell'utente non solo lo status
        return this.creds.getToken().then((token) => {
            
            let info = {
                operation: '',
                token: '',
            }
            
            info.operation = "user-info";
            info.token = token;  
            var data_to_server = info;
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');

            return new Promise(resolve => {
                this.http.post(this.url_server+"getUserStatus", data_to_server, {headers: headers}).subscribe(data => {
                    if(data.json().error_code == null){
                        resolve(data.json().data);
                        
                        
                    }
                    else
                        resolve(data.json().data);
                        
                    });
            });
        });
    }
    
    
    getUserReports(){
        return this.creds.getToken().then((token) => {
            
            let info = {
                operation: '',
                token: '',
            }
            
            info.operation = "user-tickets"
            info.token = token;  
            var data_to_server = info;
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');

            return new Promise(resolve => {
                this.http.post(this.url_server+"getUserReports", data_to_server, {headers: headers}).subscribe(data => {
                    if(data.json().error_code == null){
                        resolve(data.json().data);
                        
                        
                    }
                    else
                        resolve(false);
                        
                    });
            });
        });
    
    }
    
    //---------------------------------------------------------------------------------------
    //photo context
    //---------------------------------------------------------------------------------------
    pictureTransfer(photos,id){
        
        const fileTransfer: TransferObject = this.transfer.create();
                
                var x = 0;
                var count = photos.length;
        

                
                 return new Promise(resolve => {
                   for(let entry of photos){
                       x++;
                       let options: FileUploadOptions = {

                            fileKey: 'file',
                            fileName: id+"_"+x+'.jpg',
                            headers: {},

                        }
                       
                        fileTransfer.upload(entry,this.url_server+'pictureTransfer',options).then((data) => {
                         
                            if(count<=1){
                               resolve(true);
                            }
                            count--;

                        }, (err) => {

                            resolve(false);
                        });
                   }
              });
    }
    
    
    //---------------------------------------------------------------------------------------
    //reports context
    //---------------------------------------------------------------------------------------
    getReports(){
        
        this.info.operation = "user-tickets";
        var data_to_server = this.info;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(resolve => {
            this.http.post(this.url_server+"getReports", data_to_server, {headers: headers}).subscribe(data => {
                if(data.json().error_code == null){
                    resolve(data.json().data);
                }
                else
                    resolve(data.json().data);
            });
        });
    }
    
    getReportInfo(rid){
    
        let info  = {
            operation: null,
            id: null
        };
        info.operation =  "user-tickets-info";
        info.id = rid;
        let data_to_server = info;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(resolve => {
            this.http.post(this.url_server+"getReportInfo", data_to_server, {headers: headers}).subscribe(data => {
                if(data.json().error_code == null){
                    resolve(data.json());
                }
                else
                    resolve(data.json());
            });
        });
       
    }
    
    
    sendReport(report){
        
        return this.getUserStatus().then((user: any) => {
            
            report.operation = "create-ticket";
            report.token = user.token;
            report.user_status = user.status;
            
            var data_to_server = report;
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');

            return new Promise(resolve => {
                this.http.post(this.url_server+"sendReport", data_to_server, {headers: headers}).subscribe(data => {
                    if(data.json().error_code == null){
                        
                        resolve(data.json());
                        
                        
                    }
                    else
                        resolve(data.json());
                        
                    });
            });
        });
    
    }
    
    //---------------------------------------------------------------------------------------
    //categories context
    //---------------------------------------------------------------------------------------
    
    getCategories(parent_id){
        
        let info = {
            operation: 'get-categories',
            parent_id: parent_id
        }
        var data_to_server = info;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return new Promise(resolve => {
            this.http.post(this.url_server+"getCategories", data_to_server, {headers: headers}).subscribe(data => {
                if(data.json().error_code == null){

                    resolve(data.json().data);


                }
                else
                    resolve(false);

                });
        });
    }
    
    
    
}