import { EventEmitter, Output, Component, OnInit, Input } from '@angular/core';
import { LoginState, ApiClient } from '../api.client';

@Component({
  selector: 'app-changepwd',
  templateUrl: './changepwd.component.html',
  styleUrls: ['./changepwd.component.css']
})
export class ChangepwdComponent implements OnInit {
  @Output() onPasswordChanged: EventEmitter<boolean> = new EventEmitter();

  @Input() username: string;
  @Input() title = '';
  @Output() error = '';
  @Input() newpassword = '';
  @Input() confirmpassword = '';

  constructor(  private apiClient: ApiClient) { }

  ngOnInit() {
  }

  onChangePwd() {
    if (this.newpassword.length < 4) {
      this.error = 'Password must be at least 4 characters long.';
      return;
    }
    if (this.newpassword !== this.confirmpassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.apiClient.changePassword(this.username, this.newpassword).subscribe(
      (status) => {
        this.error = status.error;
        if (!this.error) {
          this.onPasswordChanged.emit(true);
        }
      });
  }

}
