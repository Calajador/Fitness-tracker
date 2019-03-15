import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { MatSnackBar } from '@angular/material';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private auth: AngularFireAuth,
    private trainingService: TrainingService, private snack: MatSnackBar) {}

  registerUser(authData: AuthData) {

    this.auth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        console.log(res);
        this.authSuccessfully();
      })
      .catch(err => {
        this.snack.open(err.message, null, {
          duration: 3000
        });
      });
  }

  login(authData: AuthData) {
    this.auth.auth.signInWithEmailAndPassword(authData.email, authData.password)
    .then(res => {
      console.log(res);
      this.authSuccessfully();
    })
    .catch(err => {
      this.snack.open(err.message, null, {
        duration: 3000
      });
    });
  }

  logout() {
    this.trainingService.cancelSubcriptions();
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }


  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
