import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UserData {
    HAS_LOGGED_IN = 'hasLoggedIn';
    HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
    
    

    constructor(public events: Events, public storage: Storage) {}
    
        login(username: string, token: string): void {
            this.storage.set(this.HAS_LOGGED_IN, true);
            this.setUsername(username);
            this.setToken(token);
            this.events.publish('user:login');
        }

        signup(username: string, token: string): void {
            this.storage.set(this.HAS_LOGGED_IN, true);
            this.setUsername(username);
            this.setToken(token);
            this.events.publish('user:signup');
        }
    
        logout(): void {
            this.storage.remove(this.HAS_LOGGED_IN);
            this.storage.remove('username');
            this.storage.remove('token');
            this.events.publish('user:logout');
        }
        setToken(token: string){
            this.storage.set('token', token);

        }

        getToken(): Promise<string> {
            return this.storage.get('token').then((value) => {
                return value;
            });
        }
        setUsername(username: string): void {
            this.storage.set('username', username);
        }

        getUsername(): Promise<string> {
            return this.storage.get('username').then((value) => {
              return value;
            });
        }

        hasLoggedIn(): Promise<boolean> {
            return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
              return value === true;
            });
        }

        checkHasSeenTutorial(): Promise<string> {
            return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
              return value;
            });
        }
        
}
