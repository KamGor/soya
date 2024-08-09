import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../../api-client.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-tag-page',
  templateUrl: './edit-tag-page.component.html',
  styleUrl: './edit-tag-page.component.scss'
})
export class EditTagPageComponent {
  public addTagForm!: FormGroup;
  public itemsTagForm!: FormArray<FormGroup<{ name: FormControl }>>;
  public isLoading: boolean = true;
  public tagName: string = '';

  constructor(
    private router: Router,
    private apiClient: ApiClientService,
    private route: ActivatedRoute,
  ) {}

  public async ngOnInit() {
    this.isLoading = true;
    this.itemsTagForm = new FormArray([
      new FormGroup({
        name: this.getTagFormControl(),
      }),
    ]);
    this.addTagForm = new FormGroup({
      items: this.itemsTagForm,
    });

    await this.getData();
    this.isLoading = false;
  }

  public async getData() {
    const { tagId } = await firstValueFrom(this.route.params);
    this.tagName = tagId;

    const { name } = await this.apiClient.get(`/tags/${tagId}`);
    this.itemsTagForm.get('0')!.get('name')!.setValue(name);
  }

  private getTagFormControl() {
    return new FormControl('', [Validators.required]);
  }

  public async submit() {
    if(this.itemsTagForm.invalid) return;
    const mapped = this.itemsTagForm.controls.map((control) => ({
      name: control.get('name')?.value,
    }));

    await this.apiClient.put(`/tags/${this.tagName}`, mapped[0]);

    toast('Tag has been successfully updated.')

    await this.router.navigate(['..'], { relativeTo: this.route });
  }
}
