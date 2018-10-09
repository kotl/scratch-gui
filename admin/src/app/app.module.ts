import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatInputModule, MatButtonModule, MatCheckboxModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { BrowseComponent } from './browse/browse.component';
import { ChangepwdComponent } from './changepwd/changepwd.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { PwddialogComponent } from './pwddialog/pwddialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { WarningComponent } from './warning/warning.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    BrowseComponent,
    ChangepwdComponent,
    PwddialogComponent,
    WarningComponent,
  ],
  imports: [
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    BrowserModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  entryComponents: [
    PwddialogComponent,
    WarningComponent,
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
