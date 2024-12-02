import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth.route';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
    HttpClientModule
  ],
  exports: [LoginComponent]
})
export class AuthModule { }
