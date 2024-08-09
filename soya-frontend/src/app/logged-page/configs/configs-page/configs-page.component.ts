import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../../api-client.service';
import { MatDialog } from '@angular/material/dialog';
import { TablePageEvent } from 'primeng/table';
import { DeleteConfirmDialogComponent } from '../../../delete-confirm-dialog/delete-confirm-dialog.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-configs-page',
  templateUrl: './configs-page.component.html',
  styleUrl: './configs-page.component.scss'
})
export class ConfigsPageComponent implements OnInit {
  public isLoading: boolean = true;
  public itemsCount: number = 0;

  public page: number = 0;
  public pageSize: number = 25;
  public items: any[] = [];

  constructor(
    private apiClient: ApiClientService,
    private dialog: MatDialog,
  ) {}

  public ngOnInit() {
    this.getData();
  }

  public async getData() {
    this.isLoading = true;
    const params = new URLSearchParams();
    params.append('page', (this.page + 1).toString())
    params.append('itemsPerPage', this.pageSize.toString());
    const { count, data } = await this.apiClient.get('/configs', params);
    this.itemsCount = count;
    this.items = data;
    this.isLoading = false;
  }

  public async handlePageEvent(e: TablePageEvent) {
    this.page = e.first / e.rows;
    this.pageSize = e.rows;
    this.getData();
  }

  public async delete(id: string) {
    const dialog = this.dialog.open<DeleteConfirmDialogComponent, undefined, { success: boolean }>(DeleteConfirmDialogComponent, {
      width: '33%'
    })
    dialog.afterClosed().subscribe(async (result) => {
      if(result?.success) {
        await this.apiClient.delete(`/configs/${id}`);
        toast(`Tag "${id}" deleted!`);
        this.getData();
      }
    });
  }
}
