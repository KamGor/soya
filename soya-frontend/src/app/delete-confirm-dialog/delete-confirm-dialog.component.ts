import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrl: './delete-confirm-dialog.component.scss'
})
export class DeleteConfirmDialogComponent {
  constructor(private dialog: MatDialogRef<DeleteConfirmDialogComponent, { success: boolean }>) {}

  public accept() {
    this.dialog.close({
      success: true,
    });
  }

  public close() {
    this.dialog.close({
      success: false,
    });
  }
}
