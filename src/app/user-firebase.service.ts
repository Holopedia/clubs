import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from '../../node_modules/rxjs';
import { AngularFireDatabase, AngularFireList  } from '../../node_modules/angularfire2/database';
import { Time } from '@angular/common';
import { timestamp } from 'rxjs/internal/operators/timestamp';

// Entity
import { User } from './entity/user/user';

// Helper classes
import { JsonConverter } from './entity/helper/json-converter';

// Session storage
import { SessionStorage, SessionStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService {

  dbPath: string = '/users';

  usersObservable: Observable<any[]>;

  jsonConverter: JsonConverter = new JsonConverter();

  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase, 
    public session: SessionStorageService) { }

  // CRUD

  getUsers() {
    this.usersObservable = this.getList(this.dbPath);
  }

  getList(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

  getUserByEmail(email: string) {
    let path = this.dbPath+"/"+this.convertEmailToKey(email);
    this.db.object(path).valueChanges().subscribe(data => {
      let user = this.jsonToObj(JSON.stringify(data));
      this.setStorage(user);
    });
  }

  getUserByIndex(idx: number) {
    let path = this.dbPath+"/"+idx;
    this.db.object(path).valueChanges().subscribe(data => {
      let user = this.jsonToObj(JSON.stringify(data));
      this.setStorage(user);
    });
  }

  insertUser(user: User) {
    let entry = this.objToJSON(user);
    const usersRef = this.db.list(this.dbPath);
    this.db.object(this.dbPath+"/"+this.convertEmailToKey(user.email)).update(entry);
   }
 
   updateUser(key: string, user: User) {
    let entry = this.objToJSON(user);
    const usersRef = this.db.list(this.dbPath);
    usersRef.set('key', entry);
   }
 
   deleteuser(key: string) {
     const usersRef = this.db.list(this.dbPath);
     usersRef.remove(key);
   }

   // Session storage
   setStorage(user: User, expired: number = 0) {
    this.session.set("user", user, expired, 's');
   }

   getStorage(): User {
     let user =  this.session.get("user");
     console.log(user);
     return user;
   }

   objToJSON(userObject : User): string {
     return JSON.parse(JSON.stringify(userObject));
   }

   jsonToObj(json: string) : User {
     let obj : User = this.jsonConverter.convertJsonToUserObj(json);
     return obj;
   }

   convertEmailToKey(email: string) : string {
    return email.replace('.', '¤');
   }

   convertKeyToEmail(key: string) {
    return key.replace('¤','.');
   }

}
