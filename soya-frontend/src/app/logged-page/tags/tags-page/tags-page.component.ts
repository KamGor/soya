import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ApiClientService } from '../../../api-client.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../../delete-confirm-dialog/delete-confirm-dialog.component';
import { toast } from 'ngx-sonner';
import { TablePageEvent } from 'primeng/table';

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.component.html',
  styleUrl: './tags-page.component.scss'
})
export class TagsPageComponent implements OnInit {

  public isLoading: boolean = true;

  public itemsCount: number = 0;

  public page: number = 0;
  public pageSize: number = 25;
  public items: any[] = [];

  constructor(
    private apiClient: ApiClientService,
    private dialog: MatDialog,
  ) {}

  public async ngOnInit() {
    this.getData();
  }

  public async getData() {
    this.isLoading = true;
    const params = new URLSearchParams();
    params.append('page', (this.page + 1).toString())
    params.append('itemsPerPage', this.pageSize.toString());
    const { count, data } = await this.apiClient.get('/tags', params);
    this.itemsCount = count;
    this.items = data;
    this.isLoading = false;
  }

  public async handlePageEvent(e: TablePageEvent) {
    console.log(e);
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
        await this.apiClient.delete(`/tags/${id}`);
        toast(`Tag "${id}" deleted!`);
        this.getData();
      }
    });
  }
}
