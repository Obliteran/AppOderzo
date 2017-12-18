import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { UserData } from '../../providers/user-data';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@Injectable()
export class AuthService {
    url_server = 'https://segnalazioni.epiave.com/api/';
    
    
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
            this.http.post(this.url_server, data_to_server, {headers: headers}).subscribe(data => {
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
            this.http.post(this.url_server, data_to_server, {headers: headers}).subscribe(data => {
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
                this.http.post(this.url_server, data_to_server, {headers: headers}).subscribe(data => {
                    if(data.json().error_code == null){
                        resolve(data.json().data);
                        
                        
                    }
                    else
                        resolve(false);
                        
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
                this.http.post(this.url_server, data_to_server, {headers: headers}).subscribe(data => {
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
    pictureTransfer(photos){
        
        for(let entry of photos){
        
        
        
            const fileTransfer: TransferObject = this.transfer.create();

            /*let options: FileUploadOptions = {

                fileKey: 'file',
                fileName: 'name.jpg',
                headers: {}
            }*/

            return fileTransfer.upload(entry,this.url_server).then((data) => {

                return data;
            }, (err) => {
           return err;
            })
        }   
        
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
            this.http.post(this.url_server, data_to_server, {headers: headers}).subscribe(data => {
                if(data.json().error_code == null){
                    resolve(data.json().data);
                }
                else
                    resolve(false);
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
            this.http.post(this.url_server, data_to_server, {headers: headers}).subscribe(data => {
                if(data.json().error_code == null){
                    resolve(data.json());
                }
                else
                    resolve(false);
            });
        });
       
    }
    
    
    sendReport(report){
        
        return this.creds.getToken().then((token) => {
            
            report.operation = "create-ticket";
            report.token = token;  
            var data_to_server = report;
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');

            return new Promise(resolve => {
                this.http.post(this.url_server, data_to_server, {headers: headers}).subscribe(data => {
                    if(data.json().error_code == null){
                        resolve(true);
                        
                        
                    }
                    else
                        resolve(false);
                        
                    });
            });
        });
    
    }
}