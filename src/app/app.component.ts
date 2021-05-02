import { Component, Renderer2} from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User;

  constructor(private accountService: AccountService, private renderer:Renderer2) {
      this.accountService.user.subscribe(x => this.user = x);
      console.log("localStorage.getItem('user'): " , localStorage.getItem('user'));
      
      localStorage.getItem('user') ?
        renderer.addClass(document.body, "container-bg"):
        renderer.removeClass(document.body, "container-bg")
  }

  logout() {
      this.accountService.logout();
  }
}
