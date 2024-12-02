import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'authentication-app';
  constructor(private router:Router) {

  }
  showHeaderFooter(): boolean {
    const exculdeRoutes = ['login'];
    return !exculdeRoutes.includes(this.router.url.split('/')[1]);
  }

}
