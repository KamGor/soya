import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../../api-client.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-tag-page',
  templateUrl: './add-tag-page.component.html',
  styleUrl: './add-tag-page.component.scss'
})
export class AddTagPageComponent implements OnInit {
  public addTagForm!: FormGroup;

  public itemsTagForm!: FormArray<FormGroup<{ name: FormControl }>>;

  constructor(
    private router: Router,
    private apiClient: ApiClientService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.itemsTagForm = new FormArray([
      new FormGroup({
        name: this.getTagFormControl(),
      }),
    ]);
    this.addTagForm = new FormGroup({
      items: this.itemsTagForm,
    });
  }

  private getTagFormControl() {
    return new FormControl('', [Validators.required]);
  }

  public addRow() {
    this.itemsTagForm.push(new FormGroup({
      name: this.getTagFormControl(),
    }));
  }

  public deleteRow(index: number) {
    this.itemsTagForm.removeAt(index);
  }

  public async submit() {
    if(this.itemsTagForm.invalid) return;
    const mapped = this.itemsTagForm.controls.map((control) => ({
      name: control.get('name')?.value,
    }));

    await this.apiClient.post('/tags', {
      tags: mapped,
    });

    toast('Tags have been successfully added.')

    await this.router.navigate(['..'], { relativeTo: this.route });
  }
}
