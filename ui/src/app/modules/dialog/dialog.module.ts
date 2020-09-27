import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

// Components
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatDialogModule
  ],
  exports: [DialogComponent],
  declarations: [DialogComponent],
  entryComponents: [DialogComponent]
})
export class DialogModule {}
