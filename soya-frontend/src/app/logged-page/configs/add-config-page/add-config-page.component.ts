import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../../api-client.service';
import { toast } from 'ngx-sonner';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-add-config-page',
  templateUrl: './add-config-page.component.html',
  styleUrl: './add-config-page.component.scss'
})
export class AddConfigPageComponent implements OnInit {
  public addConfigForm!: FormGroup;
  public itemsConfigForm!: FormArray<FormGroup<{ name: FormControl<string | null>, value: FormControl<string | null>, tags: FormControl<{name: string}[] | null> }>>;
  public suggestions: string[] = [];

  constructor(
    private router: Router,
    private apiClient: ApiClientService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.itemsConfigForm = new FormArray([
      this.getConfigFormGroup(),
    ]);
    this.addConfigForm = new FormGroup({
      items: this.itemsConfigForm,
    });
  }

  public async filterTags(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const params = new URLSearchParams();
    params.append('search', query);
    const { data } = await this.apiClient.get('/tags', params);
    this.suggestions = data;
  }

  private getConfigFormGroup() {
    return new FormGroup({
      name: new FormControl<string | null>('', [Validators.required]),
      value: new FormControl<string | null>('', []),
      tags: new FormControl<{ name: string }[] | null>(null, []),
    });
  }

  public addRow() {
    this.itemsConfigForm.push(this.getConfigFormGroup());
  }
  
  public deleteRow(index: number) {
    this.itemsConfigForm.removeAt(index);
  }

  public async submit() {
    if(this.itemsConfigForm.invalid) return;
    const mapped = this.itemsConfigForm.controls.map((control) => ({
      name: control.get('name')?.value,
      value: control.get('value')?.value,
      tagIds: control.get('tags')?.value?.map((tag) => tag.name),
    }));

    await this.apiClient.post('/configs', {
      configs: mapped,
    });

    toast('Configs have been successfully added.')

    await this.router.navigate(['..'], { relativeTo: this.route });
  }
}
