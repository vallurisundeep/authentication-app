import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '../auth/auth.module';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  declarations: [],
  imports: [

    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    RouterModule.forRoot([...routes])

  ],
  exports:[RouterModule]
})
export class AppModule { }
